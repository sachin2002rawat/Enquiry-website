import React, { useState } from 'react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import articlesData from '../LatestArticle.json'

const LatestArticle = () => {
  // Store articles in state for carousel rotation
  const [articles, setArticles] = useState(articlesData)

  const handleNext = () => {
    setArticles((prev) => {
      const copy = [...prev]
      const first = copy.shift()
      copy.push(first)
      return copy
    })
  }

  const handlePrev = () => {
    setArticles((prev) => {
      const copy = [...prev]
      const last = copy.pop()
      copy.unshift(last)
      return copy
    })
  }

  const handleArticleClick = (title) => {
    alert(`Reading Article: "${title}"`)
  }

  return (
    <section className="latest-articles-section">
      <div className="latest-articles-container">
        
        {/* Header Section */}
        <div className="latest-articles-header">
          <div className="latest-articles-header-left">
            <span className="latest-subtitle-tag">— STAY INFORMED</span>
            <h2 className="latest-title">The Latest Articles</h2>
          </div>

          <div className="latest-header-right">
            <a 
              href="#articles" 
              className="view-all-articles-link"
              onClick={(e) => {
                e.preventDefault()
                alert('Viewing All Articles...')
              }}
            >
              View All Articles <span className="link-arrow">→</span>
            </a>

            {/* Carousel Arrow Controls */}
            <div className="latest-carousel-nav">
              <button 
                type="button" 
                className="latest-arrow-btn" 
                onClick={handlePrev}
                aria-label="Previous article"
              >
                <FiArrowLeft size={18} />
              </button>
              <button 
                type="button" 
                className="latest-arrow-btn" 
                onClick={handleNext}
                aria-label="Next article"
              >
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid / Carousel Stage */}
        <div className="latest-articles-grid">
          {articles.slice(0, 3).map((article) => (
            <div 
              key={article.id} 
              className="article-card"
              onClick={() => handleArticleClick(article.title)}
            >
              {/* Ribbon Bookmark Date Tag */}
              <div className="article-date-ribbon">
                <span className="ribbon-fold"></span>
                {article.date}
              </div>

              {/* Card Image */}
              <div className="article-img-container">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="article-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                  }}
                />
              </div>

              {/* Bottom Frosted Glassmorphism Panel */}
              <div className="article-glass-panel">
                <h3 className="article-title">{article.title}</h3>
                
                <div className="article-panel-footer">
                  <span className="read-more-link">
                    {article.readMore || 'Read More'} <FiArrowRight size={15} className="read-arrow" />
                  </span>

                  {/* Brand Leaf Watermark Icon */}
                  <div className="article-brand-watermark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default React.memo(LatestArticle)
