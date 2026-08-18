import React, { useState } from 'react'
import { LayoutGrid, MessageSquareMore, Menu, X } from 'lucide-react'
import { useEnquiryModal } from '../context/EnquiryModalContext'

/**
 * Navbar Component (Home Page Navbar)
 * Renders full desktop bar on larger screens, and a sleek responsive hamburger menu on mobile devices.
 */
const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openEnquiryModal } = useEnquiryModal()

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About Company', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Enquiry', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact Us', href: '#' }
  ]

  const handleCategoriesClick = () => {
    alert('Categories dropdown clicked')
  }

  const handleEnquiryClick = () => {
    openEnquiryModal()
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left: Categories Button */}
        <div className="nav-categories">
          <button 
            type="button" 
            className="categories-btn" 
            onClick={handleCategoriesClick}
          >
            <LayoutGrid size={18} className="categories-icon" />
            <span>Categories</span>
          </button>
        </div>

        {/* Center: Nav Links (Desktop View) */}
        <ul className="nav-links-list desktop-only">
          {navLinks.map((link) => (
            <li 
              key={link.name} 
              className={`nav-link-item ${activeLink === link.name ? 'active' : ''}`}
            >
              <a 
                href={link.href} 
                onClick={(e) => {
                  e.preventDefault()
                  setActiveLink(link.name)
                  if (link.name === 'Enquiry') {
                    openEnquiryModal()
                  }
                }}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Send Enquiry Button & Hamburger Toggle */}
        <div className="nav-right-group">
          <div className="nav-enquiry">
            <button 
              type="button" 
              className="enquiry-btn" 
              onClick={handleEnquiryClick}
            >
              <MessageSquareMore size={18} className="enquiry-btn-icon" />
              <span>Send Enquiry</span>
            </button>
          </div>

          {/* Hamburger Menu Toggle Button (Visible on Mobile Only) */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-links-list">
            {navLinks.map((link) => (
              <li 
                key={link.name} 
                className={`mobile-nav-link-item ${activeLink === link.name ? 'active' : ''}`}
              >
                <a 
                  href={link.href} 
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveLink(link.name)
                    setMobileMenuOpen(false)
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar

