import React, { useState } from 'react'
import {
  FiGrid,
  FiHome,
  FiPackage,
  FiBriefcase,
  FiLayout,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiTag,
  FiList
} from 'react-icons/fi'
import { FaCommentDots } from 'react-icons/fa'

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  const isProductTabGroup = ['product', 'category', 'enquiry'].includes(activeTab)
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(true)

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: FiGrid },
    { id: 'homepage', label: 'Homepage Settings', icon: FiHome },
    { id: 'footer', label: 'Footer Settings', icon: FiLayout },
    { id: 'company', label: 'Company Settings', icon: FiBriefcase }
  ]

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Mid Floating Large Collapse Arrow Toggle */}
      <button
        type="button"
        className="sidebar-collapse-btn-mid"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        aria-label="Toggle Sidebar Collapse"
      >
        {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
      </button>

      {/* Sidebar Top Brand Header with QuickEnquiry Logo */}
      <div className="admin-sidebar-brand">
        <div className="quick-enquiry-logo-icon">
          <FaCommentDots size={22} />
        </div>

        {!isCollapsed && (
          <div className="brand-title quick-enquiry-title">
            Quick<span>Enquiry</span>
          </div>
        )}

        {/* Mobile Close Button */}
        {isOpen && (
          <button
            className="btn-icon mobile-sidebar-toggle"
            onClick={() => setIsOpen(false)}
            style={{ marginLeft: 'auto', display: 'flex' }}
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="admin-sidebar-nav">
        {!isCollapsed ? (
          <div className="nav-section-label">Main Menu</div>
        ) : (
          <div className="nav-section-divider"></div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
              onClick={() => {
                setActiveTab(item.id)
                if (window.innerWidth <= 1024) setIsOpen(false)
              }}
            >
              <Icon size={20} className="nav-item-icon" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          )
        })}

        {/* Product Management Group with Dropdown */}
        <div className="admin-nav-group" style={{ width: '100%' }}>
          <button
            type="button"
            className={`admin-nav-item ${isProductTabGroup ? 'active' : ''}`}
            title={isCollapsed ? 'Product Management' : ''}
            onClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false)
                setIsProductMenuOpen(true)
              } else {
                setIsProductMenuOpen(!isProductMenuOpen)
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <FiPackage size={20} className="nav-item-icon" />
              {!isCollapsed && <span>Product Management</span>}
            </div>

            {!isCollapsed && (
              <span style={{ display: 'flex', alignItems: 'center', opacity: 0.85, marginLeft: 'auto' }}>
                {isProductMenuOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </span>
            )}
          </button>

          {/* Dropdown submenu showing All Products, Category, and Enquiry */}
          {!isCollapsed && isProductMenuOpen && (
            <div
              className="admin-nav-submenu"
              style={{
                marginLeft: '18px',
                paddingLeft: '10px',
                borderLeft: '2px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginTop: '6px',
                marginBottom: '6px'
              }}
            >
              {/* 1. All Products */}
              <button
                type="button"
                className={`admin-nav-subitem ${activeTab === 'product' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('product')
                  if (window.innerWidth <= 1024) setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: activeTab === 'product' ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  backgroundColor: activeTab === 'product' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  color: activeTab === 'product' ? '#818CF8' : '#94A3B8',
                  transition: 'all 0.15s ease'
                }}
              >
                <FiList size={16} />
                <span>All Products</span>
              </button>

              {/* 2. Category */}
              <button
                type="button"
                className={`admin-nav-subitem ${activeTab === 'category' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('category')
                  if (window.innerWidth <= 1024) setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: activeTab === 'category' ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  backgroundColor: activeTab === 'category' ? 'rgba(13, 148, 136, 0.25)' : 'transparent',
                  color: activeTab === 'category' ? '#2DD4BF' : '#94A3B8',
                  transition: 'all 0.15s ease'
                }}
              >
                <FiTag size={16} />
                <span>Category</span>
              </button>

              {/* 3. Enquiry */}
              <button
                type="button"
                className={`admin-nav-subitem ${activeTab === 'enquiry' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('enquiry')
                  if (window.innerWidth <= 1024) setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: activeTab === 'enquiry' ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  backgroundColor: activeTab === 'enquiry' ? 'rgba(234, 88, 12, 0.25)' : 'transparent',
                  color: activeTab === 'enquiry' ? '#FB923C' : '#94A3B8',
                  transition: 'all 0.15s ease'
                }}
              >
                <FaCommentDots size={16} />
                <span>Enquiry</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar User Footer */}
      <div className="admin-sidebar-footer">
        <div className="sidebar-user-card">
          <div className="user-avatar">A</div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Super Administrator</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default React.memo(AdminSidebar)
