import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import productsData from '../ProductsData.json'

const WideRangeProducts = () => {
  const navigate = useNavigate()

  // Store products in state to rotate for infinite carousel sliding
  const [products, setProducts] = useState(productsData)

  // Move carousel to the right (take first card, move to the end)
  const handleNext = () => {
    setProducts((prev) => {
      const copy = [...prev]
      const first = copy.shift() // Remove first card
      copy.push(first)           // Add it to the end
      return copy
    })
  }

  // Move carousel to the left (take last card, move to the beginning)
  const handlePrev = () => {
    setProducts((prev) => {
      const copy = [...prev]
      const last = copy.pop()    // Remove last card
      copy.unshift(last)         // Add it to the beginning
      return copy
    })
  }

  const handleEnquire = (productTitle, e) => {
    if (e) e.stopPropagation()
    alert(`Opening inquiry form for: ${productTitle}`)
  }

  const handleWhatsApp = (productTitle, e) => {
    if (e) e.stopPropagation()
    alert(`Opening WhatsApp chat for product: ${productTitle}`)
  }

  const handleCardClick = (product) => {
    const targetSlug = product.slug || product.id
    navigate(`/product/${targetSlug}`)
  }

  return (
    <section className="wide-range-section">
      {/* 1. Header Section */}
      <div className="wide-range-header">
        <div className="wide-range-header-left">
          <span className="wide-range-subtitle">— HANDPICKED FOR YOU</span>
          <h2 className="wide-range-title">
            Wide Range of <span className="title-highlight">Products</span>
          </h2>
        </div>
        
        <a 
          href="#products" 
          className="view-all-products-link"
          onClick={(e) => {
            e.preventDefault()
            navigate('/product')
          }}
        >
          View All Products <span className="arrow-icon">→</span>
        </a>
      </div>

      {/* 2. Carousel Container (with Overlay Navigation Arrows) */}
      <div className="wide-range-carousel-wrapper">
        {/* Left Arrow Button */}
        <button 
          type="button"
          className="carousel-arrow-btn prev" 
          onClick={handlePrev} 
          aria-label="Previous products"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Products List (overflow: hidden handles hiding of off-screen cards) */}
        <div className="wide-range-grid">
          {products.slice(0, 3).map((product) => (
            <div 
              key={product.id} 
              className="product-wide-card"
              onClick={() => handleCardClick(product)}
              style={{ cursor: 'pointer' }}
            >
              
              {/* Card Tag Category Header */}
              <span className="product-wide-tag">{product.collection}</span>
              
              {/* Card Product Image */}
              <div className="product-wide-img-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-wide-img" 
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/premium_spices.png";
                  }}
                />
              </div>
              
              {/* Card Product Title */}
              <h3 className="product-wide-title">{product.name}</h3>
              
              {/* Card Category Tag */}
              <span className="product-wide-category">{product.category}</span>
              
              {/* Card Product Description */}
              <p className="product-wide-description">{product.description}</p>
              
              {/* Card Bottom Actions (Enquire & WhatsApp Buttons) */}
              <div className="product-wide-actions">
                <button 
                  type="button" 
                  className="enquire-now-btn" 
                  onClick={(e) => handleEnquire(product.name, e)}
                >
                  <MessageSquare size={16} /> Enquire Now
                </button>
                
                <button 
                  type="button" 
                  className="whatsapp-btn" 
                  onClick={(e) => handleWhatsApp(product.name, e)}
                  aria-label={`Inquire about ${product.name} on WhatsApp`}
                >
                  <FaWhatsapp size={20} />
                </button>
              </div>
              
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button 
          type="button"
          className="carousel-arrow-btn next" 
          onClick={handleNext} 
          aria-label="Next products"
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </section>
  )
}

export default React.memo(WideRangeProducts)
