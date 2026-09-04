import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import categoryDataMap from '../CategoryProductsData.json';
import productsData from '../ProductsData.json';
import beautyProductsData from '../BeautyProductsData.json';
import '../components/CategoryProductGrid.css';
import { MessageSquare } from 'lucide-react';
import { FaWhatsapp, FaStar, FaFilePdf } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { useEnquiryModal } from '../context/EnquiryModalContext';

const combinedCatalog = [...productsData, ...beautyProductsData];

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openEnquiryModal } = useEnquiryModal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const categoryKey = id ? id.toLowerCase().trim() : 'garam-masala';

  // Retrieve exact 4-card category products list from CategoryProductsData.json
  let categoryGroup = categoryDataMap[categoryKey];

  // Fallback matching if slug key isn't exact
  if (!categoryGroup) {
    const foundKey = Object.keys(categoryDataMap).find(
      (key) => key.includes(categoryKey) || categoryKey.includes(key)
    );
    if (foundKey) {
      categoryGroup = categoryDataMap[foundKey];
    }
  }

  // Dynamic fallback: build a 4-card set from combinedCatalog if key not found in CategoryProductsData
  let displayTitle = categoryGroup?.title || id?.replace(/-/g, ' ') || 'Garam Masala';
  let categoryProducts = categoryGroup?.products;

  if (!categoryProducts || categoryProducts.length === 0) {
    const formattedTitle = id
      ? id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : 'Beauty Care';
    displayTitle = formattedTitle;

    // Filter items matching title or category
    const matched = combinedCatalog.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(categoryKey.replace(/-/g, ' ')) ||
        (p.category || '').toLowerCase().includes(categoryKey.replace(/-/g, ' '))
    );

    const fallbacks = matched.length >= 4 ? matched.slice(0, 4) : [...matched, ...combinedCatalog].slice(0, 4);

    categoryProducts = fallbacks.map((item, index) => ({
      id: item.id || index + 500,
      slug: item.slug || item.id,
      collection: `${formattedTitle.toUpperCase()} COLLECTION`,
      name: item.name,
      category: item.category || 'PRODUCTS',
      rating: item.rating || 4.8,
      reviewsCount: item.reviewsCount || 127,
      description: item.description || `Premium quality ${item.name} packed with natural ingredients.`,
      image: item.image || '/garam_masala.png',
      hasPdf: true
    }));
  }

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

  return (
    <div>
      <ProductNavbar />

      <section className="category-detail-section">
        <div className="cpg-container-wrapper">
          
          {/* Header Section matching Image 2 */}
          <div className="cpg-header">
            <div className="cpg-header-left">
              <span className="cpg-subtitle">— HANDPICKED FOR YOU</span>
              <h2 className="cpg-title">
                Related <span className="cpg-title-highlight">{displayTitle}</span> Products
              </h2>
            </div>

            <Link to="/product" className="cpg-view-all-link">
              <span>View All Catalog Products</span>
              <FiArrowRight size={16} />
            </Link>
          </div>

          {/* 4-Card Grid matching Image 2 */}
          <div className="cpg-grid-track">
            {categoryProducts.map((product) => (
              <div 
                key={product.id} 
                className="cpg-card"
                onClick={() => handleCardClick(product)}
                style={{ cursor: 'pointer' }}
              >
                
                {/* Collection Tag */}
                <span className="cpg-card-tag">
                  {product.collection || `${displayTitle.toUpperCase()} COLLECTION`}
                </span>

                {/* Product Image Container with PDF Badge */}
                <div className="cpg-img-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="cpg-img" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/premium_spices.png";
                    }}
                  />
                  {product.hasPdf !== false && (
                    <div className="cpg-pdf-badge" title="Catalog PDF Available">
                      <FaFilePdf size={15} color="#e11d48" />
                    </div>
                  )}
                </div>

                {/* Category Tag */}
                <span className="cpg-card-category">{product.category}</span>

                {/* Product Title */}
                <h3 className="cpg-card-title">{product.name}</h3>

                {/* Rating Stars Row */}
                <div className="cpg-rating-row">
                  <div className="cpg-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={14} color="#f59e0b" />
                    ))}
                  </div>
                  <span className="cpg-rating-count">({product.rating || 4.8})</span>
                </div>

                {/* Description */}
                <p className="cpg-card-description">{product.description}</p>

                {/* Action Buttons (Enquire & WhatsApp) */}
                <div className="cpg-card-actions">
                  <button 
                    type="button" 
                    className="cpg-btn-enquire"
                    onClick={(e) => handleEnquire(product.name, e)}
                  >
                    <MessageSquare size={16} />
                    <span>Enquire Now</span>
                  </button>

                  <button 
                    type="button" 
                    className="cpg-btn-whatsapp"
                    onClick={(e) => handleWhatsApp(product.name, e)}
                    aria-label={`Inquire about ${product.name} on WhatsApp`}
                  >
                    <FaWhatsapp size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryDetails;
