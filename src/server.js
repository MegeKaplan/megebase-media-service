import app from './app.js'
import { env } from './config/env.js'
import { connectToMongo } from './database/mongo.js'
import { initMinio } from './storage/minio.js'

const startServer = async () => {
  try {
    await initMinio()
    await connectToMongo()
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`)
    })
  } catch (err) {
    console.error('Failed to initialize server:', err)
    process.exit(1)
  }
}

startServer()