import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { FaWhatsapp, FaFilePdf } from 'react-icons/fa'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import defaultProductsList from '../../ProductsData.json'
import { useEnquiryModal } from '../../context/EnquiryModalContext'

const defaultPopularItems = [
  {
    id: 13,
    slug: 'chaat-masala',
    name: 'Chaat Masala',
    category: 'MIX MASALA',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 14,
    slug: 'kitchen-king-masala',
    name: 'Kitchen King Masala',
    category: 'MIX MASALA',
    image: '/garam_masala.png',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 15,
    slug: 'pav-bhaji-masala',
    name: 'Pav Bhaji Masala',
    category: 'MIX MASALA',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 16,
    slug: 'biryani-masala',
    name: 'Biryani Masala',
    category: 'MIX MASALA',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 1,
    slug: 'garam-masala',
    name: 'Garam Masala',
    category: 'PURE SPICES',
    image: '/garam_masala.png',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  }
]

const PopularProduct = ({ data, isBeauty = false }) => {
  const navigate = useNavigate()
  const { openEnquiryModal } = useEnquiryModal()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Local admin settings state
  const [adminSettings, setAdminSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('enquiry_admin_store_settings')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Dynamic popular products list
  const [customList, setCustomList] = useState(() => {
    try {
      const saved = localStorage.getItem('enquiry_admin_popular_products')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Listen for admin changes across tabs / storage events
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedSettings = localStorage.getItem('enquiry_admin_store_settings')
        if (savedSettings) {
          setAdminSettings(JSON.parse(savedSettings))
        }
        const savedProducts = localStorage.getItem('enquiry_admin_popular_products')
        if (savedProducts) {
          setCustomList(JSON.parse(savedProducts))
        }
      } catch (err) {
        console.error('Error syncing Popular Products with localStorage:', err)
      }
    }

    window.addEventListener('storage', handleSync)
    return () => window.removeEventListener('storage', handleSync)
  }, [])

  // Resolve products list:
  // If specific data prop was passed (e.g. beautyProductsData), use it.
  // Otherwise if admin has customList, use customList.
  // Otherwise fallback to defaultPopularItems or defaultProductsList.
  const productsList = useMemo(() => {
    if (data && data.length > 0) return data
    if (customList && Array.isArray(customList) && customList.length > 0) return customList
    if (adminSettings.popularProductsList && Array.isArray(adminSettings.popularProductsList) && adminSettings.popularProductsList.length > 0) {
      return adminSettings.popularProductsList
    }
    return defaultPopularItems
  }, [data, customList, adminSettings.popularProductsList])

  // Computed configuration variables
  const subtitle = adminSettings.popularProductsSubtitle || '— TRENDING NOW'
  const titleMain = adminSettings.popularProductsTitleMain !== undefined ? adminSettings.popularProductsTitleMain : 'Popular'
  const titleHighlight = adminSettings.popularProductsTitleHighlight !== undefined ? adminSettings.popularProductsTitleHighlight : 'Products'
  const description = adminSettings.popularProductsDesc || 'Explore our most-loved items, trusted by thousands of happy customers across the country.'
  const browseText = adminSettings.popularProductsBrowseText || 'Browse All Products'
  const browseLink = adminSettings.popularProductsBrowseLink || '/product'
  const autoPlay = adminSettings.popularProductsAutoPlay !== false
  const intervalSeconds = Number(adminSettings.popularProductsInterval) || 3
  const showEnquire = adminSettings.popularProductsShowEnquire !== false
  const showBulk = adminSettings.popularProductsShowBulk !== false
  const showPdf = adminSettings.popularProductsShowPdf !== false

  // Auto-play: cycles cards every N seconds, pauses on mouse hover
  useEffect(() => {
    if (!autoPlay || isHovered || !productsList || productsList.length === 0) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % productsList.length)
    }, intervalSeconds * 1000)

    return () => clearInterval(interval)
  }, [autoPlay, isHovered, productsList.length, intervalSeconds])

  const handleNext = () => {
    if (!productsList || productsList.length === 0) return
    setActiveIndex((prev) => (prev + 1) % productsList.length)
  }

  const handlePrev = () => {
    if (!productsList || productsList.length === 0) return
    setActiveIndex((prev) => (prev - 1 + productsList.length) % productsList.length)
  }

  const handleEnquire = (productName, e) => {
    e.stopPropagation() // Prevent card select click trigger
    openEnquiryModal()
  }

  const handleBulkWhatsApp = (product, e) => {
    e.stopPropagation()
    const targetPhone = (product.whatsappNumber || adminSettings.whatsappNumber || '+919876543210').replace(/[^0-9]/g, '')
    const msg = encodeURIComponent(`Hi, I would like to make a bulk enquiry about ${product.name}.`)
    window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank')
  }

  const handleCardClick = (index, product) => {
    if (index === activeIndex && product) {
      const targetSlug = product.slug || product.id
      navigate(`/product/${targetSlug}`)
    } else {
      setActiveIndex(index) // Click an adjacent card to immediately slide it to center focus
    }
  }

  // Coverflow class generator using relative circular index offsets
  const getCoverflowClass = (index) => {
    const total = productsList.length
    if (total <= 1) return 'card-center'
    const diff = (index - activeIndex + total) % total

    if (diff === 0) return 'card-center'
    if (diff === 1) return 'card-next'
    if (diff === total - 1) return 'card-prev'
    if (diff === 2) return 'card-far-next'
    if (diff === total - 2) return 'card-far-prev'
    return 'card-hidden'
  }

  return (
    <section className={`popular-products-section ${isBeauty ? 'is-beauty' : ''}`}>
      {/* 1. Header Area (Trending subtitle, Gold-highlighted title, Description & Link) */}
      <div className="popular-header">
        {subtitle && <span className="popular-subtitle">{subtitle}</span>}
        <h2 className="popular-title">
          {titleMain} {titleHighlight && <span className="gold-highlight">{titleHighlight}</span>}
        </h2>
        {description && <p className="popular-description">{description}</p>}
        {browseText && (
          <a
            href={browseLink}
            className="browse-all-link"
            onClick={(e) => {
              e.preventDefault()
              if (browseLink.startsWith('http')) {
                window.open(browseLink, '_blank')
              } else {
                navigate(browseLink)
              }
            }}
          >
            {browseText} <span className="arrow">→</span>
          </a>
        )}
      </div>

      {/* 2. Coverflow Carousel wrapper (pauses and starts rotation on hover) */}
      <div
        className="popular-carousel-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          className="carousel-arrow-btn prev"
          onClick={handlePrev}
          aria-label="Previous products"
          style={{ left: '-20px', zIndex: 15 }}
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Dynamic Coverflow Track */}
        <div className="popular-track-container">
          {productsList.map((product, index) => {
            const coverflowClass = getCoverflowClass(index)
            return (
              <div
                key={product.id || index}
                className={`popular-card-coverflow ${coverflowClass} ${isBeauty ? 'beauty-card-vertical' : ''}`}
                onClick={() => handleCardClick(index, product)}
              >
                {/* Left Column: Product Image with soft square background */}
                <div className="popular-img-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="popular-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null
                      const isBeautyMatch = product?.category && /SKIN|HAIR|FACE|BODY|COSMETICS|BEAUTY/i.test(product.category)
                      e.target.src = isBeautyMatch
                        ? 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
                        : '/garam_masala.png'
                    }}
                  />
                  {showPdf && (
                    <div
                      className="popular-card-pdf-badge"
                      title={product.pdfUrl ? 'Download Catalog PDF' : 'Catalog PDF Available'}
                      onClick={(e) => {
                        if (product.pdfUrl) {
                          e.stopPropagation()
                          window.open(product.pdfUrl, '_blank')
                        }
                      }}
                      style={{ cursor: product.pdfUrl ? 'pointer' : 'default' }}
                    >
                      <FaFilePdf size={16} color="#e11d48" />
                    </div>
                  )}
                </div>

                {/* Center Column: Category label and bold Product Title */}
                <div className="popular-details">
                  <span className="popular-card-category">{product.category}</span>
                  <h3 className="popular-card-name">{product.name}</h3>
                </div>

                {/* Right Column: Stacked Action Pill Buttons */}
                {(showEnquire || showBulk) && (
                  <div className="popular-actions">
                    {showEnquire && (
                      <button
                        type="button"
                        className="popular-enquire-btn"
                        onClick={(e) => handleEnquire(product.name, e)}
                      >
                        <MessageSquare size={14} /> Enquire Now
                      </button>
                    )}

                    {showBulk && (
                      <button
                        type="button"
                        className="popular-bulk-btn"
                        onClick={(e) => handleBulkWhatsApp(product, e)}
                      >
                        <FaWhatsapp size={16} /> Bulk Enquire
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          className="carousel-arrow-btn next"
          onClick={handleNext}
          aria-label="Next products"
          style={{ right: '-20px', zIndex: 15 }}
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </section>
  )
}

export default React.memo(PopularProduct)
