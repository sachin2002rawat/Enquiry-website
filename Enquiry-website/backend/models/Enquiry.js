import mongoose from 'mongoose'

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    productName: {
      type: String,
      default: 'General Product Enquiry'
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Completed', 'Closed'],
      default: 'New'
    }
  },
  { timestamps: true }
)

const Enquiry = mongoose.model('Enquiry', enquirySchema)

export default Enquiry
