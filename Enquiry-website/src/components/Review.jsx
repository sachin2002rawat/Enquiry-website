import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { Star } from 'lucide-react'
import reviewsData from '../Review.json'

const Review = ({ data }) => {
  const activeDataset = data && data.length > 0 ? data : reviewsData
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play timer: cycles through reviews every 5.5 seconds so users can easily read each testimonial (pauses on hover)
  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeDataset.length)
    }, 5500)

    return () => clearInterval(interval)
  }, [isHovered, activeDataset])

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % activeDataset.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + activeDataset.length) % activeDataset.length)
  }

  const handleCardClick = (index) => {
    setActiveIndex(index)
  }

  // Coverflow 3D relative positioning helper
  const getCoverflowClass = (index) => {
    const total = activeDataset.length
    const diff = (index - activeIndex + total) % total

    if (diff === 0) return 'card-3d-center'
    if (diff === 1) return 'card-3d-next'
    if (diff === total - 1) return 'card-3d-prev'
    if (diff === 2) return 'card-3d-far-next'
    if (diff === total - 2) return 'card-3d-far-prev'
    return 'card-3d-hidden'
  }

  return (
    <section className="review-section">
      {/* Subtle glowing background beam */}
      <div className="review-bg-glow"></div>

      {/* Header Area: Subtitle, Title, and Navigation Arrow Controls */}
      <div className="review-header">
        <div className="review-header-left">
          <span className="review-subtitle-tag">— CUSTOMER LOVE</span>
          <h2 className="review-title">
            What They Say <span className="review-title-blue">About Us</span>
          </h2>
        </div>

        {/* Top Right Navigation Arrow Controls */}
        <div className="review-nav-btns">
          <button 
            type="button" 
            className="review-arrow-btn" 
            onClick={handlePrev}
            aria-label="Previous review"
          >
            <FiArrowLeft size={18} />
          </button>

          <button 
            type="button" 
            className="review-arrow-btn next-glow" 
            onClick={handleNext}
            aria-label="Next review"
          >
            <FiArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 3D Animated Coverflow Stage */}
      <div 
        className="review-coverflow-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Particle Sparkle Beam Wave in Background */}
        <div className="review-sparkle-beam"></div>

        {/* 3D Coverflow Track */}
        <div className="review-3d-track">
          {activeDataset.map((review, index) => {
            const coverflowClass = getCoverflowClass(index)

            return (
              <div 
                key={review.id}
                className={`review-glass-card ${coverflowClass}`}
                onClick={() => handleCardClick(index)}
              >
                {/* Prism light reflection edge */}
                <div className="card-prism-edge"></div>

                {/* Top Category Tag */}
                <div className="review-card-top">
                  <span className="review-card-category">{review.category}</span>
                </div>

                {/* Large Floating Frosted Quote Marks */}
                <div className="quote-mark quote-mark-left">“</div>
                <div className="quote-mark quote-mark-right">”</div>

                {/* Testimonial Quote */}
                <p className="review-card-quote">
                  "{review.review}"
                </p>

                {/* Bottom Footer: Author Info & Stat Badge */}
                <div className="review-card-footer">
                  
                  {/* Left: Author Avatar & Name */}
                  <div className="review-author-info">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="review-author-avatar"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                      }}
                    />
                    <div className="review-author-details">
                      <h4 className="review-author-name">{review.name}</h4>
                      <span className="review-author-role">
                        {review.verified} · {review.location}
                      </span>
                    </div>
                  </div>

                  {/* Right: Frosted Stat Badge inside active card */}
                  <div className="review-stat-badge">
                    <div className="stat-badge-icon">
                      <Star size={16} color="#f59e0b" fill="#f59e0b" />
                    </div>
                    <div className="stat-badge-text">
                      <span className="stat-badge-title">{review.rating}.0 ★</span>
                      <span className="stat-badge-label">VERIFIED BUYER</span>
                    </div>
                  </div>

                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default React.memo(Review)
