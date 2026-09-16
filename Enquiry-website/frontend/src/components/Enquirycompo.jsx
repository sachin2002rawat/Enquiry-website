import React, { useState, useEffect } from 'react'
import { Smartphone, Mail, ArrowRight, Check, X } from 'lucide-react'
import { useEnquiryModal } from '../context/EnquiryModalContext'
import './Enquirycompo.css'

const Enquirycompo = ({ isModal = false, isOpen: customIsOpen, onClose: customOnClose }) => {
  const { isEnquiryOpen, closeEnquiryModal } = useEnquiryModal()
  
  // Use passed prop or context state
  const isOpen = customIsOpen !== undefined ? customIsOpen : isEnquiryOpen
  const handleClose = customOnClose || closeEnquiryModal

  const [formData, setFormData] = useState({
    request: '',
    email: '',
    phone: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModal && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModal, isOpen, handleClose])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModal && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModal, isOpen])

  // If in modal mode and closed, do not render
  if (isModal && !isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.phone.trim()) {
      alert('Please enter your Mobile Number.')
      return
    }
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ request: '', email: '', phone: '' })
      if (isModal) {
        handleClose()
      }
    }, 2500)
  }

  const cardContent = (
    <div 
      className={`enquiry-card ${isModal ? 'is-modal-card' : ''}`} 
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Modal Close Button (X) */}
      {isModal && (
        <button
          type="button"
          className="enquiry-modal-close-btn"
          onClick={handleClose}
          aria-label="Close Enquiry Form"
        >
          <X size={18} />
        </button>
      )}

      {/* Card Header Title & Subtitle */}
      <h2 className="enquiry-title">Buying Requirement Details</h2>
      <p className="enquiry-subtitle">
        Fill up form below for enquiry and our Expert will contact you soon.
      </p>

      {isSubmitted ? (
        <div className="enquiry-success-message">
          <div className="enquiry-success-icon">
            <Check size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a' }}>
            Enquiry Submitted Successfully!
          </h3>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>
            Thank you for reaching out. Our expert will contact you shortly.
          </p>
        </div>
      ) : (
        <form className="enquiry-form" onSubmit={handleSubmit}>
          
          {/* Field 1: Mobile Number (Required, Star *) */}
          <div className="enquiry-field-group">
            <label htmlFor="phone" className="enquiry-label">
              Mobile Number *
            </label>
            <div className="enquiry-input-wrapper">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="enquiry-input"
                required
              />
              <Smartphone className="enquiry-field-icon" size={18} />
            </div>
          </div>

          {/* Field 2: Email Address (Optional, No Star) */}
          <div className="enquiry-field-group">
            <label htmlFor="email" className="enquiry-label">
              Email Address
            </label>
            <div className="enquiry-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="enquiry-input"
              />
              <Mail className="enquiry-field-icon" size={18} />
            </div>
          </div>

          {/* Field 3: Your Enquiry (Textarea) */}
          <div className="enquiry-field-group">
            <label htmlFor="request" className="enquiry-label">
              Your Enquiry
            </label>
            <div className="enquiry-input-wrapper">
              <textarea
                id="request"
                name="request"
                value={formData.request}
                onChange={handleChange}
                className="enquiry-input enquiry-textarea"
                placeholder="Write your enquiry details here..."
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="enquiry-submit-btn">
            <span>I'm Intrested</span>
            <span className="enquiry-btn-arrow">
              <ArrowRight size={18} />
            </span>
          </button>

          {/* Consent Disclaimer Copy */}
          <p className="enquiry-consent-text">
            By sending, you consent to us contacting you regarding inquiry.
          </p>

          {/* Bottom Call Tag Inside Form Flow */}
          <a href="tel:9876543210" className="enquiry-call-tag">
            Call us at directly: <span className="enquiry-call-number">9876543210</span>
          </a>
        </form>
      )}

    </div>
  )

  if (isModal) {
    return (
      <div className="enquiry-modal-backdrop" onClick={handleClose}>
        {cardContent}
      </div>
    )
  }

  return (
    <section className="enquiry-section-wrapper">
      {cardContent}
    </section>
  )
}

export default Enquirycompo
