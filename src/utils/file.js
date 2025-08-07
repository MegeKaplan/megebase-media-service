import { extension } from "mime-types"

export const generateObjectName = (mediaId, mimetype) => {
  const ext = extension(mimetype)
  return `${mediaId}.${ext}`
}