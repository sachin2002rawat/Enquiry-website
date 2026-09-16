import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import './WhatsAppButton.css'

/**
 * WhatsAppButton Component
 * Floating WhatsApp quick contact button fixed on all pages.
 */
const WhatsAppButton = ({ phoneNumber = '919999999999' }) => {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello! I would like to make an enquiry.')}`
    window.open(url, '_blank')
  }

  return (
    <div className="global-whatsapp-fixed-wrapper">
      <span className="whatsapp-tooltip-text">Chat with Us</span>
      <button
        type="button"
        className="floating-whatsapp-btn"
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-pulse-ring"></span>
        <FaWhatsapp className="floating-whatsapp-icon" />
      </button>
    </div>
  )
}

export default React.memo(WhatsAppButton)
