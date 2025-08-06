import { uploadToMinio } from './minio.js'

export const uploadToStorage = async (file, objectName) => {
  return uploadToMinio(file, objectName)
}