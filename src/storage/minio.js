import { Client } from 'minio'
import { env } from '../config/env.js'

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: Number(env.MINIO_PORT),
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
})

const createPublicReadPolicy = (bucketName) => {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  })
}

export const createBucketIfNotExists = async () => {
  const bucketExists = await minioClient.bucketExists(env.MINIO_BUCKET_NAME)
  if (!bucketExists) {
    await minioClient.makeBucket(env.MINIO_BUCKET_NAME)
  }
}

export const uploadToMinio = async (clientId, file, objectName, bucketName = env.MINIO_BUCKET_NAME) => {
  const finalObjectName = `${clientId}/raw/${objectName}`
  await minioClient.putObject(bucketName, finalObjectName, file.buffer, {
    'Content-Type': file.mimetype,
  })
  return `${env.MINIO_PUBLIC_URL}/${bucketName}/${finalObjectName}`
}

export const generateSignedUrl = async (objectPath, expirySeconds = 300, bucketName = env.MINIO_BUCKET_NAME) => {
  return await minioClient.presignedGetObject(bucketName, objectPath, expirySeconds)
}

export const checkObjectExists = async (objectPath, bucketName = env.MINIO_BUCKET_NAME) => {
  return await minioClient.statObject(bucketName, objectPath).then(() => true).catch(() => false)
}

export const initMinio = async () => {
  await createBucketIfNotExists()
}