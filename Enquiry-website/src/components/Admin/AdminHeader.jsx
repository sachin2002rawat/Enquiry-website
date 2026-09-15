import React from 'react'
import { FiMenu, FiSearch, FiBell, FiExternalLink } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const AdminHeader = ({ activeTab, setIsOpen, searchFilter, setSearchFilter }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'homepage':
        return {
          title: 'Homepage Settings',
          subtitle: 'Customize hero banners, general layout info, and section visibility.'
        }
      case 'product':
        return {
          title: 'Product Management',
          subtitle: 'Manage product catalogue, stock availability, categories, and items.'
        }
      case 'overview':
      default:
        return {
          title: 'Dashboard Overview',
          subtitle: 'Welcome to your Enquiry website control center.'
        }
    }
  }

  const { title, subtitle } = getTabTitle()

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          className="mobile-sidebar-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle Navigation"
        >
          <FiMenu size={20} />
        </button>

        <div>
          <h1 className="header-page-title">{title}</h1>
          <p className="header-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Header Search */}
        <div className="header-search">
          <FiSearch className="header-search-icon" size={16} />
          <input
            type="text"
            placeholder="Quick search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        {/* View Live Store */}
        <Link to="/" className="live-site-btn" target="_blank" rel="noopener noreferrer">
          <FiExternalLink size={15} />
          <span>View Site</span>
        </Link>

        {/* Notifications Icon */}
        <button className="header-action-btn" title="Notifications">
          <FiBell size={18} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  )
}

export default React.memo(AdminHeader)
