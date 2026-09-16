import Product from '../models/Product.js'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: products.length, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    let product = null
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id)
    }
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() })
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Public / Admin
export const createProduct = async (req, res) => {
  try {
    const { name, category, sku, weight, netWeight, minOrderQty, availability, image, description, rating, reviewsCount } = req.body

    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const product = await Product.create({
      name,
      category: category || 'PURE SPICES',
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      weight: weight || '100g',
      netWeight: netWeight || '100g / Pack',
      minOrderQty: minOrderQty || '50 Units',
      availability: availability || 'In Stock',
      image: image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      description: description || '',
      rating: rating || 4.8,
      reviewsCount: reviewsCount || 10,
      slug
    })

    res.status(201).json({ success: true, message: 'Product created successfully', data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public / Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public / Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.status(200).json({ success: true, message: 'Product removed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
