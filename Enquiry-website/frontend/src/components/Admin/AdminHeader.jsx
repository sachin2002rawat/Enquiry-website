import React, { useState, useRef, useEffect } from 'react'
import {
  FiMenu,
  FiPackage,
  FiSliders,
  FiGrid,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiExternalLink,
  FiShield
} from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

const AdminHeader = ({ activeTab, setIsOpen, showToast }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    if (showToast) showToast('Logged out of Admin Portal successfully!')
    setIsProfileOpen(false)
    navigate('/')
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case 'homepage':
        return {
          title: 'Homepage Settings',
          subtitle: 'Customize hero banners, topbar header colors, and section visibility.',
          icon: <FiSliders size={20} color="#4F46E5" />,
          accentColor: '#4F46E5'
        }
      case 'product':
        return {
          title: 'Product Management',
          subtitle: 'Manage catalog items, stock status, categories, and inventory details.',
          icon: <FiPackage size={20} color="#059669" />,
          accentColor: '#059669'
        }
      case 'overview':
      default:
        return {
          title: 'Dashboard Overview',
          subtitle: 'Welcome to your Enquiry website real-time control center.',
          icon: <FiGrid size={20} color="#2563EB" />,
          accentColor: '#2563EB'
        }
    }
  }

  const { title, subtitle, icon, accentColor } = getTabTitle()

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

        <div className="header-title-box">
          <div className="header-icon-glow" style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}12` }}>
            {icon}
          </div>
          <div>
            <h1 className="header-page-title">{title}</h1>
            <p className="header-subtitle">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: PROFILE & LOGOUT CONTROLS */}
      <div className="header-right-profile" ref={dropdownRef}>
        <button
          type="button"
          className="admin-profile-pill"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          title="Account Profile & Settings"
        >
          <div className="admin-avatar-box">
            <span className="avatar-initials">AD</span>
            <span className="online-indicator"></span>
          </div>
          <div className="admin-profile-info">
            <span className="admin-name">Admin User</span>
            <span className="admin-role">Super Admin</span>
          </div>
          <FiChevronDown
            size={16}
            className={`chevron-icon ${isProfileOpen ? 'rotate' : ''}`}
          />
        </button>

        {/* PROFILE DROPDOWN POPOVER MENU */}
        {isProfileOpen && (
          <div className="profile-dropdown-menu">
            <div className="dropdown-user-header">
              <div className="dropdown-avatar-large">
                <FiUser size={22} color="#6366F1" />
              </div>
              <div>
                <div className="dropdown-user-name">Store Administrator</div>
                <div className="dropdown-user-email">admin@enquirystore.com</div>
                <span className="dropdown-badge">
                  <FiShield size={12} color="#34D399" /> Authenticated Session
                </span>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <Link
              to="/"
              className="dropdown-menu-item"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsProfileOpen(false)}
            >
              <FiExternalLink size={16} color="#38BDF8" />
              <span>View Live Storefront</span>
            </Link>

            <div className="dropdown-divider"></div>

            <button type="button" className="dropdown-menu-item logout" onClick={handleLogout}>
              <FiLogOut size={16} color="#EF4444" />
              <span>Logout Account</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default React.memo(AdminHeader)
