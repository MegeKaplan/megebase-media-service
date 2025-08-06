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
    await minioClient.setBucketPolicy(env.MINIO_BUCKET_NAME)
  }
}

export const uploadToMinio = async (file, objectName, bucketName = env.MINIO_BUCKET_NAME) => {
  await minioClient.putObject(bucketName, objectName, file.buffer, {
    'Content-Type': file.mimetype,
  })
  return `${env.MINIO_PUBLIC_URL}/${bucketName}/${objectName}`
}

export const generateSignedUrl = async (objectName, expirySeconds = 300, bucketName = env.MINIO_BUCKET_NAME) => {
  const url = await minioClient.presignedGetObject(bucketName, objectName, expirySeconds)
  return url
}

export const initMinio = async () => {
  await createBucketIfNotExists()
}