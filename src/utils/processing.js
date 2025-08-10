import { processingConfig } from '../config/processing.js'
import { isImage, isVideo } from '../utils/file.js'

export const generateProcessingConfig = (mimetype) => {
  if (isImage(mimetype)) {
    return processingConfig.image
  }
  if (isVideo(mimetype)) {
    return processingConfig.video // Not implemented in processing-service yet
  }
  return null
}