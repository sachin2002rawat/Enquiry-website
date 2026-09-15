import React, { useState } from 'react'
import {
  FiHome,
  FiPackage,
  FiSliders,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi'
import KpiDetailsModal from './KpiDetailsModal'

const DashboardOverview = ({
  setActiveTab,
  heroSlides = [],
  products = []
}) => {
  const [selectedKpiModal, setSelectedKpiModal] = useState(null)

  const heroSlidesCount = heroSlides.length
  const productsCount = products.length
  const inStockCount = products.filter(
    (p) => p.availability === 'In Stock' || p.availability === true
  ).length

  return (
    <div className="dashboard-overview-container">
      {/* KPI METRICS GRID - CLICKABLE WITH PAGINATED POPUP */}
      <div className="kpi-grid">
        <div
          className="kpi-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedKpiModal('hero_banners')}
          title="Click to view all Hero Banner Slides"
        >
          <div className="kpi-icon-wrapper indigo">
            <FiSliders />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Hero Banners</span>
            <span className="kpi-value">{heroSlidesCount}</span>
          </div>
        </div>

        <div
          className="kpi-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedKpiModal('total_products')}
          title="Click to view all Store Products"
        >
          <div className="kpi-icon-wrapper emerald">
            <FiPackage />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Total Products</span>
            <span className="kpi-value">{productsCount}</span>
          </div>
        </div>

        <div
          className="kpi-card"
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedKpiModal('in_stock')}
          title="Click to view all Available In-Stock Items"
        >
          <div className="kpi-icon-wrapper blue">
            <FiCheckCircle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Available In Stock</span>
            <span className="kpi-value">{inStockCount}</span>
          </div>
        </div>
      </div>

      {/* TWO PRIMARY MODULE SHORTCUT CARDS */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--admin-text-main)', marginBottom: '16px' }}>
        Quick Management Modules
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Module 1: Homepage Settings */}
        <div
          className="admin-card interactive-module-card"
          style={{ marginBottom: 0, cursor: 'pointer' }}
          onClick={() => setActiveTab('homepage')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div
              className="module-icon-box"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.45rem'
              }}
            >
              <FiHome />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-text-main)', margin: 0 }}>
                Homepage Settings
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                {heroSlidesCount} Slides Configured
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
            Control hero slider images, headline titles, header announcement text, contact details, and enable/disable page sections.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontWeight: 600, fontSize: '0.9rem' }}>
            Open Homepage Settings <FiArrowRight className="module-arrow-icon" />
          </div>
        </div>

        {/* Module 2: Product Management */}
        <div
          className="admin-card interactive-module-card"
          style={{ marginBottom: 0, cursor: 'pointer' }}
          onClick={() => setActiveTab('product')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div
              className="module-icon-box"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.45rem'
              }}
            >
              <FiPackage />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-text-main)', margin: 0 }}>
                Product Management
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                {productsCount} Active Products
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
            Add new spice products, update stock availability, modify product descriptions, SKUs, images, and categories.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600, fontSize: '0.9rem' }}>
            Open Product Management <FiArrowRight className="module-arrow-icon" />
          </div>
        </div>
      </div>

      {/* KPI DATA DETAILS POPUP MODAL WITH 5-ITEM PAGINATION */}
      <KpiDetailsModal
        isOpen={!!selectedKpiModal}
        onClose={() => setSelectedKpiModal(null)}
        modalType={selectedKpiModal}
        heroSlides={heroSlides}
        products={products}
      />
    </div>
  )
}

export default React.memo(DashboardOverview)
