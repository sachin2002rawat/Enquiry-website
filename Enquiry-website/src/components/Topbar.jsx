import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaCommentDots } from 'react-icons/fa'
import { useEnquiryModal } from '../context/EnquiryModalContext'

const Topbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { openEnquiryModal } = useEnquiryModal()

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
    }
  }

  return (
    <div className="topbar">
      <div className="topbar-content">
        
        {/* Left: Promo Text */}
        <div className="topbar-promo">
          <a 
            href="#" 
            className="promo-link"
            onClick={(e) => {
              e.preventDefault()
              openEnquiryModal()
            }}
          >
            *Welcome <span>Enquiry Now</span> *
          </a>
        </div>

        {/* Center: Brand Logo */}
        <div className="topbar-logo" onClick={() => window.location.href = '/'}>
          <div className="logo-graphics">
            <FaCommentDots className="logo-icon" />
          </div>
          <span className="logo-text">QuickEnquiry</span>
        </div>

        {/* Right: Search Box */}
        <div className="topbar-search-container">
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

      </div>
    </div>
  )
}

export default Topbar


