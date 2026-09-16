import React from 'react'
import { Handshake, ClipboardCheck, Tag, Headphones, ShieldCheck, Sparkles, Heart, UserCheck } from 'lucide-react'
import featureData from '../WhyChoose.json'

const iconMap = {
  1: ShieldCheck,
  2: Sparkles,
  3: Heart,
  4: UserCheck,
}

const Feature = ({ data, isBeauty = false }) => {
  const activeDataset = data && data.length > 0 ? data : featureData
  const [rotatedId, setRotatedId] = React.useState(null)

  const handleCardClick = (id) => {
    setRotatedId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        
        {/* Header Section */}
        <div className="why-choose-header">
          <span className="why-choose-tag">• WHY CHOOSE US •</span>
          <h2 className="why-choose-title">Why Choose Us</h2>
          <p className="why-choose-subtitle">
            Our Commitment to Your Perfect Beauty Experience
          </p>
        </div>

        {/* Dynamic Layout: 4 Modern Floating Cards Grid for isBeauty vs Standard Single Capsule Frame */}
        {isBeauty ? (
          <div className="beauty-why-choose-grid">
            {activeDataset.map((item, index) => {
              const IconComponent = iconMap[item.id] || Handshake
              const isRotated = rotatedId === item.id

              return (
                <div 
                  key={item.id} 
                  className={`beauty-feature-card ${isRotated ? 'is-rotated-30' : ''}`}
                  onClick={() => handleCardClick(item.id)}
                  style={{ cursor: 'pointer', animationDelay: `${index * 0.12}s` }}
                >
                  <div className="beauty-feature-card-shine"></div>
                  <span className="beauty-card-index">0{index + 1}</span>

                  <div className="feature-icon-wrapper">
                    <div className="feature-icon-circle">
                      <IconComponent size={28} className="feature-lucide-icon" />
                    </div>
                  </div>

                  <h3 className="feature-item-title">{item.title}</h3>
                  <div className="feature-item-dash"></div>
                  <p className="feature-item-desc">{item.description}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="why-choose-capsule-frame">
            {activeDataset.map((item, index) => {
              const IconComponent = iconMap[item.id] || Handshake
              const isRotated = rotatedId === item.id

              return (
                <React.Fragment key={item.id}>
                  <div 
                    className={`why-choose-item ${isRotated ? 'is-rotated-30' : ''}`}
                    onClick={() => handleCardClick(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feature-icon-wrapper">
                      <div className="feature-icon-circle">
                        <IconComponent size={32} className="feature-lucide-icon" />
                      </div>
                    </div>
                    <h3 className="feature-item-title">{item.title}</h3>
                    <div className="feature-item-dash"></div>
                    <p className="feature-item-desc">{item.description}</p>
                  </div>

                  {index < activeDataset.length - 1 && (
                    <div className="why-choose-divider"></div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}

export default React.memo(Feature)
