import { nanoid } from 'nanoid'
import { uploadToStorage } from '../storage/index.js'
import { saveMedia } from '../repositories/media.repository.js'

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
    console.log(savedMedia);

    uploadedMedia.push(mediaData)
  }

  return uploadedMedia
}