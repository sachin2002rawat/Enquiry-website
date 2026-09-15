import React, { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '../components/Admin/AdminSidebar'
import AdminHeader from '../components/Admin/AdminHeader'
import DashboardOverview from '../components/Admin/DashboardOverview'
import HomepageSettings from '../components/Admin/HomepageSettings'
import ProductManagement from '../components/Admin/ProductManagement'
import defaultHeroImages from '../HeroImage.json'
import defaultProducts from '../ProductsData.json'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import './AdminPage.css'

const LOCAL_KEY_HERO = 'enquiry_admin_hero_slides'
const LOCAL_KEY_PRODUCTS = 'enquiry_admin_products'
const LOCAL_KEY_SETTINGS = 'enquiry_admin_store_settings'
const LOCAL_KEY_VISIBILITY = 'enquiry_admin_section_visibility'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [toast, setToast] = useState(null)

  // 1. Hero Slides State with LocalStorage persistence
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_HERO)
      return saved ? JSON.parse(saved) : defaultHeroImages
    } catch {
      return defaultHeroImages
    }
  })

  // 2. Products State with LocalStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_PRODUCTS)
      return saved ? JSON.parse(saved) : defaultProducts
    } catch {
      return defaultProducts
    }
  })

  // 3. General Store Settings State
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_SETTINGS)
      return saved
        ? JSON.parse(saved)
        : {
            topbarBgColor: '#E0F2FE',
            topbarTextColor: '#1E293B',
            announcementText: 'Free Shipping on orders over ₹499 | Premium Stone Ground Spices',
            whatsappNumber: '+91 9876543210',
            contactEmail: 'info@enquirybrand.com',
            tagline: '100% Organic & Stone Ground Spices'
          }
    } catch {
      return {
        topbarBgColor: '#E0F2FE',
        topbarTextColor: '#1E293B',
        announcementText: 'Free Shipping on orders over ₹499 | Premium Stone Ground Spices',
        whatsappNumber: '+91 9876543210',
        contactEmail: 'info@enquirybrand.com',
        tagline: '100% Organic & Stone Ground Spices'
      }
    }
  })

  // 4. Section Visibility Toggles State
  const [sectionVisibility, setSectionVisibility] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_VISIBILITY)
      return saved
        ? JSON.parse(saved)
        : {
            heroSlider: true,
            featuredProducts: true,
            whyChoose: true,
            reviews: true,
            faq: true,
            blogs: true
          }
    } catch {
      return {
        heroSlider: true,
        featuredProducts: true,
        whyChoose: true,
        reviews: true,
        faq: true,
        blogs: true
      }
    }
  })

  // Save updates to localStorage on change & sync CSS Root variables
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_HERO, JSON.stringify(heroSlides))
  }, [heroSlides])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_PRODUCTS, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_SETTINGS, JSON.stringify(storeSettings))
    if (storeSettings.topbarBgColor) {
      document.documentElement.style.setProperty('--bg-topbar', storeSettings.topbarBgColor)
    }
    if (storeSettings.topbarTextColor) {
      document.documentElement.style.setProperty('--topbar-text-color', storeSettings.topbarTextColor)
    }
  }, [storeSettings])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_VISIBILITY, JSON.stringify(sectionVisibility))
  }, [sectionVisibility])

  // Toast notification helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3200)
  }, [])

  // In Stock count calculation
  const inStockCount = products.filter(
    (p) => p.availability === 'In Stock' || p.availability === true
  ).length

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Dashboard Wrapper */}
      <div className={`admin-main-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <AdminHeader
          activeTab={activeTab}
          setIsOpen={setIsSidebarOpen}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />

        <main className="admin-content">
          {activeTab === 'overview' && (
            <DashboardOverview
              setActiveTab={setActiveTab}
              heroSlides={heroSlides}
              products={products}
            />
          )}

          {activeTab === 'homepage' && (
            <HomepageSettings
              heroSlides={heroSlides}
              setHeroSlides={setHeroSlides}
              storeSettings={storeSettings}
              setStoreSettings={setStoreSettings}
              sectionVisibility={sectionVisibility}
              setSectionVisibility={setSectionVisibility}
              showToast={showToast}
            />
          )}

          {activeTab === 'product' && (
            <ProductManagement
              products={products}
              setProducts={setProducts}
              showToast={showToast}
              globalSearch={searchFilter}
            />
          )}
        </main>
      </div>

      {/* Toast Notification Banner */}
      {toast && (
        <div
          className="admin-toast"
          style={{
            background:
              toast.type === 'warning'
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : 'linear-gradient(135deg, #10b981, #059669)'
          }}
        >
          {toast.type === 'warning' ? (
            <FiAlertCircle size={20} />
          ) : (
            <FiCheckCircle size={20} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default React.memo(AdminPage)
