import { extension } from "mime-types"

export const generateObjectName = (mediaId, mimetype) => {
  const ext = extension(mimetype)
  if (isImage(mimetype)) {
    return `${mediaId}.webp`
  }
  return `${mediaId}.${ext}`
}

export const isImage = (mimetype) => {
  return mimetype.startsWith('image/')
}