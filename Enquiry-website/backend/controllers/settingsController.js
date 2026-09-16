import CompanySettings from '../models/CompanySettings.js'

// @desc    Get company and store settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await CompanySettings.findOne()
    if (!settings) {
      settings = await CompanySettings.create({})
    }
    res.status(200).json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update company and store settings
// @route   PUT /api/settings
// @access  Public / Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await CompanySettings.findOne()
    if (!settings) {
      settings = await CompanySettings.create(req.body)
    } else {
      settings = await CompanySettings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true })
    }
    res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
