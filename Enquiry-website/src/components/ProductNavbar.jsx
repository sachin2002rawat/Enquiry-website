import React, { useState } from 'react'
import { LayoutGrid, MessageSquareMore, User, Menu, X } from 'lucide-react'
import { FaCommentDots } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useEnquiryModal } from '../context/EnquiryModalContext'

const ProductNavbar = () => {
  const [activeNav, setActiveNav] = useState('Home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { openEnquiryModal } = useEnquiryModal()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Company', path: '/about-company' },
    { name: 'Enquiry', path: '#' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ]

  const handleCategoriesClick = () => {
    alert('Categories dropdown clicked')
  }

  const handleEnquiryClick = () => {
    openEnquiryModal()
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('/product')
    }
  }

  return (
    <header className="product-navbar-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="product-navbar-bar">
        
        {/* Left: Home Navbar Logo (QuickEnquiry) - Desktop Only */}
        <div className="product-nav-logo desktop-only">
          <Link to="/" className="logo-link">
            <div className="logo-graphics">
              <FaCommentDots className="logo-icon" />
            </div>
            <span className="logo-text">QuickEnquiry</span>
          </Link>
        </div>

        {/* Categories Glass Pill Button (Desktop) / Category Icon Only (Mobile) */}
        <div className="product-nav-categories-wrapper">
          <button 
            type="button" 
            className="product-nav-categories-btn desktop-only"
            onClick={handleCategoriesClick}
          >
            <LayoutGrid size={18} className="categories-grid-icon" />
            <span>Categories</span>
          </button>

          {/* Mobile Left: Category Icon Only */}
          <button 
            type="button" 
            className="mobile-categories-btn mobile-only" 
            onClick={handleCategoriesClick}
            aria-label="Categories"
          >
            <LayoutGrid size={20} />
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="product-nav-menu desktop-only">
          {navItems.map((item, index) => (
            <React.Fragment key={item.name}>
              <Link
                to={item.path}
                className={`product-nav-link ${activeNav === item.name ? 'active' : ''}`}
                onClick={(e) => {
                  if (item.path === '#') e.preventDefault()
                  setActiveNav(item.name)
                  if (item.name === 'Enquiry') {
                    openEnquiryModal()
                  }
                }}
              >
                {item.name}
              </Link>
              {index < navItems.length - 1 && (
                <span className="product-nav-divider">|</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right Section: Profile Icon, Send Enquiry Button (Desktop) & Search Bar + Mobile Hamburger Toggle */}
        <div className="product-nav-actions">
          <button type="button" className="product-nav-profile-btn desktop-only" aria-label="User Profile">
            <User size={20} className="profile-icon" />
          </button>

          <button 
            type="button" 
            className="product-nav-enquiry-btn desktop-only"
            onClick={handleEnquiryClick}
          >
            <MessageSquareMore size={16} className="enquiry-icon" />
            <span>Send Enquiry</span>
          </button>

          {/* Search Bar (Mobile Right) */}
          <form className="mobile-nav-search-form mobile-only" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="mobile-nav-search-input" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="mobile-nav-search-btn" aria-label="Search">
              <FiSearch size={16} />
            </button>
          </form>

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
              <Link
                key={item.name}
                to={item.path}
                className={`product-mobile-link ${activeNav === item.name ? 'active' : ''}`}
                onClick={(e) => {
                  if (item.path === '#') e.preventDefault()
                  setActiveNav(item.name)
                  if (item.name === 'Enquiry') {
                    openEnquiryModal()
                  }
                  setMobileMenuOpen(false)
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default ProductNavbar
