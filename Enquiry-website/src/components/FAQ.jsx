import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import faqData from '../Faq.json'

const FAQ = () => {
  // Default open the first question (id: 1) to match mockup design screenshot
  const [openId, setOpenId] = useState(1)

  const toggleFaq = (id) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  const handleContactSupport = () => {
    const contactSection = document.querySelector('.contact-us-section')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      alert('Opening Support & Enquiry...')
    }
  }

  return (
    <section className="faq-section">
      {/* Abstract contour wireframe SVG background overlay */}
      <div className="faq-contour-bg"></div>

      <div className="faq-layout-container">
        
        {/* LEFT COLUMN: Subtitle Tag, Main Serif Heading, & Contact Support Link */}
        <div className="faq-left-column">
          <span className="faq-subtitle-tag">COMMON QUESTIONS</span>
          
          <h2 className="faq-main-heading">
            Frequently <br />
            asked questions.
          </h2>

          <p className="faq-support-prompt">
            Can't find what you're looking for?{' '}
            <span 
              className="faq-contact-highlight" 
              onClick={handleContactSupport}
              role="button"
              tabIndex={0}
            >
              Contact support
            </span>
          </p>
        </div>

        {/* RIGHT COLUMN: Accordion Cards Stack */}
        <div className="faq-right-column">
          {faqData.map((item) => {
            const isOpen = openId === item.id

            return (
              <div 
                key={item.id} 
                className={`faq-pill-card ${isOpen ? 'open-pill' : ''}`}
              >
                {/* Accordion Question Header Bar */}
                <button 
                  type="button" 
                  className="faq-pill-header" 
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-title">{item.question}</span>
                  <div className="faq-chevron">
                    {isOpen ? <FiChevronUp size={22} /> : <FiChevronDown size={22} />}
                  </div>
                </button>

                {/* Accordion Answer Body */}
                {isOpen && (
                  <div className="faq-answer-container">
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FAQ
