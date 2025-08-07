const VALID_CLIENTS = [
  "flare"
]

export const validateClientId = (req, res, next) => {
  const clientId = req.headers['x-client-id']

  if (!clientId) {
    return res.status(400).json({ error: 'Missing X-Client-Id header' })
  }

  if (!VALID_CLIENTS.includes(clientId)) {
    return res.status(403).json({ error: 'Invalid client' })
  }

  req.clientId = clientId

  next()
}
