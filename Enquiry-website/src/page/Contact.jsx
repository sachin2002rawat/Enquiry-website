import React from 'react'
import ProductNavbar from '../components/ProductNavbar'
import ContactHero from '../components/ContactHero'
import ContactCards from '../components/ContactCards'
import BranchLocations from '../components/BranchLocations'
import LocateMapSection from '../components/LocateMapSection'
import ContactUs from '../components/ContactUs'
import Footer from '../components/Footer'

const Contact = () => {
  return (
    <div className="contact-page">
      <ProductNavbar />
      <ContactHero />
      <ContactCards />
      <BranchLocations />
       <ContactUs />
      <LocateMapSection />
     
      <Footer />
    </div>
  )
}

export default Contact
