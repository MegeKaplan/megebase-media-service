import { nanoid } from 'nanoid'
import { uploadToStorage } from '../storage/index.js'
import { findMediaById, saveMedia } from '../repositories/media.repository.js'
import { generateSignedUrl } from '../storage/minio.js'
import { generateBlurhash } from '../utils/blurhash.js'

export const getMediaById = async (id) => {
  return await findMediaById(id)
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
    }

    const savedMedia = await saveMedia(mediaData)

    const signedUrl = await generateSignedUrl(clientId, savedMedia._id)

    uploadedMedia.push({ ...savedMedia.toObject(), url: signedUrl })
  }

  return uploadedMedia
}