import { nanoid } from 'nanoid'
import { uploadToStorage } from '../storage/index.js'
import { findMediaById, saveMedia } from '../repositories/media.repository.js'
import { generateSignedUrl } from '../storage/minio.js'
import { generateBlurhash } from '../utils/blurhash.js'
import { publishMessage } from '../messaging/rabbitmq.js'
import { generateObjectName, getFileExtension, isImage, isVideo } from '../utils/file.js'
import { extension } from 'mime-types'
import { generateProcessingConfig } from '../utils/processing.js'
import { generateObjectPath } from '../utils/path.js'
import { env } from '../config/env.js'
import { generateSignedPlaylist } from '../utils/hls.js'

export const getMediaById = async (clientId, mediaId) => {
  const media = await findMediaById(mediaId)
  if (!media) return null

  if (isVideo(media.mimetype)) {
    media.url = await generateObjectPath(clientId, media);
  } else {
    const objectPath = await generateObjectPath(clientId, media);
    const signedUrl = await generateSignedUrl(objectPath);
    media.url = signedUrl;
  }

  return media
}

export const uploadMultipleFiles = async (clientId, files, userId) => {
  const uploadedMedia = []

  for (const file of files) {
    const id = nanoid()

    const rawFileExtension = extension(file.mimetype)

    const rawObjectName = generateObjectName(id, rawFileExtension)

    const url = await uploadToStorage(clientId, file, rawObjectName)

    const blurhash = file.mimetype.startsWith('image/') ? await generateBlurhash(file.buffer) : null

    const mediaData = {
      _id: id,
      url,
      uploadedBy: userId,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      blurhash,
      status: 'pending',
      clientId,
      formats: {
        raw: getFileExtension(file.originalname),
        processed: isImage(file.mimetype) ? ['webp'] : [],
      },
      resolutions: [480],
      processingConfig: generateProcessingConfig(file.mimetype),
    }

    const savedMedia = await saveMedia(mediaData)

    if (isVideo(savedMedia.mimetype)) {
      savedMedia.url = await generateObjectPath(clientId, savedMedia);
    } else {
      const objectPath = await generateObjectPath(clientId, savedMedia);
      const signedUrl = await generateSignedUrl(objectPath);
      savedMedia.url = signedUrl;
    }

    publishMessage('media', 'file', 'uploaded', {
      clientId,
      mediaId: savedMedia._id,
      objectName: rawObjectName,
      uploadedBy: userId,
      mimetype: file.mimetype,
      size: file.size,
      timestamp: Date.now(),
      processingConfig: savedMedia.processingConfig,
    })

    uploadedMedia.push({ ...savedMedia.toObject(), url: savedMedia.url })
  }

  return uploadedMedia
}

export const getSignedPlaylistContent = async (clientId, mediaId) => {
  return await generateSignedPlaylist(clientId, mediaId);
}