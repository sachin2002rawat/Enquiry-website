import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import Home2 from './page/home2'
import Product from './page/Product'
import ProductDetails from './page/ProductDetails'
import CategoryDetails from './page/CategoryDetails'
import Enquirycompo from './components/Enquirycompo'
import { EnquiryModalProvider } from './context/EnquiryModalContext'
import useScrollReveal from './hooks/useScrollReveal'
import './App.css'
import Contact from './page/Contact'
import Blog from './page/Blog'
import BlogDetail from './page/BlogDetail'
import AboutEnquiryCompany from './page/AboutEnquiryCompany'
import WhatsAppButton from './components/Product/WhatsAppButton'

const AppContent = () => {
  useScrollReveal()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/about" element={<AboutEnquiryCompany />} />
        <Route path="/about-company" element={<AboutEnquiryCompany />} />
        <Route path="/enquiry" element={<Enquirycompo />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/productDetail" element={<ProductDetails />} />
        <Route path="/category/:id" element={<CategoryDetails />} />
        <Route path="/category" element={<CategoryDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/blog-detail/:id" element={<BlogDetail />} />
      </Routes>
      
      {/* Global Glassmorphic Enquiry Pop-up Modal */}
      <Enquirycompo isModal={true} />

      {/* Global Fixed Floating WhatsApp Quick Contact Button */}
      <WhatsAppButton />
    </>
  )
}

const App = () => {
  return (
    <EnquiryModalProvider>
      <AppContent />
    </EnquiryModalProvider>
  )
}

export default React.memo(App)
