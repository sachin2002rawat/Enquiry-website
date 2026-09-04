import React from 'react'
import { Star } from 'lucide-react'
import reviewsData from '../Review.json'

const Review = ({ data, isBeauty = false }) => {
  const activeDataset = data && data.length > 0 ? data : reviewsData

  // Duplicate dataset to create seamless non-stop infinite loop
  const marqueeDataset = [...activeDataset, ...activeDataset]

  return (
    <section className="review-section">
      {/* Subtle glowing background beam */}
      <div className="review-bg-glow"></div>

      {/* Header Area: Subtitle & Title */}
      <div className="review-header">
        <div className="review-header-left">
          <span className="review-subtitle-tag">— CUSTOMER LOVE</span>
          <h2 className="review-title">
            What They Say <span className="review-title-blue">About Us</span>
          </h2>
        </div>
      </div>

      {/* Non-Stop Infinite Fast Marquee Moving Left-to-Right */}
      <div className="review-marquee-stage">
        <div className="review-marquee-track">
          {marqueeDataset.map((review, index) => (
            <div 
              key={`${review.id}-${index}`} 
              className={`review-marquee-card ${isBeauty ? 'beauty-review-card' : ''}`}
            >
              {/* Card Header Tag & Rating */}
              <div className="review-card-top-row">
                <span className="review-card-category-tag">{review.category}</span>
                <div className="review-card-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      color="#f59e0b" 
                      fill={i < (review.rating || 5) ? '#f59e0b' : 'transparent'} 
                    />
                  ))}
                </div>
              </div>

              {/* Quote Mark Decor */}
              <div className="card-quote-icon">“</div>

              {/* Review Testimonial Quote */}
              <p className="review-card-body-text">
                "{review.review}"
              </p>

              {/* Author & Verification Footer */}
              <div className="review-card-bottom-row">
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
                      {review.verified || 'Verified Buyer'} · {review.location || 'Customer'}
                    </span>
                  </div>
                </div>

                <div className="review-verified-badge">
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <span>{review.rating || 5}.0 ★</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default React.memo(Review)
