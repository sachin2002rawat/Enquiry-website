import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

/**
 * WhatsAppButton Component
 * Floating WhatsApp quick contact button in the bottom-right corner.
 */
const WhatsAppButton = ({ phoneNumber = '919876543210' }) => {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello! I would like to make an enquiry.')}`
    window.open(url, '_blank')
  }

  return (
    <button
      type="button"
      className="floating-whatsapp-btn"
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="floating-whatsapp-icon" />
    </button>
  )
}

export default WhatsAppButton
