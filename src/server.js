import app from './app.js'
import { env } from './config/env.js'
import { initMinio } from './storage/minio.js'

const startServer = async () => {
  try {
    await initMinio()
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`)
    })
  } catch (err) {
    console.error('Failed to initialize server:', err)
    process.exit(1)
  }
}

startServer()