import { uploadToGCS } from './gcs.js';
import { uploadToMinio } from './minio.js'

export const uploadToStorage = async (clientId, file, objectName) => {
  return uploadToGCS(clientId, file, objectName)
  // return uploadToMinio(clientId, file, objectName)
}