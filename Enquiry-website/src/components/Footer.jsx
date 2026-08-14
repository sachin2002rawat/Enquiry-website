import React from 'react'
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLeaf
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FiMessageSquare, FiArrowRight, FiShield } from 'react-icons/fi'

const Footer = () => {
  const handleLearnMore = () => {
    const aboutSection = document.querySelector('.about-company-section')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      alert('Learn More clicked!')
    }
  }

  const handleWhatsApp = () => {
    window.open('https://wa.me/919876543210', '_blank')
  }

  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Row 1: Main 4 Columns Grid */}
        <div className="footer-grid">
          
          {/* Column 1: Brand Logo, Description, Learn More Button, Social Icons */}
          <div className="footer-col footer-col-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <FiMessageSquare size={22} color="#ffffff" />
              </div>
              <span className="footer-logo-text">
                Quick<span className="logo-text-highlight">Enquiry</span>
              </span>
            </div>

            <p className="footer-brand-desc">
              Dedicated to pure customer service since 2012. Our commitment is quality and innovation.
            </p>

            <button 
              type="button" 
              className="footer-learn-btn" 
              onClick={handleLearnMore}
            >
              Learn More <FiArrowRight size={15} className="btn-arrow" />
            </button>

            {/* Social Media Links */}
            <div className="footer-social-links">
              <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                <FaFacebookF size={15} />
              </a>
              <a href="#twitter" className="social-icon-btn" aria-label="X (Twitter)">
                <FaXTwitter size={15} />
              </a>
              <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                <FaInstagram size={15} />
              </a>
              <a href="#linkedin" className="social-icon-btn" aria-label="LinkedIn">
                <FaLinkedinIn size={15} />
              </a>
              <a href="#youtube" className="social-icon-btn" aria-label="YouTube">
                <FaYoutube size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: CATEGORY & Certifications */}
          <div className="footer-col">
            <h4 className="footer-col-title">CATEGORY</h4>
            <ul className="footer-links-list">
              <li><a href="#category">Edible Oils</a></li>
              <li><a href="#category">Mix Masala</a></li>
              <li><a href="#category">Soya Chunks</a></li>
              <li><a href="#category">Pure Spices</a></li>
            </ul>

            {/* Quality & Food Safety Certification Badges */}
            <div className="footer-cert-badges">
              {/* ISO Emblem badge */}
              <div className="cert-badge emblem-badge">
                <span className="emblem-text">ISO 22000</span>
              </div>
              {/* FSSAI badge */}
              <div className="cert-badge fssai-badge">
                <span className="fssai-text">fssai</span>
              </div>
              {/* Trusted Partner Shield */}
              <div className="cert-badge shield-badge">
                <FiShield size={16} className="shield-icon" />
                <div className="shield-text">
                  <span className="shield-sub">Appoint Distributors</span>
                  <span className="shield-main">TRUSTED PARTNER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: OTHER LINKS */}
          <div className="footer-col">
            <h4 className="footer-col-title">OTHER LINKS</h4>
            <ul className="footer-links-list">
              <li><a href="#links">Help & Support</a></li>
              <li><a href="#links">Blog & Articles</a></li>
              <li><a href="#links">Privacy Policy</a></li>
              <li><a href="#links">T&C's</a></li>
            </ul>
          </div>

          {/* Column 4: CONNECT WITH US */}
          <div className="footer-col footer-col-connect">
            <h4 className="footer-col-title">CONNECT WITH US</h4>
            
            {/* Top Decorative Icons */}
            <div className="connect-top-icons">
              <FaLeaf size={20} className="connect-decorative-icon" />
              <span className="organic-symbol">🐾</span>
            </div>

            {/* Contact Details */}
            <div className="connect-info-list">
              <a href="tel:+919876543210" className="connect-item">
                <FaPhoneAlt size={15} className="connect-icon" />
                <span>+91 9876543210</span>
              </a>

              <a href="mailto:info@quick-enquiry.co" className="connect-item">
                <FaEnvelope size={15} className="connect-icon" />
                <span>info@quick-enquiry.co</span>
              </a>

              <div className="connect-item">
                <FaMapMarkerAlt size={15} className="connect-icon" />
                <span>Suite 300, London, UK</span>
              </div>
            </div>

          </div>

        </div>

        {/* Row 2: Bottom Bar Copyright */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            ©2025 QuickEnquiry. London, UK. All materials are protected. Crafted with <span className="heart-icon">♡</span> by Appoint Distributors.
          </p>
        </div>

      </div>

      {/* Floating Sticky WhatsApp Quick Button */}
      <button 
        type="button" 
        className="footer-floating-whatsapp"
        onClick={handleWhatsApp}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={24} color="#ffffff" />
      </button>

    </footer>
  )
}

export default Footer
