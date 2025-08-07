import { uploadToMinio } from './minio.js'

export const uploadToStorage = async (clientId, file, objectName) => {
  return uploadToMinio(clientId, file, objectName)
}