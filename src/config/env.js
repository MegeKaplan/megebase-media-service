import dotenv from 'dotenv'

dotenv.config()

export const env = {
  // Port
  PORT: process.env.PORT || 3000,

  // MinIO
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: process.env.MINIO_PORT || 9000,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME || 'megebase',
  MINIO_PUBLIC_URL: process.env.MINIO_PUBLIC_URL || 'http://localhost:9000',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/megebase',

  // RabbitMQ
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
}