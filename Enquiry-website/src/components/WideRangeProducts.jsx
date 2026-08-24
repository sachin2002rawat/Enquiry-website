import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { FaWhatsapp, FaStar, FaFilePdf } from 'react-icons/fa'
import { FiArrowRight, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import productsData from '../ProductsData.json'
import { useEnquiryModal } from '../context/EnquiryModalContext'

const WideRangeProducts = () => {
  const navigate = useNavigate()
  const { openEnquiryModal } = useEnquiryModal()

  // State for Desktop Carousel Slider
  const [products, setProducts] = useState(productsData)

  // State for Mobile Pagination List View (5 items per page)
  const [mobilePage, setMobilePage] = useState(1)
  const itemsPerPage = 5

  const totalMobilePages = Math.ceil(productsData.length / itemsPerPage)

  // Move carousel to the right on desktop
  const handleNextDesktop = () => {
    setProducts((prev) => {
      const copy = [...prev]
      const first = copy.shift()
      copy.push(first)
      return copy
    })
  }

  // Move carousel to the left on desktop
  const handlePrevDesktop = () => {
    setProducts((prev) => {
      const copy = [...prev]
      const last = copy.pop()
      copy.unshift(last)
      return copy
    })
  }

  // Mobile page change handler
  const handleMobilePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalMobilePages) {
      setMobilePage(newPage)
      const section = document.querySelector('.wide-range-section')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleEnquire = (productTitle, e) => {
    if (e) e.stopPropagation()
    openEnquiryModal()
  }

  const handleWhatsApp = (productTitle, e) => {
    if (e) e.stopPropagation()
    const message = encodeURIComponent(`Hi, I am interested in inquiring about ${productTitle}.`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleCardClick = (product) => {
    const targetSlug = product.slug || product.id
    navigate(`/product/${targetSlug}`)
  }

  // Current slice of products for mobile list (5 products per page)
  const currentMobileProducts = productsData.slice(
    (mobilePage - 1) * itemsPerPage,
    mobilePage * itemsPerPage
  )

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

      {/* 2. Desktop Carousel View (Hidden on Mobile) */}
      <div className="wide-range-carousel-wrapper desktop-only-carousel">
        {/* Left Arrow Button */}
        <button 
          type="button"
          className="carousel-arrow-btn prev" 
          onClick={handlePrevDesktop} 
          aria-label="Previous products"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Desktop Carousel Cards Track */}
        <div className="wide-range-grid">
          {products.slice(0, 3).map((product) => (
            <div 
              key={product.id} 
              className="product-wide-card"
              onClick={() => handleCardClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <span className="product-wide-tag">{product.collection}</span>
              
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
              
              <h3 className="product-wide-title">{product.name}</h3>
              <span className="product-wide-category">{product.category}</span>
              <p className="product-wide-description">{product.description}</p>
              
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
          onClick={handleNextDesktop} 
          aria-label="Next products"
        >
          <FiArrowRight size={20} />
        </button>
      </div>

      {/* 3. Mobile Vertical List View with Pagination (Visible ONLY on Mobile screens <= 768px) */}
      <div className="wide-range-mobile-list-wrapper mobile-only-list">
        <div className="wide-range-mobile-list">
          {currentMobileProducts.map((product) => (
            <div 
              key={product.id} 
              className="wide-range-mobile-card"
              onClick={() => handleCardClick(product)}
            >
              {/* Full Width Top Image with Floating PDF Badge */}
              <div className="mobile-card-img-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="mobile-card-img" 
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/premium_spices.png";
                  }}
                />
                <div className="mobile-card-pdf-badge" title="Catalog PDF Available">
                  <FaFilePdf size={16} color="#e11d48" />
                </div>
              </div>

              {/* Product Info Section Below Image */}
              <div className="mobile-card-info">
                <span className="mobile-card-category">{product.category}</span>
                <h3 className="mobile-card-title">{product.name}</h3>
                
                {/* Rating Stars Row */}
                <div className="mobile-card-rating">
                  <div className="stars-group">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={13} color="#f59e0b" />
                    ))}
                  </div>
                  <span className="rating-count">({product.reviewsCount || 127})</span>
                </div>
              </div>

              {/* Bottom Action Buttons Row */}
              <div className="mobile-card-actions">
                <button 
                  type="button" 
                  className="mobile-enquire-btn"
                  onClick={(e) => handleEnquire(product.name, e)}
                >
                  <MessageSquare size={16} /> Send Enquiry
                </button>
                
                <button 
                  type="button" 
                  className="mobile-whatsapp-btn"
                  onClick={(e) => handleWhatsApp(product.name, e)}
                  aria-label={`WhatsApp ${product.name}`}
                >
                  <FaWhatsapp size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination (Shown ONLY on Mobile) */}
        <div className="wide-range-mobile-pagination">
          <button 
            type="button" 
            className="mobile-page-btn nav-btn"
            disabled={mobilePage === 1}
            onClick={() => handleMobilePageChange(mobilePage - 1)}
            aria-label="Previous page"
          >
            <FiChevronLeft size={18} />
          </button>

          <div className="mobile-page-numbers">
            {Array.from({ length: totalMobilePages }, (_, index) => {
              const pageNum = index + 1
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`mobile-page-num ${mobilePage === pageNum ? 'active' : ''}`}
                  onClick={() => handleMobilePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button 
            type="button" 
            className="mobile-page-btn nav-btn"
            disabled={mobilePage === totalMobilePages}
            onClick={() => handleMobilePageChange(mobilePage + 1)}
            aria-label="Next page"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default React.memo(WideRangeProducts)
