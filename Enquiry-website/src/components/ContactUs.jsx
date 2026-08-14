import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowRight, FiMic, FiPaperclip } from 'react-icons/fi'

const ContactUs = () => {
  const handleCallUs = () => {
    window.location.href = 'tel:+1234567890'
  }

  const handleWhatsApp = () => {
    window.open('https://wa.me/1234567890', '_blank')
  }

  return (
    <section className="contact-us-section">
      <div className="contact-us-container">
        
        {/* 1. Left Section: Title, Subtitle, and Call Button */}
        <div className="contact-left">
          <h2 className="contact-title">
            Contact <span className="contact-title-us">Us</span>
          </h2>
          <p className="contact-subtitle">
            We'd love to hear from you — questions, orders, or just a chat about spices
          </p>
          <button type="button" className="contact-call-btn" onClick={handleCallUs}>
            Call Us Now <FiArrowRight size={18} className="btn-arrow" />
          </button>
        </div>

        {/* 2. Middle Section: Person looking at phone with connecting glow */}
        <div className="contact-center-wrapper">
          <div className="contact-person-img-container">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
              alt="Customer support team member" 
              className="contact-person-img"
            />
          </div>
          {/* Signal connecting wave SVG */}
          <svg className="contact-signal-wave" viewBox="0 0 100 40" fill="none">
            <path 
              d="M 0 30 Q 50 0 100 20" 
              stroke="#34d399" 
              strokeWidth="2.5" 
              strokeDasharray="4 4" 
              opacity="0.85" 
            />
          </svg>
        </div>

        {/* 3. Right Section: WhatsApp Green Banner Card */}
        <div className="contact-whatsapp-card">
          <div className="whatsapp-card-inner">
            
            {/* Left Content Area of the Card */}
            <div className="whatsapp-card-content">
              
              {/* Header: Glowing WhatsApp Icon & Online Badge */}
              <div className="whatsapp-status-header">
                <div className="whatsapp-icon-glow">
                  <FaWhatsapp size={22} color="#ffffff" />
                </div>
                <span className="whatsapp-online-badge">
                  <span className="online-pulse-dot"></span>
                  Online
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="whatsapp-card-title">Chat on WhatsApp</h3>
              <p className="whatsapp-card-desc">
                Send us a message anytime. We typically reply within minutes for fast, friendly support.
              </p>

              {/* Action Button */}
              <button 
                type="button" 
                className="whatsapp-card-btn" 
                onClick={handleWhatsApp}
              >
                WhatsApp Us <FiArrowRight size={16} className="btn-arrow" />
              </button>
            </div>

            {/* Right Media Area: Person holding phone with floating Chat Bubble */}
            <div className="whatsapp-card-media">
              <div className="whatsapp-media-img-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" 
                  alt="WhatsApp Chat Support Representative" 
                  className="whatsapp-media-img"
                />
              </div>

              {/* Floating Chat Bubble Overlay */}
              <div className="whatsapp-chat-bubble">
                <p className="chat-bubble-text">
                  Hello, at WhatsApp anytime. We typically reply with minutes for fast...
                </p>
                <div className="chat-bubble-input-bar">
                  <span className="chat-placeholder">Type a message...</span>
                  <div className="chat-bar-icons">
                    <FiMic size={14} className="chat-bar-icon" />
                    <FiPaperclip size={14} className="chat-bar-icon" />
                    <div className="chat-send-btn">
                      <FaWhatsapp size={13} color="#ffffff" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default ContactUs
