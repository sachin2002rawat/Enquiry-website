import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaRegCommentDots, FaWhatsapp } from 'react-icons/fa'
import { FiImage } from 'react-icons/fi'
import { useEnquiryModal } from '../../context/EnquiryModalContext'

/**
 * ProductCard Component
 * Displays product details from product data object.
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { openEnquiryModal } = useEnquiryModal()
  const displayTitle = product?.name || product?.title || 'Product Item'
  const category = product?.category || 'PURE SPICES'
  const rating = product?.rating || 5
  const reviewsCount = product?.reviewsCount || 100
  const image = product?.image || null

  const handleCardClick = () => {
    if (product) {
      const targetSlug = product.slug || product.id
      navigate(`/product/${targetSlug}`)
    }
  }

  const handleSendEnquiry = (e) => {
    if (e) e.stopPropagation()
    openEnquiryModal()
  }

  const handleWhatsAppClick = (e) => {
    if (e) e.stopPropagation()
    const message = encodeURIComponent(`Hi, I am interested in ${displayTitle}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  return (
    <div 
      className="product-item-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Product Image Area */}
      <div className="product-image-box">
        {image ? (
          <img 
            src={image} 
            alt={displayTitle} 
            className="product-img" 
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/premium_spices.png';
            }}
          />
        ) : (
          <div className="product-image-placeholder">
            <FiImage className="placeholder-icon" />
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="product-info">
        <span className="product-category-label">{category}</span>
        <h4 className="product-item-title">{displayTitle}</h4>

        {/* Rating Stars */}
        <div className="product-rating-row">
          <div className="stars-group">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`star-icon ${i < Math.floor(rating) ? 'filled' : ''}`}
              />
            ))}
          </div>
          <span className="reviews-count">({reviewsCount})</span>
        </div>

        {/* Action Buttons */}
        <div className="product-actions-row">
          {/* Send Enquiry Button */}
          <button
            type="button"
            className="card-enquiry-btn"
            onClick={(e) => handleSendEnquiry(e)}
          >
            <FaRegCommentDots size={14} />
            <span>Send Enquiry</span>
          </button>

          {/* WhatsApp Icon Button */}
          <button
            type="button"
            className="card-whatsapp-btn"
            onClick={(e) => handleWhatsAppClick(e)}
            aria-label="Contact on WhatsApp"
          >
            <FaWhatsapp size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
