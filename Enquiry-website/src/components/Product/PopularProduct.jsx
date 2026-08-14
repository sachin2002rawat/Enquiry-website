import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import productsList from '../../ProductsData.json'

const PopularProduct = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play: cycles cards every 3 seconds, pauses on mouse hover
  useEffect(() => {
    if (isHovered) return // Pause the auto-play timer on hover

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % productsList.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isHovered])

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % productsList.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + productsList.length) % productsList.length)
  }

  const handleEnquire = (productName, e) => {
    e.stopPropagation() // Prevent card select click trigger
    alert(`Opening enquiry form for: ${productName}`)
  }

  const handleBulkWhatsApp = (productName, e) => {
    e.stopPropagation() // Prevent card select click trigger
    alert(`Opening bulk WhatsApp chat for: ${productName}`)
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
    const diff = (index - activeIndex + total) % total

    if (diff === 0) return 'card-center'
    if (diff === 1) return 'card-next'
    if (diff === total - 1) return 'card-prev'
    if (diff === 2) return 'card-far-next'
    if (diff === total - 2) return 'card-far-prev'
    return 'card-hidden'
  }

  return (
    <section className="popular-products-section">
      {/* 1. Header Area (Trending subtitle, Gold-highlighted title, Description & Link) */}
      <div className="popular-header">
        <span className="popular-subtitle">— TRENDING NOW</span>
        <h2 className="popular-title">
          Popular <span className="gold-highlight">Products</span>
        </h2>
        <p className="popular-description">
          Explore our most-loved items, trusted by thousands of happy customers across the country.
        </p>
        <a 
          href="#browse" 
          className="browse-all-link"
          onClick={(e) => {
            e.preventDefault()
            navigate('/product')
          }}
        >
          Browse All Products <span className="arrow">→</span>
        </a>
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
                key={product.id} 
                className={`popular-card-coverflow ${coverflowClass}`}
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
                      e.target.onerror = null;
                      e.target.src = '/garam_masala.png';
                    }}
                  />
                </div>
                
                {/* Center Column: Category label and bold Product Title */}
                <div className="popular-details">
                  <span className="popular-card-category">{product.category}</span>
                  <h3 className="popular-card-name">{product.name}</h3>
                </div>
                
                {/* Right Column: Stacked Action Pill Buttons */}
                <div className="popular-actions">
                  <button 
                    type="button" 
                    className="popular-enquire-btn" 
                    onClick={(e) => handleEnquire(product.name, e)}
                  >
                    <MessageSquare size={14} /> Enquire Now
                  </button>
                  
                  <button 
                    type="button" 
                    className="popular-bulk-btn" 
                    onClick={(e) => handleBulkWhatsApp(product.name, e)}
                  >
                    <FaWhatsapp size={16} /> Bulk Enquire
                  </button>
                </div>
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
