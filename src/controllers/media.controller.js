import { getMediaById, uploadMultipleFiles } from '../services/media.service.js'
import { generateSignedUrl } from '../storage/minio.js'

export const getMedia = async (req, res) => {
  try {
    const { id } = req.params
    const media = await getMediaById(id)
    const clientId = req.clientId

    if (!media) return res.status(404).json({ error: 'Media not found' })

    const signedUrl = await generateSignedUrl(clientId, media._id)

    media.url = signedUrl

    res.status(200).json(media)
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}

export const uploadFiles = async (req, res) => {
  try {
    const files = req.files
    const userId = req.headers['x-user-id']
    const clientId = req.clientId

    if (!userId) return res.status(401).json({ error: 'Unauthorized: userId is required' })

    if (!files || files.length === 0) return res.status(400).json({ error: 'No files provided' })

    const uploadedMedia = await uploadMultipleFiles(clientId, files, userId)

    res.status(201).json(uploadedMedia)
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}