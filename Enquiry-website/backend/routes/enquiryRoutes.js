import express from 'express'
import { createEnquiry, getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js'

const router = express.Router()

router.route('/').get(getEnquiries).post(createEnquiry)
router.route('/:id').put(updateEnquiryStatus)

export default router
