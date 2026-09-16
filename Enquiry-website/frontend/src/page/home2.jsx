import React, { Suspense, lazy, useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CompanySection from '../components/CompanySection'
import ShopCategory from '../components/ShopCategory'
import ScrollReveal from '../components/ScrollReveal'
import beautyProductsData from '../BeautyProductsData.json'
import beautyHeroImages from '../BeautyHeroImage.json'
import beautyReviews from '../BeautyReview.json'
import beautyArticles from '../BeautyLatestArticle.json'
import beautyFeatures from '../BeautyWhyChoose.json'

// Lazy load below-the-fold components for performance
const WideRangeProducts = lazy(() => import('../components/WideRangeProducts'))
const PopularProduct = lazy(() => import('../components/Product/PopularProduct'))
const ContactUs = lazy(() => import('../components/ContactUs'))
const AboutCompany = lazy(() => import('../components/AboutCompany'))
const Review = lazy(() => import('../components/Review'))
const FAQ = lazy(() => import('../components/FAQ'))
const VideoReviewScroller = lazy(() => import('../components/VideoReviewScroller'))
const LatestArticle = lazy(() => import('../components/LatestArticle'))
const Feature = lazy(() => import('../components/Feature'))
const Footer = lazy(() => import('../components/Footer'))

const LOCAL_KEY_VISIBILITY = 'enquiry_admin_section_visibility'

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

const Home2 = () => {
  // Read section visibility settings from LocalStorage
  const [visibility, setVisibility] = useState(() => {
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

  useEffect(() => {
    const handleSync = () => {
      try {
        const savedVis = localStorage.getItem(LOCAL_KEY_VISIBILITY)
        if (savedVis) setVisibility(JSON.parse(savedVis))
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('storage', handleSync)
    const interval = setInterval(handleSync, 800)

    return () => {
      window.removeEventListener('storage', handleSync)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="header-wrapper">
      <Topbar />
      <Navbar />
      {visibility.heroSlider !== false && <Hero data={beautyHeroImages} />}
      <ScrollReveal variant="up"><CompanySection isBeauty={true} /></ScrollReveal>
      {visibility.featuredProducts !== false && (
        <ScrollReveal variant="up"><WideRangeProducts data={beautyProductsData} isBeauty={true} /></ScrollReveal>
      )}
      <ScrollReveal variant="up"><ShopCategory data={beautyProductsData} isBeauty={true} /></ScrollReveal>
      
      <Suspense fallback={<SectionLoader />}>
        {visibility.featuredProducts !== false && (
          <ScrollReveal variant="up"><PopularProduct data={beautyProductsData} isBeauty={true} /></ScrollReveal>
        )}
        {visibility.whyChoose !== false && (
          <ScrollReveal variant="up"><AboutCompany isBeauty={true} /></ScrollReveal>
        )}
        {visibility.reviews !== false && (
          <ScrollReveal variant="up"><Review data={beautyReviews} isBeauty={true} /></ScrollReveal>
        )}
        {visibility.faq !== false && (
          <ScrollReveal variant="up"><FAQ isBeauty={true} /></ScrollReveal>
        )}
        {visibility.reviews !== false && (
          <ScrollReveal variant="up"><VideoReviewScroller /></ScrollReveal>
        )}
        {visibility.blogs !== false && (
          <ScrollReveal variant="up"><LatestArticle data={beautyArticles} isBeauty={true} /></ScrollReveal>
        )}
        {visibility.whyChoose !== false && (
          <ScrollReveal variant="up"><Feature data={beautyFeatures} isBeauty={true} /></ScrollReveal>
        )}
        <Footer />
      </Suspense>
    </div>
  )
}

export default Home2
