import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  uploadedBy: { type: String, required: true, index: true },
  originalname: { type: String },
  mimetype: { type: String },
  size: { type: Number },
}, {
  timestamps: true,
  versionKey: false,
})

export const MediaModel = mongoose.model('Media', mediaSchema)