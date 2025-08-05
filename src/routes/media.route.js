import express from 'express'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'
import { uploadMedia } from '../controllers/media.controller.js'

const router = express.Router()

router.post('/', uploadMiddleware, uploadMedia)

export default router