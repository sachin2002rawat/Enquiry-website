import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * useScrollReveal Hook
 * Automatically attaches an IntersectionObserver to all sections and marked components 
 * across the entire application to trigger entrance animations on scroll.
 */
export const useScrollReveal = () => {
  const location = useLocation()

  useEffect(() => {
    // Select all sections and elements configured for scroll animation
    const elements = document.querySelectorAll(
      'section, .animate-on-scroll, .shop-category-section, .popular-products-section, .about-company-container, .review-section, .faq-section, .latest-article-section, .feature-section, .contact-us-section, .wide-range-section, .company-section'
    )

    if (!elements || elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    )

    elements.forEach((el) => {
      // Check if element is already in viewport on page load
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible')
      } else {
        el.classList.add('animate-on-scroll')
        observer.observe(el)
      }
    })

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [location.pathname])
}

export default useScrollReveal
