import React from 'react'
import { Truck, ShieldCheck, Tag, Headphones } from 'lucide-react'
import featureData from '../WhyChoose.json'

const iconMap = {
  1: Truck,
  2: ShieldCheck,
  3: Tag,
  4: Headphones,
}

const Feature = () => {
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        
        {/* Header Section */}
        <div className="why-choose-header">
          <h2 className="why-choose-title">Why Choose Us</h2>
          <p className="why-choose-subtitle">
            Our Commitment to Your Perfect Experience
          </p>
        </div>

        {/* Outer Single Metallic Copper Capsule Frame Box */}
        <div className="why-choose-capsule-frame">
          {featureData.map((item, index) => {
            const IconComponent = iconMap[item.id] || Truck

            return (
              <React.Fragment key={item.id}>
                {/* Feature Item Column */}
                <div className="why-choose-item">
                  
                  {/* 3D Metallic Icon / Illustration Container */}
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon-3d">
                      <IconComponent size={34} className="feature-lucide-icon" />
                    </div>
                  </div>

                  {/* Feature Title & Subtitle */}
                  <h3 className="feature-item-title">
                    {item.title || item.alt}
                  </h3>
                  <p className="feature-item-desc">
                    {item.description || 'Quality guaranteed'}
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
