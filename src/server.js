import app from './app.js'
import { env } from './config/env.js'
import { connectToMongo } from './database/mongo.js'
// import { initMinio } from './storage/minio.js'
import { initRabbitMQ } from './messaging/rabbitmq.js'
import { initGCS } from './storage/gcs.js'

const startServer = async () => {
  try {
    await initRabbitMQ()
    // await initMinio()
    await initGCS()
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