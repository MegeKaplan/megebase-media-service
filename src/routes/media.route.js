import express from 'express'
import { uploadMiddleware } from '../middlewares/upload.middleware.js'
import { getMedia, getSignedPlaylist, uploadFiles } from '../controllers/media.controller.js'
import { validateClientId } from '../middlewares/validateClient.middleware.js'

const router = express.Router()

router.get('/:id', validateClientId, getMedia)
router.post('/', validateClientId, uploadMiddleware, uploadFiles)
router.get('/:mediaId/playlist', validateClientId, getSignedPlaylist)

export default router