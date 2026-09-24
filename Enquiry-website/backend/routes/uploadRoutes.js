import express from 'express'
import { upload, cloudinary } from '../config/cloudinary.js'

const router = express.Router()

// @desc    Upload image to Cloudinary via Multer
// @route   POST /api/upload
// @access  Public

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' })
    }

    // Check if uploaded via Cloudinary storage engine (req.file.path contains cloudinary URL)
    let imageUrl = req.file.path || req.file.secure_url || req.file.url

    // Fallback if memoryStorage was used (e.g. converting buffer to base64 DataURL or direct stream upload)
    if (!imageUrl && req.file.buffer) {
      const b64 = Buffer.from(req.file.buffer).toString('base64')
      const mime = req.file.mimetype || 'image/png'
      
      // Upload buffer directly to Cloudinary using upload_stream or data URL
      try {
        const uploadResult = await cloudinary.uploader.upload(`data:${mime};base64,${b64}`, {
          folder: 'enquiry_products'
        })    
        imageUrl = uploadResult.secure_url
      } catch (err) {
        console.warn('Direct Cloudinary upload warning, returning DataURL:', err.message)
        imageUrl = `data:${mime};base64,${b64}`
      }
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary!',
      url: imageUrl,
      secure_url: imageUrl,
      public_id: req.file.filename || req.file.public_id || `file_${Date.now()}`
    })
  } catch (error) {
    console.error('Upload Error:', error)
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' })
  }
})

export default router
