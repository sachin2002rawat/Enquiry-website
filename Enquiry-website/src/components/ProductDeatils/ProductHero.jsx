import React, { useState } from 'react';
import './ProductDetailHero.css';
import { 
  Share2, 
  ZoomIn, 
  Star, 
  CheckCircle, 
  Mail, 
  PhoneCall, 
  Truck, 
  Headphones, 
  RotateCcw, 
  Grid, 
  X 
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// =========================================================================
// HARDCODED PRODUCT DATA (Freshers: Easy to read & update or replace later)
// =========================================================================
const HARDCODED_PRODUCT = {
  title: "Yumii Masala Tofu (Soya Paneer) – 200g",
  category: "PURE SPICES",
  rating: "4.8",
  reviewsCount: "127",
  description: "Start your mornings right with Yumii's premium Masala Tofu — crafted from non-GMO soybeans with an authentic Indian masala blend. Rich in plant protein, cholesterol-free, and versatile for everyday cooking. Ideal for B2B distributors, retailers, and bulk buyers.",
  sku: "YMT-200-2024",
  netWeight: "200g / Pack",
  minOrderQty: "50 Units",
  availability: "In Stock",
  images: [
    "/tofu_pack.png",
    "/masala_tofu.png",
    "/tofu_pack.png"
  ]
};

const ProductHero = ({ product }) => {
  const activeProduct = {
    title: product?.name || product?.title || HARDCODED_PRODUCT.title,
    category: product?.category || HARDCODED_PRODUCT.category,
    rating: product?.rating ?? HARDCODED_PRODUCT.rating,
    reviewsCount: product?.reviewsCount ?? HARDCODED_PRODUCT.reviewsCount,
    description: product?.description || HARDCODED_PRODUCT.description,
    sku: product?.sku || `SKU-${product?.id || '2024'}`,
    netWeight: product?.netWeight || (product?.weight ? `${product.weight} / Pack` : HARDCODED_PRODUCT.netWeight),
    minOrderQty: product?.minOrderQty || HARDCODED_PRODUCT.minOrderQty,
    availability: product?.availability || HARDCODED_PRODUCT.availability,
    images: Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : (product?.image ? [product.image, "/premium_spices.png", "/garam_masala.png"] : HARDCODED_PRODUCT.images)
  };

  // State 1: Keep track of which image INDEX is currently selected in the gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Reset selected image index to 0 whenever product prop changes
  React.useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  // Gallery Navigation: Left & Right arrow handlers
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      (prev - 1 + activeProduct.images.length) % activeProduct.images.length
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      (prev + 1) % activeProduct.images.length
    );
  };

  // Keyboard navigation support: ArrowLeft and ArrowRight keys
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProduct.images.length]);

  // State 2: Keep track of whether the zoom modal is open (true) or closed (false)
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentMainImage = activeProduct.images[selectedImageIndex] || activeProduct.images[0];

  return (
    <section className="product-hero-section">
      <div className="ph-container-wrapper">
        <div className="ph-grid-container">
        
        {/* =================================================================
           LEFT SIDE: PRODUCT GALLERY (MAIN IMAGE & THUMBNAILS)
           ================================================================= */}
        <div className="ph-gallery-column">
          
          {/* Main Product Image Card */}
          <div className="ph-gallery-card">
            
            {/* Top Badges: FSSAI & Share */}
            <div className="ph-card-topbar">
              <span className="ph-badge-fssai">+ FSSAI CERTIFIED</span>
              <button 
                type="button" 
                className="ph-share-btn" 
                onClick={() => alert("Product link copied!")}
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
            </div>

            {/* Center Main Product Image with Gallery Arrow Controls */}
            <div className="ph-main-img-wrapper" style={{ position: 'relative' }}>
              
              {/* Left Arrow Button over Main Image */}
              {activeProduct.images.length > 1 && (
                <button
                  type="button"
                  className="ph-gallery-arrow prev"
                  onClick={handlePrevImage}
                  aria-label="Previous gallery image"
                  title="Previous image (Left Arrow Key)"
                >
                  ‹
                </button>
              )}

              <img 
                src={currentMainImage} 
                alt="Product Preview" 
                className="ph-main-img" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/premium_spices.png";
                }}
              />

              {/* Right Arrow Button over Main Image */}
              {activeProduct.images.length > 1 && (
                <button
                  type="button"
                  className="ph-gallery-arrow next"
                  onClick={handleNextImage}
                  aria-label="Next gallery image"
                  title="Next image (Right Arrow Key)"
                >
                  ›
                </button>
              )}
            </div>

            {/* Bottom Button: Tap to Zoom */}
            <button 
              type="button" 
              className="ph-zoom-btn" 
              onClick={() => setIsZoomOpen(true)}
            >
              <ZoomIn size={15} />
              <span>Tap to Zoom (Press ← → keys to switch)</span>
            </button>

          </div>

          {/* Thumbnail Images Row Container with styled background */}
          <div className="ph-thumbnails-container">
            <div className="ph-thumbnails-header">
              <span className="ph-thumbnails-title">Product Views ({activeProduct.images.length})</span>
            </div>
            <div className="ph-thumbnails-row">
              {activeProduct.images.map((imageSrc, index) => (
                <button 
                  key={index}
                  type="button"
                  className={`ph-thumb-card ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img 
                    src={imageSrc} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="ph-thumb-img" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/tofu_pack.png";
                    }}
                  />
                  {selectedImageIndex === index && (
                    <span className="ph-thumb-active-badge">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* =================================================================
           RIGHT SIDE: PRODUCT DETAILS & ACTION BUTTONS
           ================================================================= */}
        <div className="ph-details-card">
          
          {/* Category Tag */}
          <div className="ph-category-tag">
            <Grid size={13} />
            <span>{activeProduct.category}</span>
          </div>

          {/* Product Title */}
          <h1 className="ph-product-title">{activeProduct.title}</h1>

          {/* Rating & Verified Badge */}
          <div className="ph-rating-row">
            <div className="ph-stars">
              <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
              <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
              <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
              <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
              <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
            </div>

            <span className="ph-rating-text">
              <strong className="ph-rating-score">{activeProduct.rating}</strong> ({activeProduct.reviewsCount} reviews)
            </span>

            <div className="ph-verified-badge">
              <CheckCircle size={14} />
              <span>Verified</span>
            </div>
          </div>

          {/* Product Description */}
          <p className="ph-description">
            {activeProduct.description}
          </p>

          {/* Product Specifications (2x2 Grid) */}
          <div className="ph-spec-grid">
            <div className="ph-spec-box">
              <span className="ph-spec-label">SKU</span>
              <span className="ph-spec-value">{activeProduct.sku}</span>
            </div>

            <div className="ph-spec-box">
              <span className="ph-spec-label">NET WEIGHT</span>
              <span className="ph-spec-value">{activeProduct.netWeight}</span>
            </div>

            <div className="ph-spec-box">
              <span className="ph-spec-label">MIN. ORDER QTY</span>
              <span className="ph-spec-value">{activeProduct.minOrderQty}</span>
            </div>

            <div className="ph-spec-box">
              <span className="ph-spec-label">AVAILABILITY</span>
              <span className="ph-spec-value ph-in-stock-text">
                <span className="ph-in-stock-dot"></span>
                {activeProduct.availability}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ph-cta-group">
            {/* Send Enquiry Button */}
            <button 
              type="button" 
              className="ph-btn-enquiry" 
              onClick={() => alert("Send Enquiry clicked!")}
            >
              <Mail size={18} />
              <span>Send Enquiry</span>
            </button>

            {/* Request Callback & WhatsApp Buttons */}
            <div className="ph-btn-row">
              <button 
                type="button" 
                className="ph-btn-callback" 
                onClick={() => alert("Callback requested!")}
              >
                <PhoneCall size={18} />
                <span>Request A Callback</span>
              </button>

              <button 
                type="button" 
                className="ph-btn-whatsapp"
                onClick={() => window.open('https://wa.me/?text=Hi%20I%20want%20to%20enquire%20about%20Yumii%20Masala%20Tofu', '_blank')}
              >
                <FaWhatsapp size={20} />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Highlights Footer Icons */}
          <div className="ph-highlights-row">
            <div className="ph-highlight-item">
              <CheckCircle size={16} className="ph-highlight-icon" />
              <span>FSSAI Certified</span>
            </div>

            <div className="ph-highlight-item">
              <Truck size={16} className="ph-highlight-icon" />
              <span>Pan-India Delivery</span>
            </div>

            <div className="ph-highlight-item">
              <Headphones size={16} className="ph-highlight-icon" />
              <span>24/7 Support</span>
            </div>

            <div className="ph-highlight-item">
              <RotateCcw size={16} className="ph-highlight-icon" />
              <span>Easy Returns</span>
            </div>
          </div>

        </div>
      </div>
    </div>

      {/* Pop-up Modal when "Tap to Zoom" is clicked */}
      {isZoomOpen && (
        <div className="ph-zoom-modal-overlay" onClick={() => setIsZoomOpen(false)}>
          <div className="ph-zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="ph-modal-close-btn" 
              onClick={() => setIsZoomOpen(false)}
            >
              <X size={20} />
            </button>
            <img src={selectedImage} alt="Enlarged View" className="ph-zoomed-img" />
          </div>
        </div>
      )}

    </section>
  );
};

export default ProductHero;
