import express from 'express'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'
import { getMedia, uploadFiles } from '../controllers/media.controller.js'
import { validateClientId } from '../middlewares/validateClient.middleware.js'

const router = express.Router()

router.get('/:id', validateClientId, getMedia)
router.post('/', validateClientId, uploadMiddleware, uploadFiles)

export default router