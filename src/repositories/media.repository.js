import { MediaModel } from '../models/media.model.js'

export const saveMedia = async (mediaData) => {
  return await MediaModel.create(mediaData)
}