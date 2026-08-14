import React from 'react'
import { Award, Users } from 'lucide-react'
import { FiArrowRight } from 'react-icons/fi'

const AboutCompany = () => {
  const handleAboutMore = () => {
    alert('Opening About Company detailed overview...')
  }

  return (
    <section className="about-company-section">
      {/* Soft background light flare beam overlay */}
      <div className="about-light-flare"></div>

      <div className="about-company-container">
        
        {/* Left Column: Team Image with Glassmorphism Overlay Cards */}
        <div className="about-image-column">
          <div className="about-image-card">
            
            {/* Main Team Photo */}
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" 
              alt="Our Company Journey" 
              className="about-main-img"
              loading="lazy"
              decoding="async"
            />

            {/* Top-Left Glassmorphism Badge (12+ Years Established) */}
            <div className="glass-badge badge-top-left">
              <div className="glass-icon-wrapper">
                <Award size={20} className="glass-icon" />
              </div>
              <div className="glass-badge-text">
                <span className="glass-badge-number">12+</span>
                <span className="glass-badge-label">YEARS ESTABLISHED</span>
              </div>
            </div>

            {/* Bottom-Right Glassmorphism Badge (35+ Team Members) */}
            <div className="glass-badge badge-bottom-right">
              <div className="glass-icon-wrapper">
                <Users size={20} className="glass-icon" />
              </div>
              <div className="glass-badge-text">
                <span className="glass-badge-number">35+</span>
                <span className="glass-badge-label">TEAM MEMBERS</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Text Content & CTA */}
        <div className="about-content-column">
          
          <span className="about-subtitle-tag">— WHO WE ARE</span>
          
          <h2 className="about-title">
            About Our <span className="about-title-blue">Company</span>
          </h2>

          <p className="about-description">
            Established in 2012, we have grown from a small local business into a trusted national brand. Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for thousands of customers across the country.
          </p>

          <p className="about-description">
            Every product in our catalogue is carefully selected and quality-checked to ensure it meets our high standards. We believe that great products and great service go hand in hand.
          </p>

          {/* CTA Button */}
          <button 
            type="button" 
            className="about-cta-btn" 
            onClick={handleAboutMore}
          >
            About More <FiArrowRight size={16} className="btn-arrow" />
          </button>

        </div>

      </div>

      {/* Decorative Sparkle Icon Accent in Bottom Right */}
      <div className="about-decorative-star">✦</div>
    </section>
  )
}

export default React.memo(AboutCompany)
