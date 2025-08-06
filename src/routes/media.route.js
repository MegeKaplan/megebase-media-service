import express from 'express'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'
import { getMedia, uploadFiles } from '../controllers/media.controller.js'

const router = express.Router()

router.get('/:id', getMedia)
router.post('/', uploadMiddleware, uploadFiles)

export default router