export const generateObjectName = (mediaId, extension) => {
  return `${mediaId}.${extension}`
}

export const isImage = (mimetype) => {
  return mimetype.startsWith('image/')
}

export const isVideo = (mimetype) => {
  return mimetype.startsWith('video/')
}

export const getFileExtension = (filename) => {
  const arr = filename.split('.')
  return arr.length > 1 ? arr[arr.length - 1] : null
}