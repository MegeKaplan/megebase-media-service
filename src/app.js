import express from 'express'
import mediaRouter from './routes/media.route.js'
import cors from 'cors'

const app = express()

app.use(express.json())

app.use(cors())

app.use("/media", mediaRouter)

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running..." })
})

export default app