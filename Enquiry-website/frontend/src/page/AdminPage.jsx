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
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
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
