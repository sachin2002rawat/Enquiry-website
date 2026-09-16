import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      default: 'PURE SPICES',
      trim: true
    },
    sku: {
      type: String,
      trim: true
    },
    weight: {
      type: String,
      default: '100g'
    },
    netWeight: {
      type: String,
      default: '100g / Pack'
    },
    minOrderQty: {
      type: String,
      default: '50 Units'
    },
    availability: {
      type: String,
      default: 'In Stock'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    },
    description: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 15
    },
    slug: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model('Product', productSchema)

export default Product
