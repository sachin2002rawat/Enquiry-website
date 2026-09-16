import express from 'express'
import { getHeroSlides, updateHeroSlides } from '../controllers/heroController.js'

const router = express.Router()

router.route('/').get(getHeroSlides).put(updateHeroSlides)

export default router
