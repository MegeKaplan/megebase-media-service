import { uploadMultipleFiles } from '../services/media.service.js'

export const uploadFiles = async (req, res) => {
  try {
    const files = req.files
    const userId = req.headers['x-user-id']

    if (!userId) return res.status(401).json({ error: 'Unauthorized: userId is required' })

    if (!files || files.length === 0) return res.status(400).json({ error: 'No files provided' })

    const uploadedMedia = await uploadMultipleFiles(files, userId)

    res.status(201).json(uploadedMedia)
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}