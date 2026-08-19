import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import Product from './page/Product'
import ProductDetails from './page/ProductDetails'
import Enquirycompo from './components/Enquirycompo'
import { EnquiryModalProvider } from './context/EnquiryModalContext'
import useScrollReveal from './hooks/useScrollReveal'
import './App.css'
import Contact from './page/Contact'

const AppContent = () => {
  useScrollReveal()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enquiry" element={<Enquirycompo />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/productDetail" element={<ProductDetails />} />
         <Route path="/contact" element={<Contact/>} />
      </Routes>
      
      {/* Global Glassmorphic Enquiry Pop-up Modal */}
      <Enquirycompo isModal={true} />
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
