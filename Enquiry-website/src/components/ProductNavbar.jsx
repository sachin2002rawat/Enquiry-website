import React, { useState } from 'react'
import { LayoutGrid, MessageSquareMore, User, Menu, X } from 'lucide-react'
import { FaCommentDots } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ProductNavbar = () => {
  const [activeNav, setActiveNav] = useState('Home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Company', path: '#' },
    { name: 'Community', path: '#' },
    { name: 'Enquiry', path: '#' },
    { name: 'Blog', path: '#' },
    { name: 'Contact Us', path: '#' },
  ]

  const handleCategoriesClick = () => {
    alert('Categories dropdown clicked')
  }

  const handleEnquiryClick = () => {
    alert('Send Enquiry form opened')
  }

  return (
    <header className="product-navbar-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="product-navbar-bar">
        
        {/* Left: Home Navbar Logo (QuickEnquiry) */}
        <div className="product-nav-logo">
          <Link to="/" className="logo-link">
            <div className="logo-graphics">
              <FaCommentDots className="logo-icon" />
            </div>
            <span className="logo-text">QuickEnquiry</span>
          </Link>
        </div>

        {/* Categories Glass Pill Button */}
        <button 
          type="button" 
          className="product-nav-categories-btn"
          onClick={handleCategoriesClick}
        >
          <LayoutGrid size={18} className="categories-grid-icon" />
          <span>Categories</span>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="product-nav-menu desktop-only">
          {navItems.map((item, index) => (
            <React.Fragment key={item.name}>
              <a
                href={item.path}
                className={`product-nav-link ${activeNav === item.name ? 'active' : ''}`}
                onClick={(e) => {
                  if (item.path === '#') e.preventDefault()
                  setActiveNav(item.name)
                }}
              >
                {item.name}
              </a>
              {index < navItems.length - 1 && (
                <span className="product-nav-divider">|</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right Section: Profile Icon, Send Enquiry Button & Mobile Hamburger Toggle */}
        <div className="product-nav-actions">
          <button type="button" className="product-nav-profile-btn" aria-label="User Profile">
            <User size={20} className="profile-icon" />
          </button>

          <button 
            type="button" 
            className="product-nav-enquiry-btn"
            onClick={handleEnquiryClick}
          >
            <MessageSquareMore size={16} className="enquiry-icon" />
            <span>Send Enquiry</span>
          </button>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            type="button"
            className="product-mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="product-mobile-drawer">
          <nav className="product-mobile-menu">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`product-mobile-link ${activeNav === item.name ? 'active' : ''}`}
                onClick={(e) => {
                  if (item.path === '#') e.preventDefault()
                  setActiveNav(item.name)
                  setMobileMenuOpen(false)
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default ProductNavbar
