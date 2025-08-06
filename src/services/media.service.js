import { nanoid } from 'nanoid'
import { uploadToStorage } from '../storage/index.js'
import { findMediaById, saveMedia } from '../repositories/media.repository.js'

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

    uploadedMedia.push(savedMedia)
  }

  return uploadedMedia
}