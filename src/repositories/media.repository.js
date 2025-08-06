import { MediaModel } from '../models/media.model.js'

export const findMediaById = async (id) => {
  return await MediaModel.findById(id).exec()
}

export const saveMedia = async (mediaData) => {
  return await MediaModel.create(mediaData)
}