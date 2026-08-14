import React, { Suspense, lazy } from 'react'
import Topbar from '../components/Topbar'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CompanySection from '../components/CompanySection'
import ShopCategory from '../components/ShopCategory'

// Lazy load below-the-fold components for performance
const WideRangeProducts = lazy(() => import('../components/WideRangeProducts'))
const PopularProduct = lazy(() => import('../components/Product/PopularProduct'))
const ContactUs = lazy(() => import('../components/ContactUs'))
const AboutCompany = lazy(() => import('../components/AboutCompany'))
const Review = lazy(() => import('../components/Review'))
const FAQ = lazy(() => import('../components/FAQ'))
const LatestArticle = lazy(() => import('../components/LatestArticle'))
const Feature = lazy(() => import('../components/Feature'))
const Footer = lazy(() => import('../components/Footer'))

const SectionLoader = () => (
  <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: '28px',
      height: '28px',
      border: '3px solid #e2e8f0',
      borderTopColor: '#12213d',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }} />
  </div>
)

const Home = () => {
  return (
    <div className="header-wrapper">
      <Topbar />
      <Navbar />
      <Hero />
      <CompanySection />
      <ShopCategory />
      
      <Suspense fallback={<SectionLoader />}>
        <WideRangeProducts />
        <PopularProduct />
        <ContactUs />
        <AboutCompany />
        <Review />
        <FAQ />
        <LatestArticle />
        <Feature />
        <Footer />
      </Suspense>
    </div>
  )
}

export default Home

