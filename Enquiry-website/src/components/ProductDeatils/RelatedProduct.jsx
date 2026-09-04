import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RelatedProduct.css';
import { MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import productsData from '../../ProductsData.json';
import beautyProductsData from '../../BeautyProductsData.json';
import { useEnquiryModal } from '../../context/EnquiryModalContext';

const allProducts = [...productsData, ...beautyProductsData];

const RelatedProduct = ({ currentProduct }) => {
  const navigate = useNavigate();
  const { openEnquiryModal } = useEnquiryModal();

  // Helper function to build related products list (at least 5 items)
  const getRelatedProducts = (currProd) => {
    if (!currProd) return allProducts.slice(1, 7);

    const currCategory = (currProd.category || '').toUpperCase();
    const currId = currProd.id;
    const currSlug = (currProd.slug || '').toLowerCase();

    // Helper functions for category grouping
    const isSpiceCategory = (cat) => 
      ['PURE SPICES', 'WHOLE SPICES', 'MIX MASALA'].includes(cat) || 
      cat.includes('SPICE') || cat.includes('MASALA');

    const isTofuCategory = (cat) => 
      ['YUMII MASALA TOFU', 'SOYA CHUNKS'].includes(cat) || 
      cat.includes('TOFU') || cat.includes('SOYA');

    const isBeautyCategory = (cat) =>
      ['SKIN CARE', 'HAIR CARE', 'FACE CARE', 'COSMETICS', 'BODY CARE', 'ESSENTIAL OILS'].includes(cat) ||
      cat.includes('SKIN') || cat.includes('BEAUTY') || cat.includes('HAIR') || cat.includes('FACE');

    // Exclude current product itself
    const candidateList = allProducts.filter((item) => {
      if (item.id === currId) return false;
      if (item.slug && item.slug.toLowerCase() === currSlug) return false;
      return true;
    });

    let relatedMatches = [];

    if (isSpiceCategory(currCategory)) {
      relatedMatches = candidateList.filter((item) => isSpiceCategory((item.category || '').toUpperCase()));
    } else if (isTofuCategory(currCategory)) {
      relatedMatches = candidateList.filter((item) => isTofuCategory((item.category || '').toUpperCase()));
    } else if (isBeautyCategory(currCategory)) {
      relatedMatches = candidateList.filter((item) => isBeautyCategory((item.category || '').toUpperCase()));
    } else {
      relatedMatches = candidateList.filter((item) => (item.category || '').toUpperCase() === currCategory);
    }

    // Ensure at least 5 items are in the related list
    if (relatedMatches.length < 5) {
      const existingIds = new Set(relatedMatches.map((p) => p.id));
      const fallbackItems = candidateList.filter((item) => !existingIds.has(item.id));
      relatedMatches = [...relatedMatches, ...fallbackItems];
    }

    return relatedMatches;
  };

  // Store filtered products in state for infinite carousel rotation
  const [products, setProducts] = useState(() => getRelatedProducts(currentProduct));

  // Re-filter when currentProduct changes
  useEffect(() => {
    setProducts(getRelatedProducts(currentProduct));
  }, [currentProduct]);

  // Track whether mouse is hovering over carousel (pauses auto-rotation)
  const [isHovered, setIsHovered] = useState(false);

  // Rotate carousel to the next product card
  const handleNext = () => {
    setProducts((prev) => {
      if (prev.length <= 1) return prev;
      const copy = [...prev];
      const first = copy.shift();
      copy.push(first);
      return copy;
    });
  };

  // Rotate carousel to the previous product card
  const handlePrev = () => {
    setProducts((prev) => {
      if (prev.length <= 1) return prev;
      const copy = [...prev];
      const last = copy.pop();
      copy.unshift(last);
      return copy;
    });
  };

  // Auto-slide animation: cycles cards every 2.8 seconds
  useEffect(() => {
    if (isHovered || products.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 2800);

    return () => clearInterval(interval);
  }, [isHovered, products]);

  const handleEnquire = (productName, e) => {
    if (e) e.stopPropagation();
    openEnquiryModal(productName);
  };

  const handleWhatsApp = (productName, e) => {
    if (e) e.stopPropagation();
    window.open(`https://wa.me/?text=Hi%20I%20am%20interested%20in%20${encodeURIComponent(productName)}`, '_blank');
  };

  const handleCardClick = (product) => {
    const targetSlug = product.slug || product.id;
    navigate(`/product/${targetSlug}`);
  };

  const activeCategoryTitle = currentProduct?.name || currentProduct?.category || 'Spices';

  return (
    <section className="related-product-section">
      <div className="rp-container-wrapper">
        
        {/* Header Section */}
        <div className="rp-header">
          
          <div className="rp-header-left">
            <span className="rp-subtitle">— RELATED TO {activeCategoryTitle.toUpperCase()} ({products.length} PRODUCTS)</span>
            <h2 className="rp-title">
              Related <span className="rp-title-highlight">Products</span>
            </h2>
          </div>

          <a href="/product" className="rp-view-all-link">
            <span>View All Products</span>
            <FiArrowRight size={16} />
          </a>

        </div>

        {/* Carousel Container with Side Overlay Buttons & Auto-Play */}
        <div 
          className="rp-carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Floating Left Side Arrow Button */}
          <button 
            type="button" 
            className="rp-side-arrow prev" 
            onClick={handlePrev} 
            aria-label="Previous Products"
          >
            <FiArrowLeft size={20} />
          </button>

          {/* Product Cards Grid Track */}
          <div className="rp-grid-track">
            {products.slice(0, 3).map((product) => (
              <div 
                key={product.id} 
                className="rp-card"
                onClick={() => handleCardClick(product)}
                style={{ cursor: 'pointer' }}
              >
                
                {/* Collection Tag */}
                <span className="rp-card-tag">
                  {product.collection || `${product.category} COLLECTION`}
                </span>

                {/* Product Image */}
                <div className="rp-img-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="rp-img" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/premium_spices.png";
                    }}
                  />
                </div>

                {/* Product Name */}
                <h3 className="rp-card-title">{product.name}</h3>

                {/* Category */}
                <span className="rp-card-category">{product.category}</span>

                {/* Description */}
                <p className="rp-card-description">{product.description}</p>

                {/* Action Buttons (Enquire & WhatsApp) */}
                <div className="rp-card-actions">
                  
                  <button 
                    type="button" 
                    className="rp-btn-enquire"
                    onClick={(e) => handleEnquire(product.name, e)}
                  >
                    <MessageSquare size={16} />
                    <span>Enquire Now</span>
                  </button>

                  <button 
                    type="button" 
                    className="rp-btn-whatsapp"
                    onClick={(e) => handleWhatsApp(product.name, e)}
                    aria-label={`Inquire about ${product.name} on WhatsApp`}
                  >
                    <FaWhatsapp size={18} />
                  </button>

                </div>

              </div>
            ))}
          </div>

          {/* Floating Right Side Arrow Button */}
          <button 
            type="button" 
            className="rp-side-arrow next" 
            onClick={handleNext} 
            aria-label="Next Products"
          >
            <FiArrowRight size={20} />
          </button>

        </div>

      </div>
    </section>
  );
};

export default RelatedProduct;

