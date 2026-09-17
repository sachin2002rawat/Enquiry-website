import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

// Import API Routes
import productRoutes from './routes/productRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import enquiryRoutes from './routes/enquiryRoutes.js'
import heroRoutes from './routes/heroRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

// Load Environment Variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Enquiry Website Node.js MERN Backend API is running smoothly!'
  })
})

// Mount API Routes
app.use('/api/products', productRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/hero-slides', heroRoutes)
app.use('/api/upload', uploadRoutes)

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found - ${req.originalUrl}` })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]:', err.stack)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

const DEFAULT_PORT = process.env.PORT || 5000

const startServer = (port) => {
  const server = app
    .listen(port, () => {
      console.log(`🚀 [Server] Node.js Express server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`)
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ [Warning] Port ${port} is already in use. Trying port ${Number(port) + 1}...`)
        startServer(Number(port) + 1)
      } else {
        console.error('❌ Server startup error:', err)
      }
    })
}

startServer(DEFAULT_PORT)
