import React from 'react'
import {
  FiGrid,
  FiHome,
  FiPackage,
  FiBriefcase,
  FiX,
  FiChevronLeft,
  FiChevronRight
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
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: FiGrid },
    { id: 'homepage', label: 'Homepage Settings', icon: FiHome },
    { id: 'company', label: 'Company Settings', icon: FiBriefcase },
    { id: 'product', label: 'Product Management', icon: FiPackage }
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
        {isCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
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
