import express from 'express'
import mediaRouter from './routes/media.route.js'

const app = express()

app.use(express.json())

app.use("/media", mediaRouter)

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running..." })
})

export default app