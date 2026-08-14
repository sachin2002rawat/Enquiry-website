import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RelatedProduct.css';
import { MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import productsData from '../../ProductsData.json';

const RelatedProduct = () => {
  const navigate = useNavigate();

  // Store products from ProductsData.json in state to support infinite carousel rotation
  const [products, setProducts] = useState(productsData);

  // Track whether mouse is hovering over carousel (pauses auto-rotation on hover)
  const [isHovered, setIsHovered] = useState(false);

  // Rotate carousel to the next product card (move first item to the end)
  const handleNext = () => {
    setProducts((prev) => {
      const copy = [...prev];
      const first = copy.shift();
      copy.push(first);
      return copy;
    });
  };

  // Rotate carousel to the previous product card (move last item to the front)
  const handlePrev = () => {
    setProducts((prev) => {
      const copy = [...prev];
      const last = copy.pop();
      copy.unshift(last);
      return copy;
    });
  };

  // Auto-slide animation: cycles cards every 2.2 seconds for a faster, smoother experience
  useEffect(() => {
    if (isHovered) return; // Pause timer on hover

    const interval = setInterval(() => {
      handleNext();
    }, 2200);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleEnquire = (productName, e) => {
    if (e) e.stopPropagation();
    alert(`Opening inquiry form for: ${productName}`);
  };

  const handleWhatsApp = (productName, e) => {
    if (e) e.stopPropagation();
    window.open(`https://wa.me/?text=Hi%20I%20am%20interested%20in%20${encodeURIComponent(productName)}`, '_blank');
  };

  const handleCardClick = (product) => {
    const targetSlug = product.slug || product.id;
    navigate(`/product/${targetSlug}`);
  };

  return (
    <section className="related-product-section">
      <div className="rp-container-wrapper">
        
        {/* Header Section */}
        <div className="rp-header">
          
          <div className="rp-header-left">
            <span className="rp-subtitle">— HANDPICKED FOR YOU</span>
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
