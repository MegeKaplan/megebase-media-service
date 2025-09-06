import { Storage } from '@google-cloud/storage'
import { env } from '../config/env.js'

export const gcsClient = new Storage({
  projectId: env.GCP_PROJECT_ID,
  keyFilename: env.GCP_SERVICE_ACCOUNT_KEY_PATH,
})

const bucket = gcsClient.bucket(env.GCP_BUCKET_NAME)

export const createBucketIfNotExists = async () => {
  const [exists] = await bucket.exists()
  if (!exists) {
    await gcsClient.createBucket(env.GCP_BUCKET_NAME, {
      location: env.GCP_REGION,
    })
  }
}

export const uploadToGCS = async (clientId, file, objectName, bucketName = env.GCP_BUCKET_NAME) => {
  const finalObjectName = `${clientId}/raw/${objectName}`
  const blob = gcsClient.bucket(bucketName).file(finalObjectName)
  await blob.save(file.buffer, {
    contentType: file.mimetype,
    resumable: false,
  })
  return `gs://${bucketName}/${finalObjectName}`
}

export const generateSignedUrl = async (objectPath, expirySeconds = 300, bucketName = env.GCP_BUCKET_NAME) => {
  const [url] = await gcsClient
    .bucket(bucketName)
    .file(objectPath)
    .getSignedUrl({
      action: 'read',
      expires: Date.now() + expirySeconds * 1000,
    })
  return url
}

export const checkObjectExists = async (objectPath, bucketName = env.GCP_BUCKET_NAME) => {
  const [exists] = await gcsClient.bucket(bucketName).file(objectPath).exists()
  return exists
}

export const initGCS = async () => {
  await createBucketIfNotExists()
}
