import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

// Configure Cloudinary SDK v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'
})

// Cloudinary Storage Engine for Multer
let storage

try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'enquiry_products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
      public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`
    }
  })
} catch (error) {
  console.warn('[Cloudinary Storage Warning]: Falling back to memory storage:', error.message)
  storage = multer.memoryStorage()
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

export { cloudinary, upload }
