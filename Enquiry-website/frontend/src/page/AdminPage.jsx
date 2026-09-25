import React, { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '../components/Admin/AdminSidebar'
import AdminHeader from '../components/Admin/AdminHeader'
import DashboardOverview from '../components/Admin/DashboardOverview'
import HomepageSettings from '../components/Admin/HomepageSettings'
import FooterSettings from '../components/Admin/FooterSettings'
import CompanySettings from '../components/Admin/CompanySettings'
import ProductManagement from '../components/Admin/ProductManagement'
import CategoryManagement from '../components/Admin/CategoryManagement'
import EnquiryManagement from '../components/Admin/EnquiryManagement'
import defaultHeroImages from '../HeroImage.json'
import defaultProducts from '../ProductsData.json'
import defaultFaqs from '../Faq.json'
import defaultWhyChoose from '../WhyChoose.json'
import defaultReviews from '../Review.json'
import { apiService } from '../api/apiService'
import {
  FiCheckCircle,
  FiAlertCircle,
  FiSettings,
  FiSave,
  FiRotateCcw,
  FiBell,
  FiShield,
  FiDatabase,
  FiDollarSign,
  FiGlobe,
  FiRefreshCw,
  FiDownload,
  FiCheck
} from 'react-icons/fi'
import './AdminPage.css'

const LOCAL_KEY_HERO = 'enquiry_admin_hero_slides'
const LOCAL_KEY_PRODUCTS = 'enquiry_admin_products'
const LOCAL_KEY_SETTINGS = 'enquiry_admin_store_settings'
const LOCAL_KEY_VISIBILITY = 'enquiry_admin_section_visibility'
const LOCAL_KEY_FAQS = 'enquiry_admin_faqs'
const LOCAL_KEY_WHY_CHOOSE = 'enquiry_admin_why_choose'
const LOCAL_KEY_REVIEWS = 'enquiry_admin_reviews'
const LOCAL_KEY_TRUSTED_BY = 'enquiry_admin_trusted_partners'
const LOCAL_KEY_POPULAR_PRODUCTS = 'enquiry_admin_popular_products'

const defaultPopularProducts = [
  {
    id: 13,
    slug: 'chaat-masala',
    name: 'Chaat Masala',
    category: 'MIX MASALA',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 14,
    slug: 'kitchen-king-masala',
    name: 'Kitchen King Masala',
    category: 'MIX MASALA',
    image: '/garam_masala.png',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 15,
    slug: 'pav-bhaji-masala',
    name: 'Pav Bhaji Masala',
    category: 'MIX MASALA',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 16,
    slug: 'biryani-masala',
    name: 'Biryani Masala',
    category: 'MIX MASALA',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  },
  {
    id: 1,
    slug: 'garam-masala',
    name: 'Garam Masala',
    category: 'PURE SPICES',
    image: '/garam_masala.png',
    pdfUrl: '',
    whatsappNumber: '+919876543210'
  }
]

const defaultTrustedByPartners = [
  'Reliance Retail',
  'Big Basket',
  'D-Mart',
  'Amazon Fresh',
  'Flipkart',
  'Jiomart',
  'Blinkit',
  'Zepto',
  'Swiggy Instamart'
]

// Embedded System Settings view (no extra external page file needed)
const SystemSettingsView = ({ storeSettings, setStoreSettings, showToast }) => {
  const [settingsForm, setSettingsForm] = useState(() => {
    try {
      const saved = localStorage.getItem('enquiry_admin_system_settings')
      return saved
        ? JSON.parse(saved)
        : {
            storeName: storeSettings?.storeName || 'QuickEnquiry',
            currency: storeSettings?.currency || 'INR (₹)',
            supportEmail: storeSettings?.supportEmail || 'support@quick-enquiry.co',
            supportPhone: storeSettings?.supportPhone || '+91 9876543210',
            timezone: 'Asia/Kolkata (IST)',
            emailAlerts: true,
            whatsappAlerts: true,
            soundAlerts: false,
            itemsPerPage: '10',
            showOutOfStock: true,
            allowQuoteRequests: true
          }
    } catch {
      return {
        storeName: 'QuickEnquiry',
        currency: 'INR (₹)',
        supportEmail: 'support@quick-enquiry.co',
        supportPhone: '+91 9876543210',
        timezone: 'Asia/Kolkata (IST)',
        emailAlerts: true,
        whatsappAlerts: true,
        soundAlerts: false,
        itemsPerPage: '10',
        showOutOfStock: true,
        allowQuoteRequests: true
      }
    }
  })

  const handleSettingChange = (field, value) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    localStorage.setItem('enquiry_admin_system_settings', JSON.stringify(settingsForm))
    const updatedStore = {
      ...storeSettings,
      storeName: settingsForm.storeName,
      currency: settingsForm.currency,
      supportEmail: settingsForm.supportEmail,
      supportPhone: settingsForm.supportPhone
    }
    setStoreSettings(updatedStore)
    localStorage.setItem(LOCAL_KEY_SETTINGS, JSON.stringify(updatedStore))
    apiService.updateSettings(updatedStore)
    window.dispatchEvent(new Event('storage'))
    showToast('System settings saved & synchronized successfully!')
  }

  const handleExportBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        systemSettings: settingsForm,
        storeSettings: JSON.parse(localStorage.getItem(LOCAL_KEY_SETTINGS) || '{}'),
        products: JSON.parse(localStorage.getItem(LOCAL_KEY_PRODUCTS) || '[]'),
        heroSlides: JSON.parse(localStorage.getItem(LOCAL_KEY_HERO) || '[]'),
        enquiries: JSON.parse(localStorage.getItem('enquiry_admin_customer_enquiries') || '[]')
      }
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quickenquiry_system_backup_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast('System configuration backup downloaded!')
    } catch {
      showToast('Export failed', 'warning')
    }
  }

  const handleClearCache = () => {
    window.dispatchEvent(new Event('storage'))
    showToast('Browser cache refreshed and synchronized!')
  }

  return (
    <div className="admin-homepage-settings" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Card */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ marginBottom: 0, borderBottom: 'none', flexWrap: 'wrap', gap: '16px' }}>
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
              <FiSettings size={22} />
            </div>
            <div>
              <div className="card-title-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 className="card-title">System & Platform Settings</h2>
                <span className="live-count-badge" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                  Live System Config
                </span>
              </div>
              <p className="card-subtitle" style={{ margin: '4px 0 0 0' }}>
                Manage store configurations, currency, automated enquiry notifications, catalog preferences, and backup tools.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClearCache}
              style={{ fontSize: '0.84rem', padding: '9px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FiRefreshCw size={15} /> Sync Cache
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5', fontSize: '0.84rem', padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <FiSave size={16} /> Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeft: '4px solid #4F46E5' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
            <FiDollarSign size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Active Currency</span>
            <span className="kpi-value">{settingsForm.currency.split(' ')[0]}</span>
            <span className="kpi-meta" style={{ color: '#4F46E5' }}>Default store denomination</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #059669' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
            <FiBell size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Lead Alerts</span>
            <span className="kpi-value">{settingsForm.emailAlerts && settingsForm.whatsappAlerts ? 'Full Active' : 'Partial'}</span>
            <span className="kpi-meta" style={{ color: '#059669' }}>Email & WhatsApp ready</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <FiGlobe size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Timezone & Locale</span>
            <span className="kpi-value" style={{ fontSize: '1.05rem' }}>Asia/Kolkata</span>
            <span className="kpi-meta" style={{ color: '#D97706' }}>IST (UTC+05:30)</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>
            <FiShield size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Data State</span>
            <span className="kpi-value">Connected</span>
            <span className="kpi-meta" style={{ color: '#0284C7' }}>MongoDB Synced</span>
          </div>
        </div>
      </div>

      {/* 3. General Store & Regional Settings */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
              <FiGlobe size={20} />
            </div>
            <div>
              <h2 className="card-title">General Platform & Regional Formats</h2>
              <p className="card-subtitle">Default branding and display parameters used across storefront.</p>
            </div>
          </div>
        </div>

        <div className="form-grid" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Store / Platform Name</label>
            <input
              type="text"
              className="form-input"
              value={settingsForm.storeName}
              onChange={(e) => handleSettingChange('storeName', e.target.value)}
              placeholder="QuickEnquiry"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Store Currency</label>
            <select
              className="form-input"
              value={settingsForm.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="INR (₹)">INR - Indian Rupee (₹)</option>
              <option value="USD ($)">USD - US Dollar ($)</option>
              <option value="EUR (€)">EUR - Euro (€)</option>
              <option value="GBP (£)">GBP - British Pound (£)</option>
              <option value="AED (د.إ)">AED - UAE Dirham (د.إ)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Support Notification Email</label>
            <input
              type="email"
              className="form-input"
              value={settingsForm.supportEmail}
              onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
              placeholder="support@quick-enquiry.co"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Support Phone / Helpline</label>
            <input
              type="text"
              className="form-input"
              value={settingsForm.supportPhone}
              onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
              placeholder="+91 9876543210"
            />
          </div>
        </div>
      </div>

      {/* 4. Automated Lead & Notification Preferences */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
              <FiBell size={20} />
            </div>
            <div>
              <h2 className="card-title">Enquiry & Lead Alert Channels</h2>
              <p className="card-subtitle">Choose how you want to be notified when a customer submits an enquiry or quote request.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Instant Email Notification</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Send an instant copy of every customer enquiry to the support email address.</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settingsForm.emailAlerts}
                onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>WhatsApp Lead Forwarding</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Enable quick one-click WhatsApp response link on all new enquiries.</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settingsForm.whatsappAlerts}
                onChange={(e) => handleSettingChange('whatsappAlerts', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>Allow Out-of-Stock Enquiries</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Allow buyers to enquire about products that are currently marked out of stock.</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settingsForm.showOutOfStock}
                onChange={(e) => handleSettingChange('showOutOfStock', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* 5. Backup & Data Tools */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <FiDatabase size={20} />
            </div>
            <div>
              <h2 className="card-title">Data Maintenance & Backup Tools</h2>
              <p className="card-subtitle">Export your store configuration or force a clean sync with the cloud database.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportBackup}
            style={{ fontSize: '0.85rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FiDownload size={15} /> Export Configuration Backup (JSON)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleClearCache}
            style={{ fontSize: '0.85rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FiRefreshCw size={15} /> Refresh LocalStorage Cache
          </button>
        </div>
      </div>
    </div>
  )
}

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

  // 3. FAQs State with LocalStorage persistence
  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_FAQS)
      return saved ? JSON.parse(saved) : defaultFaqs
    } catch {
      return defaultFaqs
    }
  })

  // 4. Why Choose Us Features State with LocalStorage persistence
  const [whyChooseList, setWhyChooseList] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_WHY_CHOOSE)
      return saved ? JSON.parse(saved) : defaultWhyChoose
    } catch {
      return defaultWhyChoose
    }
  })

  // 5. Customer Reviews State with LocalStorage persistence
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_REVIEWS)
      return saved ? JSON.parse(saved) : defaultReviews
    } catch {
      return defaultReviews
    }
  })

  // 6. Trusted By Retail Partners State with LocalStorage persistence
  const [trustedByPartners, setTrustedByPartners] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_TRUSTED_BY)
      return saved ? JSON.parse(saved) : defaultTrustedByPartners
    } catch {
      return defaultTrustedByPartners
    }
  })

  // 7. Popular Products Coverflow State with LocalStorage persistence
  const [popularProducts, setPopularProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_POPULAR_PRODUCTS)
      return saved ? JSON.parse(saved) : defaultPopularProducts
    } catch {
      return defaultPopularProducts
    }
  })

  // Fetch initial data from MongoDB API if available
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const dbProducts = await apiService.getProducts()
        if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
          setProducts(dbProducts)
        }
        const dbSettings = await apiService.getSettings()
        if (dbSettings) {
          setStoreSettings((prev) => ({
            ...prev,
            ...dbSettings,
            activeHomepage: dbSettings.activeHomepage || prev.activeHomepage || 'home1'
          }))
          if (dbSettings.faqs && Array.isArray(dbSettings.faqs) && dbSettings.faqs.length > 0) {
            setFaqs(dbSettings.faqs)
          }
          if (dbSettings.whyChooseFeatures && Array.isArray(dbSettings.whyChooseFeatures) && dbSettings.whyChooseFeatures.length > 0) {
            setWhyChooseList(dbSettings.whyChooseFeatures)
          }
          if (dbSettings.reviewsList && Array.isArray(dbSettings.reviewsList) && dbSettings.reviewsList.length > 0) {
            setReviewsList(dbSettings.reviewsList)
          }
          if (dbSettings.trustedByPartners && Array.isArray(dbSettings.trustedByPartners) && dbSettings.trustedByPartners.length > 0) {
            setTrustedByPartners(dbSettings.trustedByPartners)
          }
          if (dbSettings.popularProductsList && Array.isArray(dbSettings.popularProductsList) && dbSettings.popularProductsList.length > 0) {
            setPopularProducts(dbSettings.popularProductsList)
          }
        }
      } catch (err) {
        console.warn('[AdminPage] MongoDB API sync fallback to local storage:', err.message)
      }
    }
    fetchBackendData()
  }, [])

  // 4. General Store Settings State
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_SETTINGS)
      return saved
        ? JSON.parse(saved)
        : {
            activeHomepage: 'home1',
            topbarBgColor: '#E0F2FE',
            topbarTextColor: '#1E293B',
            announcementText: 'Free Shipping on orders over ₹499 | Premium Stone Ground Spices',
            whatsappNumber: '+91 9876543210',
            contactEmail: 'info@enquirybrand.com',
            tagline: '100% Organic & Stone Ground Spices',
            logoType: 'icon',
            logoText: 'QuickEnquiry',
            logoUrl: '',
            logoIconColor: '#86d2a3',
            faqSubtitle: 'COMMON QUESTIONS',
            faqTitle: 'Frequently asked questions.',
            faqContactPrompt: "Can't find what you're looking for?",
            faqContactBtnText: 'Contact support',
            homeAboutSubtitle: '— WHO WE ARE',
            homeAboutTitle: 'About Our Company',
            homeAboutDesc1:
              'Established in 2012, we have grown from a small local business into a trusted national brand. Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for thousands of customers across the country.',
            homeAboutDesc2:
              'Every product in our catalogue is carefully selected and quality-checked to ensure it meets our high standards. We believe that great products and great service go hand in hand.',
            homeAboutImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
            homeAboutBadge1Number: '12+',
            homeAboutBadge1Label: 'YEARS ESTABLISHED',
            homeAboutBadge2Number: '35+',
            homeAboutBadge2Label: 'TEAM MEMBERS',
            homeAboutBtnText: 'About More',
            homeAboutBtnLink: '/about-company',
            whyChooseTag: '• WHY CHOOSE US •',
            whyChooseTitle: 'Why Choose Us',
            whyChooseSubtitle: 'Our Commitment to Quality, Purity & Customer Satisfaction',
            reviewTag: '— CUSTOMER LOVE',
            reviewTitle: 'What They Say About Us',
            trustedByLabel: 'TRUSTED BY',
            trustedByPartners: defaultTrustedByPartners
          }
    } catch {
      return {
        activeHomepage: 'home1',
        topbarBgColor: '#E0F2FE',
        topbarTextColor: '#1E293B',
        announcementText: 'Free Shipping on orders over ₹499 | Premium Stone Ground Spices',
        whatsappNumber: '+91 9876543210',
        contactEmail: 'info@enquirybrand.com',
        tagline: '100% Organic & Stone Ground Spices',
        logoType: 'icon',
        logoText: 'QuickEnquiry',
        logoUrl: '',
        logoIconColor: '#86d2a3',
        faqSubtitle: 'COMMON QUESTIONS',
        faqTitle: 'Frequently asked questions.',
        faqContactPrompt: "Can't find what you're looking for?",
        faqContactBtnText: 'Contact support',
        homeAboutSubtitle: '— WHO WE ARE',
        homeAboutTitle: 'About Our Company',
        homeAboutDesc1:
          'Established in 2012, we have grown from a small local business into a trusted national brand. Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for thousands of customers across the country.',
        homeAboutDesc2:
          'Every product in our catalogue is carefully selected and quality-checked to ensure it meets our high standards. We believe that great products and great service go hand in hand.',
        homeAboutImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        homeAboutBadge1Number: '12+',
        homeAboutBadge1Label: 'YEARS ESTABLISHED',
        homeAboutBadge2Number: '35+',
        homeAboutBadge2Label: 'TEAM MEMBERS',
        homeAboutBtnText: 'About More',
        homeAboutBtnLink: '/about-company',
        whyChooseTag: '• WHY CHOOSE US •',
        whyChooseTitle: 'Why Choose Us',
        whyChooseSubtitle: 'Our Commitment to Quality, Purity & Customer Satisfaction',
        reviewTag: '— CUSTOMER LOVE',
        reviewTitle: 'What They Say About Us',
        trustedByLabel: 'TRUSTED BY',
        trustedByPartners: defaultTrustedByPartners
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
            trustedBy: true,
            featuredProducts: true,
            whyChoose: true,
            reviews: true,
            faq: true,
            blogs: true
          }
    } catch {
      return {
        heroSlider: true,
        trustedBy: true,
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
    window.dispatchEvent(new Event('storage'))
  }, [products])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_SETTINGS, JSON.stringify(storeSettings))
    window.dispatchEvent(new Event('storage'))
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

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_FAQS, JSON.stringify(faqs))
    window.dispatchEvent(new Event('storage'))
  }, [faqs])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_WHY_CHOOSE, JSON.stringify(whyChooseList))
    window.dispatchEvent(new Event('storage'))
  }, [whyChooseList])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_REVIEWS, JSON.stringify(reviewsList))
    window.dispatchEvent(new Event('storage'))
  }, [reviewsList])

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_TRUSTED_BY, JSON.stringify(trustedByPartners))
    window.dispatchEvent(new Event('storage'))
  }, [trustedByPartners])

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
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

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
          showToast={showToast}
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
              faqs={faqs}
              setFaqs={setFaqs}
              whyChooseList={whyChooseList}
              setWhyChooseList={setWhyChooseList}
              reviewsList={reviewsList}
              setReviewsList={setReviewsList}
              trustedByPartners={trustedByPartners}
              setTrustedByPartners={setTrustedByPartners}
              popularProducts={popularProducts}
              setPopularProducts={setPopularProducts}
              showToast={showToast}
            />
          )}

          {activeTab === 'footer' && (
            <FooterSettings
              storeSettings={storeSettings}
              setStoreSettings={setStoreSettings}
              showToast={showToast}
            />
          )}

          {activeTab === 'company' && (
            <CompanySettings
              storeSettings={storeSettings}
              setStoreSettings={setStoreSettings}
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

          {activeTab === 'category' && (
            <CategoryManagement
              products={products}
              setProducts={setProducts}
              setActiveTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'enquiry' && (
            <EnquiryManagement
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SystemSettingsView
              storeSettings={storeSettings}
              setStoreSettings={setStoreSettings}
              showToast={showToast}
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
