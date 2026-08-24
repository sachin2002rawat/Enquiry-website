import React, { useState } from 'react'
import { LayoutGrid, MessageSquareMore, Menu, X } from 'lucide-react'
import { FiSearch } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useEnquiryModal } from '../context/EnquiryModalContext'

/**
 * Navbar Component (Home Page Navbar)
 * Renders full desktop bar on larger screens, and a sleek responsive hamburger menu on mobile devices.
 */
const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { openEnquiryModal } = useEnquiryModal()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Company', path: '/about-company' },
    { name: 'Enquiry', path: '#' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' }
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
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left: Categories Button (Desktop) / Category Icon Only (Mobile) */}
        <div className="nav-categories-wrapper">
          <button 
            type="button" 
            className="categories-btn desktop-only" 
            onClick={handleCategoriesClick}
          >
            <LayoutGrid size={18} className="categories-icon" />
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

        {/* Center: Nav Links (Desktop View) */}
        <ul className="nav-links-list desktop-only">
          {navLinks.map((link) => (
            <li 
              key={link.name} 
              className={`nav-link-item ${activeLink === link.name ? 'active' : ''}`}
            >
              <Link 
                to={link.path} 
                onClick={(e) => {
                  if (link.path === '#') {
                    e.preventDefault()
                  }
                  setActiveLink(link.name)
                  if (link.name === 'Enquiry') {
                    openEnquiryModal()
                  }
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Send Enquiry Button (Desktop) & Search Bar + Hamburger Toggle (Mobile Right Side) */}
        <div className="nav-right-group">
          <div className="nav-enquiry desktop-only">
            <button 
              type="button" 
              className="enquiry-btn" 
              onClick={handleEnquiryClick}
            >
              <MessageSquareMore size={18} className="enquiry-btn-icon" />
              <span>Send Enquiry</span>
            </button>
          </div>

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
                <Link 
                  to={link.path} 
                  onClick={(e) => {
                    if (link.path === '#') {
                      e.preventDefault()
                    }
                    setActiveLink(link.name)
                    if (link.name === 'Enquiry') {
                      openEnquiryModal()
                    }
                    setMobileMenuOpen(false)
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar

