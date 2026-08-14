import React from 'react'

const TrustedBy = () => {
  // List of trusted partner retail companies
  const companies = [
    'Reliance Retail',
    'Big Basket',
    'D-Mart',
    'Amazon Fresh',
    'Flipkart',
    'Jiomart',
    'Blinkit',
    'Zepto',
    'Swiggy Instamart',
    'Nature\'s Basket'
  ]

  return (
    <section className="trusted-by-section">
      <div className="trusted-by-container">
        
        {/* Left Section Label */}
        <div className="trusted-label-box">
          <span className="trusted-title">TRUSTED BY</span>
          <span className="trusted-divider"></span>
        </div>

        {/* Horizontal Scrolling Marquee Track */}
        <div className="ticker-container">
          <div className="ticker-track">
            {/* Group 1 */}
            {companies.map((name, index) => (
              <span key={`g1-${index}`} className="company-name">
                {name}
              </span>
            ))}

            {/* Group 2 (Duplicate for Seamless Loop) */}
            {companies.map((name, index) => (
              <span key={`g2-${index}`} className="company-name">
                {name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default TrustedBy
