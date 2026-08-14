import React from 'react'

const CompanySection = () => {
  // List of trusted retail & partner companies
  const companyList = [
    'Reliance Retail',
    'Big Basket',
    'D-Mart',
    'Amazon Fresh',
    'Flipkart',
    'Jiomart',
    'Blinkit',
    'Zepto',
    'Swiggy Instamart'
  ]

  return (
    <section className="company-section">
      <div className="company-container">
        
        {/* Left Fixed Label */}
        <div className="company-label">
          <span className="label-text">TRUSTED BY</span>
          <span className="label-divider"></span>
        </div>

        {/* Horizontal Scrolling Marquee Track */}
        <div className="company-marquee-wrapper">
          <div className="company-marquee-track">
            {/* First loop sequence */}
            {companyList.map((company, index) => (
              <span key={`set1-${index}`} className="company-item">
                {company}
              </span>
            ))}
            
            {/* Second identical loop sequence for seamless continuous motion */}
            {companyList.map((company, index) => (
              <span key={`set2-${index}`} className="company-item">
                {company}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default CompanySection

