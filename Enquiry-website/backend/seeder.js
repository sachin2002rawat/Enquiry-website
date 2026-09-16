import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import CompanySettings from './models/CompanySettings.js'
import HeroSlide from './models/HeroSlide.js'
import connectDB from './config/db.js'

// Import default JSON data
import defaultProducts from '../src/ProductsData.json' assert { type: 'json' }
import defaultHeroSlides from '../src/HeroImage.json' assert { type: 'json' }

dotenv.config()
connectDB()

const importData = async () => {
  try {
    // Clear existing collections
    await Product.deleteMany({})
    await CompanySettings.deleteMany({})
    await HeroSlide.deleteMany({})

    console.log('🧹 Existing collections cleared...')

    // Seed Products
    const formattedProducts = defaultProducts.map((p) => ({
      name: p.name,
      category: p.category || 'PURE SPICES',
      sku: p.sku || `SKU-${p.id}`,
      weight: p.weight || '100g',
      netWeight: p.netWeight || '100g / Pack',
      minOrderQty: p.minOrderQty || '50 Units',
      availability: p.availability || 'In Stock',
      image: p.image || '',
      description: p.description || '',
      rating: p.rating || 4.8,
      reviewsCount: p.reviewsCount || 15,
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/\s+/g, '-') : `product-${p.id}`)
    }))

    await Product.insertMany(formattedProducts)
    console.log(`✅ Seeded ${formattedProducts.length} Products into MongoDB`)

    // Seed Hero Slides
    const formattedSlides = defaultHeroSlides.map((s) => ({
      image: s.image,
      title: s.title,
      subtitleBadge: s.subtitleBadge || 'PREMIUM QUALITY',
      description: s.description || '',
      ctaText: s.ctaText || 'Explore Catalogue',
      ctaLink: s.ctaLink || '/product'
    }))
    await HeroSlide.insertMany(formattedSlides)
    console.log(`✅ Seeded ${formattedSlides.length} Hero Banner Slides into MongoDB`)

    // Seed Default Company Settings
    await CompanySettings.create({
      companyName: 'QuickEnquiry',
      tagline: '100% Organic & Stone Ground Spices',
      whatsappNumber: '+91 9876543210',
      contactEmail: 'info@enquirybrand.com',
      officeAddress: 'Sector 62, Business Park, Noida, UP - 201309'
    })
    console.log('✅ Seeded Default Company Settings into MongoDB')

    console.log('🌱 [Seeder] Database Seeder Completed Successfully!')
    process.exit(0)
  } catch (error) {
    console.error(`❌ [Seeder Error]: ${error.message}`)
    process.exit(1)
  }
}

importData()
