import mongoose from 'mongoose'
import { env } from '../config/env.js'

export const connectToMongo = async () => {
  mongoose.connect(env.MONGO_URI)
}