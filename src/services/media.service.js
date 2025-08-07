import { nanoid } from 'nanoid'
import { uploadToStorage } from '../storage/index.js'
import { findMediaById, saveMedia } from '../repositories/media.repository.js'
import { generateSignedUrl } from '../storage/minio.js'
import { generateBlurhash } from '../utils/blurhash.js'
import { publishMessage } from '../messaging/rabbitmq.js'

export const getMediaById = async (clientId, mediaId) => {
  const media = await findMediaById(mediaId)
  if (!media) return null
  const signedUrl = await generateSignedUrl(clientId, mediaId)
  if (!signedUrl) return null
  media.url = signedUrl
  return media
}

export const uploadMultipleFiles = async (clientId, files, userId) => {
  const uploadedMedia = []

  for (const file of files) {
    const id = nanoid()

    const url = await uploadToStorage(clientId, file, id)

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
    }

    const savedMedia = await saveMedia(mediaData)

    const signedUrl = await generateSignedUrl(clientId, savedMedia._id)

    publishMessage('media', 'file', 'uploaded', {
      clientId,
      mediaId: savedMedia._id,
      uploadedBy: userId,
      mimetype: file.mimetype,
      size: file.size,
      timestamp: Date.now(),
    })

    uploadedMedia.push({ ...savedMedia.toObject(), url: signedUrl })
  }

  return uploadedMedia
}