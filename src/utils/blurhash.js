import { encode } from 'blurhash'
import sharp from 'sharp'

export const generateBlurhash = async (buffer) => {
  const image = await sharp(buffer)
    .resize(32, 32, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { data, info } = image
  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
}