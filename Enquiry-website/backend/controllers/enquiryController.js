import Enquiry from '../models/Enquiry.js'

// @desc    Submit new enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, productName, message } = req.body

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required' })
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone: phone || '',
      productName: productName || 'General Enquiry',
      message: message || ''
    })

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', data: enquiry })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Public / Admin
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Public / Admin
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true })
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }

    res.status(200).json({ success: true, message: 'Enquiry status updated', data: enquiry })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
