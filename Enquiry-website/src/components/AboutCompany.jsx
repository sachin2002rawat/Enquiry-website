import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Users, Sparkles } from 'lucide-react'
import { FiArrowRight } from 'react-icons/fi'

const AboutCompany = ({
  isBeauty = false,
  image,
  title,
  subtitle = '— WHO WE ARE',
  description1,
  description2,
  badge1Number,
  badge1Label,
  badge2Number,
  badge2Label
}) => {
  const navigate = useNavigate()

  const handleAboutMore = () => {
    navigate('/about-company')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Beauty defaults vs Standard defaults
  const defaultImage = isBeauty
    ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'

  const defaultDesc1 = isBeauty
    ? 'Established in 2012, we are dedicated to crafting dermatologically-tested, organic, and cruelty-free skincare, haircare, and cosmetic solutions. Our commitment to pure ingredients, innovative formulations, and radiant skin health has made us a trusted beauty choice for thousands.'
    : 'Established in 2012, we have grown from a small local business into a trusted national brand. Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for thousands of customers across the country.'

  const defaultDesc2 = isBeauty
    ? 'Every serum, hydrating gel, and botanical elixir in our collection is carefully formulated with clean, active ingredients to nourish your skin, enhance natural glow, and elevate your daily self-care ritual.'
    : 'Every product in our catalogue is carefully selected and quality-checked to ensure it meets our high standards. We believe that great products and great service go hand in hand.'

  const b1Number = badge1Number || (isBeauty ? '12+' : '12+')
  const b1Label = badge1Label || (isBeauty ? 'YEARS IN BEAUTY' : 'YEARS ESTABLISHED')
  const b2Number = badge2Number || (isBeauty ? '100%' : '35+')
  const b2Label = badge2Label || (isBeauty ? 'CRUELTY FREE & VEGAN' : 'TEAM MEMBERS')

  return (
    <section className="about-company-section">
      {/* Soft background light flare beam overlay */}
      <div className="about-light-flare"></div>

      <div className="about-company-container">
        
        {/* Left Column: Team Image with Glassmorphism Overlay Cards */}
        <div className="about-image-column">
          <div className="about-image-card">
            
            {/* Main Image */}
            <img 
              src={image || defaultImage} 
              alt={isBeauty ? 'Our Beauty Brand Journey' : 'Our Company Journey'} 
              className="about-main-img"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />

            {/* Top-Left Glassmorphism Badge */}
            <div className="glass-badge badge-top-left">
              <div className="glass-icon-wrapper">
                <Award size={20} className="glass-icon" />
              </div>
              <div className="glass-badge-text">
                <span className="glass-badge-number">{b1Number}</span>
                <span className="glass-badge-label">{b1Label}</span>
              </div>
            </div>

            {/* Bottom-Right Glassmorphism Badge */}
            <div className="glass-badge badge-bottom-right">
              <div className="glass-icon-wrapper">
                {isBeauty ? <Sparkles size={20} className="glass-icon" /> : <Users size={20} className="glass-icon" />}
              </div>
              <div className="glass-badge-text">
                <span className="glass-badge-number">{b2Number}</span>
                <span className="glass-badge-label">{b2Label}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Text Content & CTA */}
        <div className="about-content-column">
          
          <span className="about-subtitle-tag">{subtitle}</span>
          
          {title ? (
            <h2 className="about-title">{title}</h2>
          ) : (
            <h2 className="about-title">
              About Our <span className="about-title-blue">{isBeauty ? 'Beauty Care' : 'Company'}</span>
            </h2>
          )}

          <p className="about-description">
            {description1 || defaultDesc1}
          </p>

          <p className="about-description">
            {description2 || defaultDesc2}
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
