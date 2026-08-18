import React from 'react'
import { Handshake, ClipboardCheck, Tag, Headphones } from 'lucide-react'
import featureData from '../WhyChoose.json'

const iconMap = {
  1: Handshake,
  2: ClipboardCheck,
  3: Tag,
  4: Headphones,
}

const Feature = () => {
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        
        {/* Header Section */}
        <div className="why-choose-header">
          <span className="why-choose-tag">• WHY CHOOSE US •</span>
          <h2 className="why-choose-title">Why Choose Us</h2>
          <p className="why-choose-subtitle">
            Our Commitment to Your Perfect Experience
          </p>
        </div>

        {/* Outer Single White Capsule Frame Box */}
        <div className="why-choose-capsule-frame">
          {featureData.map((item, index) => {
            const IconComponent = iconMap[item.id] || Handshake

            return (
              <React.Fragment key={item.id}>
                {/* Feature Item Column */}
                <div className="why-choose-item">
                  
                  {/* Circular Icon Container */}
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon-circle">
                      <IconComponent size={32} className="feature-lucide-icon" />
                    </div>
                  </div>

                  {/* Feature Title */}
                  <h3 className="feature-item-title">
                    {item.title}
                  </h3>

                  {/* Accent Dash Line under Title */}
                  <div className="feature-item-dash"></div>

                  {/* Feature Description */}
                  <p className="feature-item-desc">
                    {item.description}
                  </p>

                </div>

                {/* Vertical Divider Line between items */}
                {index < featureData.length - 1 && (
                  <div className="why-choose-divider"></div>
                )}
              </React.Fragment>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Feature
