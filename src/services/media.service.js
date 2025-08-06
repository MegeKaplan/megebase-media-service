import { nanoid } from 'nanoid'
import { uploadToStorage } from '../storage/index.js'
import { findMediaById, saveMedia } from '../repositories/media.repository.js'
import { generateSignedUrl } from '../storage/minio.js'

export const getMediaById = async (id) => {
  return await findMediaById(id)
}

export const uploadMultipleFiles = async (files, userId) => {
  const uploadedMedia = []

  for (const file of files) {
    const id = nanoid()

    const url = await uploadToStorage(file, id)

    const mediaData = {
      _id: id,
      url,
      uploadedBy: userId,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }

    const savedMedia = await saveMedia(mediaData)

    const signedUrl = await generateSignedUrl(savedMedia._id)

    uploadedMedia.push({...savedMedia.toObject(), url: signedUrl});
  }

  return uploadedMedia
}