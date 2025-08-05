import { nanoid } from 'nanoid'
import { uploadToMinio } from '../storage/minio.js'

export const uploadMultipleFiles = async (files) => {
  const uploaded = []

  for (const file of files) {
    const id = nanoid()
    await uploadToMinio(file, id).then((url) => {
      uploaded.push({
        id,
        url,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return url
    }).catch((error) => {
      console.error(`Error uploading file ${file.originalname}:`, error)
      throw error
    })
  }

  return uploaded
}