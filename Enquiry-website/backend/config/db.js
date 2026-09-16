import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/enquiry_db')
    console.log(`[MongoDB] Database Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`)
    // Continue running process even if local MongoDB daemon is not running yet
  }
}

export default connectDB
