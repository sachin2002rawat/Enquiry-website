import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiStar, 
  FiCheckCircle, 
  FiMessageSquare,
  FiShare2
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import ProductNavbar from '../components/ProductNavbar'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import productsData from '../ProductsData.json'
import beautyArticles from '../BeautyLatestArticle.json'
import { useEnquiryModal } from '../context/EnquiryModalContext'
import './BlogDetail.css'

const BlogDetail = () => {
  const { id } = useParams()
  const { openModal } = useEnquiryModal()

  // Combine beauty articles & product data for comprehensive lookup
  const allArticles = [...beautyArticles, ...productsData]

  // Find matching article/product by id or slug fallback
  const article = allArticles.find(p => String(p.id) === String(id) || p.slug === id) || beautyArticles[0] || productsData[0]

  // Get 3 related articles
  const relatedArticles = allArticles.filter(p => p.id !== article.id).slice(0, 3)

  // Scroll to top on mount or ID change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="blog-detail-page">
      {/* Top Navbar */}
      <ProductNavbar />

      {/* Hero Header Section - Combined 2-Column Single Row Layout */}
      <ScrollReveal variant="up">
        <section className="blog-detail-hero-section">
          <div className="blog-detail-hero-container">
            
            <div className="blog-detail-hero-row">
            {/* Left Column: Content */}
            <div className="blog-detail-hero-left">
              {/* Top Bar with Back Button & Category */}
              <div className="blog-detail-top-nav">
                <Link to="/blog" className="back-to-blogs-btn">
                  <FiArrowLeft size={16} /> Back to All Articles
                </Link>
                <span className="blog-detail-category-badge">
                  {article.category || 'FEATURED ARTICLE'}
                </span>
              </div>

              {/* Article Title */}
              <h1 className="blog-detail-title">{article.name}</h1>

              {/* Short Description */}
              {article.description && (
                <p className="blog-detail-hero-desc">
                  {article.description}
                </p>
              )}

              {/* Metadata: Date, Read Time, Rating */}
              <div className="blog-detail-meta">
                <div className="blog-detail-meta-item">
                  <FiCalendar size={15} /> Updated August 2026
                </div>
                <div className="blog-detail-meta-item">
                  <FiClock size={15} /> 5 min read
                </div>
                <div className="blog-detail-meta-item rating-item">
                  <FiStar size={15} fill="#f59e0b" color="#f59e0b" /> {article.rating || 4.9} ({article.reviewsCount || 215} Customer Reviews)
                </div>
              </div>
            </div>

            {/* Right Column: Featured Image */}
            <div className="blog-detail-hero-right">
              <div className="blog-detail-cover-wrapper">
                <img
                  src={article.image}
                  alt={article.name}
                  className="blog-detail-cover-img"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/premium_spices.png'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>
      </ScrollReveal>

      {/* Main Content Section */}
      <ScrollReveal variant="up">
        <section className="blog-detail-main-section">
          {/* 2-Column Grid */}
          <div className="blog-detail-grid">
            
            {/* Main Article Content Column */}
            <div className="blog-detail-content-col">
              
              {/* Key Highlights Callout Box */}
              <div className="blog-key-highlights-box">
                <h3 className="blog-key-highlights-title">
                  <FiCheckCircle color="#166534" size={20} /> Key Highlights & Summary
                </h3>
                <ul className="blog-key-highlights-list">
                  <li>
                    <FiCheckCircle size={16} /> 
                    100% Authentic quality sourced directly from trusted organic farms.
                  </li>
                  <li>
                    <FiCheckCircle size={16} /> 
                    {article.description}
                  </li>
                  <li>
                    <FiCheckCircle size={16} /> 
                    Processed under strict ISO-certified hygienic standards with zero artificial additives.
                  </li>
                </ul>
              </div>

              {/* Paragraphs Content */}
              {article.fullDescription && Array.isArray(article.fullDescription) ? (
                article.fullDescription.map((paragraph, idx) => (
                  <p key={idx} className="blog-detail-paragraph">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="blog-detail-paragraph">
                    {article.description} Our dedicated research and culinary experts bring you authentic, wholesome recipes and nutrition guides. Stay connected with us for regular updates on food safety, organic sourcing, and health tips.
                  </p>
                  <p className="blog-detail-paragraph">
                    Every batch undergoes rigorous quality assurance tests to ensure optimal flavor, aroma, and essential nutrient retention. Trusted by thousands of households, distributors, and food processing partners nationwide.
                  </p>
                </>
              )}

              {/* Product Specifications & Details Card */}
              <div className="blog-specs-card">
                <h3 className="blog-specs-title">Product Specifications</h3>
                <div className="blog-specs-grid">
                  <div className="blog-spec-item">
                    <div className="blog-spec-label">SKU Code</div>
                    <div className="blog-spec-value">{article.sku || 'SKU-8829-EX'}</div>
                  </div>
                  <div className="blog-spec-item">
                    <div className="blog-spec-label">Net Weight</div>
                    <div className="blog-spec-value">{article.netWeight || article.weight || '200g / Pack'}</div>
                  </div>
                  <div className="blog-spec-item">
                    <div className="blog-spec-label">Min Order Qty</div>
                    <div className="blog-spec-value">{article.minOrderQty || '50 Units'}</div>
                  </div>
                  <div className="blog-spec-item">
                    <div className="blog-spec-label">Availability</div>
                    <div className="blog-spec-value" style={{ color: '#166534' }}>{article.availability || 'In Stock'}</div>
                  </div>
                </div>
              </div>

              {/* Inline Enquiry Banner */}
              <div className="blog-enquiry-banner">
                <div className="blog-enquiry-text">
                  <h4>Interested in Bulk Orders?</h4>
                  <p>Send an instant enquiry for wholesale pricing & custom packaging.</p>
                </div>
                <div className="blog-enquiry-actions">
                  <button 
                    type="button" 
                    className="blog-enquire-now-btn"
                    onClick={() => openModal(article)}
                  >
                    <FiMessageSquare size={16} /> Send Enquiry
                  </button>
                  <a
                    href={`https://wa.me/919999999999?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(article.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-whatsapp-btn"
                  >
                    <FaWhatsapp size={18} /> WhatsApp
                  </a>
                </div>
              </div>

            </div>

            {/* Sidebar Column */}
            <aside className="blog-detail-sidebar">
              
              {/* Trending / Recommended Articles Widget */}
              <div className="blog-sidebar-widget">
                <h3 className="blog-widget-title">Related Articles</h3>
                <div className="blog-related-list">
                  {relatedArticles.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/blog/${item.id}`} 
                      className="blog-related-card"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="blog-related-thumb"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/premium_spices.png'
                        }}
                      />
                      <div className="blog-related-info">
                        <span className="blog-related-cat">{item.category}</span>
                        <h4 className="blog-related-title">{item.name}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quality Commitment Widget */}
              <div className="blog-sidebar-widget" style={{ background: '#f1e7dd', borderColor: '#e3d6c8' }}>
                <h3 className="blog-widget-title" style={{ borderColor: '#d9cbbe' }}>Why Choose Us?</h3>
                <ul className="blog-key-highlights-list" style={{ gap: '12px' }}>
                  <li>
                    <FiCheckCircle color="#166534" size={16} />
                    <strong>100% Pure & Fresh:</strong> Direct farm sourcing.
                  </li>
                  <li>
                    <FiCheckCircle color="#166534" size={16} />
                    <strong>Fast Nationwide Shipping:</strong> Secure packaging.
                  </li>
                  <li>
                    <FiCheckCircle color="#166534" size={16} />
                    <strong>Verified Export Standards:</strong> Certified processing.
                  </li>
                </ul>
              </div>

            </aside>

          </div>

        </section>
      </ScrollReveal>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default BlogDetail
