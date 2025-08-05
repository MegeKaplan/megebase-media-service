import { uploadMultipleFiles } from '../services/media.service.js'

export const uploadMedia = async (req, res) => {
  const files = req.files

  if (!files || files.length === 0) return res.status(400).json({ error: 'No files provided' })

  const uploadedFiles = await uploadMultipleFiles(files)
  
  res.status(201).json(uploadedFiles)
}