import React, { Suspense, lazy } from 'react'
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

const Home2 = () => {
  return (
    <div className="header-wrapper">
      <Topbar />
      <Navbar />
      <Hero data={beautyHeroImages} />
      <ScrollReveal variant="up"><CompanySection isBeauty={true} /></ScrollReveal>
      <ScrollReveal variant="up"><WideRangeProducts data={beautyProductsData} /></ScrollReveal>
      <ScrollReveal variant="up"><ShopCategory data={beautyProductsData} /></ScrollReveal>
      
      <Suspense fallback={<SectionLoader />}>
        <ScrollReveal variant="up"><PopularProduct data={beautyProductsData} /></ScrollReveal>
        {/* <ScrollReveal variant="up"><ContactUs /></ScrollReveal> */}
        <ScrollReveal variant="up"><AboutCompany isBeauty={true} /></ScrollReveal>
        <ScrollReveal variant="up"><Review data={beautyReviews} /></ScrollReveal>
        <ScrollReveal variant="up"><FAQ /></ScrollReveal>
        <ScrollReveal variant="up"><LatestArticle data={beautyArticles} /></ScrollReveal>
        <ScrollReveal variant="up"><Feature data={beautyFeatures} /></ScrollReveal>
        <Footer />
      </Suspense>
    </div>
  )
}

export default Home2
