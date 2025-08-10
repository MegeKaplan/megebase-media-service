import { getMediaById, uploadMultipleFiles, getSignedPlaylistContent } from '../services/media.service.js'

export const getMedia = async (req, res) => {
  try {
    const mediaId = req.params.id
    const clientId = req.clientId
    const media = await getMediaById(clientId, mediaId)

    if (!media) return res.status(404).json({ error: 'Media not found' })

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

export const getSignedPlaylist = async (req, res) => {
  const { mediaId } = req.params;
  const clientId = req.clientId

  try {
    const playlistContent = await getSignedPlaylistContent(clientId, mediaId);
    if (!playlistContent) return res.status(404).json({ error: 'Playlist not found' });

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(playlistContent);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
