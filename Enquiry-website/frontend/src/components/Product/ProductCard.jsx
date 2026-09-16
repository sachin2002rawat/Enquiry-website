import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { FaWhatsapp, FaStar } from 'react-icons/fa'
import { useEnquiryModal } from '../../context/EnquiryModalContext'

/**
 * ProductCard Component
 * Displays product details using the homepage Wide Range of Products card design.
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { openEnquiryModal } = useEnquiryModal()
  const displayTitle = product?.name || product?.title || 'Product Item'
  const collectionTag = product?.collection || 'PURE SPICES'
  const category = product?.category || 'PURE SPICES'
  const rating = product?.rating || 4.8
  const reviewsCount = product?.reviewsCount || 127
  const image = product?.image || '/premium_spices.png'

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
    const message = encodeURIComponent(`Hi, I am interested in inquiring about ${displayTitle}.`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  return (
    <div 
      className="product-wide-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Collection Tag centered at top */}
      <span className="product-wide-tag">{collectionTag}</span>
      
      {/* Product Image Area */}
      <div className="product-wide-img-container">
        <img 
          src={image} 
          alt={displayTitle} 
          className="product-wide-img" 
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/premium_spices.png';
          }}
        />
      </div>

      {/* Product Title centered */}
      <h3 className="product-wide-title">{displayTitle}</h3>

      {/* Category Label */}
      <span className="product-wide-category">{category}</span>

      {/* Star Rating Row */}
      <div className="product-wide-rating">
        <div className="stars-group">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={14}
              color="#f59e0b"
            />
          ))}
        </div>
        <span className="rating-count">({reviewsCount})</span>
      </div>

      {/* Action Buttons: Enquire Now + WhatsApp */}
      <div className="product-wide-actions">
        <button 
          type="button" 
          className="enquire-now-btn" 
          onClick={(e) => handleSendEnquiry(e)}
        >
          <MessageSquare size={16} /> Enquire Now
        </button>
        
        <button 
          type="button" 
          className="whatsapp-btn" 
          onClick={(e) => handleWhatsAppClick(e)}
          aria-label={`Inquire about ${displayTitle} on WhatsApp`}
        >
          <FaWhatsapp size={20} />
        </button>
      </div>
    </div>
  )
}

export default ProductCard
