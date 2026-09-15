import React, { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaCommentDots } from 'react-icons/fa'
import { MessageSquareMore } from 'lucide-react'
import { useEnquiryModal } from '../context/EnquiryModalContext'

const Topbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { openEnquiryModal } = useEnquiryModal()

  // Read saved topbar theme colors from localStorage
  const [topbarTheme, setTopbarTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('enquiry_admin_store_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          bg: parsed.topbarBgColor || null,
          text: parsed.topbarTextColor || null
        }
      }
    } catch {
      // ignore
    }
    return { bg: null, text: null }
  })

  // Listen for storage changes from Admin
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('enquiry_admin_store_settings')
        if (saved) {
          const parsed = JSON.parse(saved)
          setTopbarTheme({
            bg: parsed.topbarBgColor || null,
            text: parsed.topbarTextColor || null
          })
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
    }
  }

  return (
    <div
      className="topbar"
      style={{
        background: topbarTheme.bg || 'var(--bg-topbar)',
        color: topbarTheme.text || 'var(--topbar-text-color, #1e293b)',
        transition: 'all 0.25s ease'
      }}
    >
      <div className="topbar-content">
        {/* Left: Promo Text (Desktop Only) */}
        <div className="topbar-promo desktop-only">
          <a
            href="#"
            className="promo-link"
            style={{ color: topbarTheme.text || 'inherit' }}
            onClick={(e) => {
              e.preventDefault()
              openEnquiryModal()
            }}
          >
            *Welcome <span style={{ color: topbarTheme.text || 'inherit' }}>Enquiry Now</span> *
          </a>
        </div>

        {/* Brand Logo (Left on Mobile, Center on Desktop) */}
        <div className="topbar-logo" onClick={() => (window.location.href = '/')}>
          <div className="logo-graphics">
            <FaCommentDots className="logo-icon" />
          </div>
          <span className="logo-text" style={{ color: topbarTheme.text || 'inherit' }}>
            QuickEnquiry
          </span>
        </div>

        {/* Right: Search Box (Desktop Only) */}
        <div className="topbar-search-container desktop-only">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Search">
              <FiSearch size={16} />
            </button>
          </form>
        </div>

        {/* Right: Send Enquiry Button (Mobile Only) */}
        <button
          type="button"
          className="topbar-mobile-enquiry-btn mobile-only"
          onClick={openEnquiryModal}
        >
          <MessageSquareMore size={15} className="enquiry-icon" />
          <span>Send Enquiry</span>
        </button>
      </div>
    </div>
  )
}

export default Topbar


