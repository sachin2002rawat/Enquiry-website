import React, { createContext, useContext, useState } from 'react'

const EnquiryModalContext = createContext()

export const EnquiryModalProvider = ({ children }) => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  const openEnquiryModal = () => setIsEnquiryOpen(true)
  const closeEnquiryModal = () => setIsEnquiryOpen(false)

  return (
    <EnquiryModalContext.Provider
      value={{
        isEnquiryOpen,
        openEnquiryModal,
        closeEnquiryModal
      }}
    >
      {children}
    </EnquiryModalContext.Provider>
  )
}

export const useEnquiryModal = () => {
  const context = useContext(EnquiryModalContext)
  if (!context) {
    // Fallback gracefully if used outside provider
    return {
      isEnquiryOpen: false,
      openEnquiryModal: () => alert('Enquiry modal clicked!'),
      closeEnquiryModal: () => {}
    }
  }
  return context
}
