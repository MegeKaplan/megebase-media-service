import express from 'express'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'
import { uploadFiles } from '../controllers/media.controller.js'

const router = express.Router()

router.post('/', uploadMiddleware, uploadFiles)

export default router