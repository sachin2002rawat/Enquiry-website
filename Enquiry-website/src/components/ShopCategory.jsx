import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { FaFilePdf } from 'react-icons/fa'
import { Store } from 'lucide-react'

import productsData from '../ProductsData.json'

const ShopCategory = ({ data, isBeauty = false, cardsToShow }) => {
  const displayCount = cardsToShow || (isBeauty ? 4 : 3)
  const navigate = useNavigate()
  const activeDataset = data && data.length > 0 ? data : productsData
  // Store the list of categories/products in state so we can rotate/reorder it
  const [categories, setCategories] = useState(activeDataset)

  React.useEffect(() => {
    if (data && data.length > 0) {
      setCategories(data)
    }
  }, [data])

  const handleViewAll = () => {
    navigate('/product')
  }

  const handleCategoryClick = (category) => {
    if (category) {
      const targetSlug = category.slug || category.id
      navigate(`/category/${targetSlug}`)
    } else {
      navigate('/product')
    }
  }

  // Move carousel to the right (take first card, move to the end)
  const handleNext = () => {
    setCategories((prev) => {
      const copy = [...prev]
      const first = copy.shift() // Remove the first card
      copy.push(first)           // Add it to the end
      return copy
    })
  }

  // Move carousel to the left (take last card, move to the beginning)
  const handlePrev = () => {
    setCategories((prev) => {
      const copy = [...prev]
      const last = copy.pop()    // Remove the last card
      copy.unshift(last)         // Add it to the beginning
      return copy
    })
  }

  // Touch Swipe Gesture Handlers for Mobile Responsive Category Carousel
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isCardAnimating, setIsCardAnimating] = useState(false)
  const minSwipeDistance = 40

  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNextWithAnim()
    } else if (isRightSwipe) {
      handlePrevWithAnim()
    }
  }

  const handleNextWithAnim = () => {
    if (isCardAnimating) return
    setIsCardAnimating(true)
    handleNext()
    setTimeout(() => setIsCardAnimating(false), 400)
  }

  const handlePrevWithAnim = () => {
    if (isCardAnimating) return
    setIsCardAnimating(true)
    handlePrev()
    setTimeout(() => setIsCardAnimating(false), 400)
  }

  return (
    <section className="shop-category-section">
      {/* 1. Header Section (Titles and View All Button) */}
      <div className="shop-category-header">
        
        {/* Left Side: Icon & Titles */}
        <div className="shop-category-header-left">
          <div className="shop-category-icon-wrapper">
            <Store size={30} className="shop-category-icon" />
          </div>
          <div className="shop-category-titles">
            <span className="shop-category-subtitle">Browse By</span>
            <h2 className="shop-category-title">Our Categories</h2>
          </div>
        </div>
         
        {/* Right Side: View All Button */}
        <button 
          className="view-all-btn"  
          onClick={handleViewAll}   
        >
          View All
        </button>
      </div>

      {/* 2. Carousel Container (with Left & Right Overlay Arrows) */}
      <div className="shop-category-carousel-wrapper">
        {/* Left Arrow Button */}
        <button 
          className="carousel-arrow-btn prev" 
          onClick={handlePrevWithAnim} 
          aria-label="Previous categories"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Category Cards Section with Touch Swipe Gestures */}
        <div 
          className={`shop-category-list cards-${displayCount} ${isCardAnimating ? 'category-page-transition' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {categories.slice(0, displayCount).map((category, idx) => {
            const displayName = category.name || category.title || 'Product';
            return (
              <div          
                key={`${category.id}-${idx}`} 
                className={`category-card ${isBeauty ? 'beauty-animated-card' : ''}`}  
                style={{ animationDelay: `${idx * 0.1}s, ${idx * 0.4 + 0.6}s` }}
                onClick={() => handleCategoryClick(category)}
              >
                {/* Container for the category image */}
                <div className="category-card-img-container">
                  <img 
                    src={category.image} 
                    alt={displayName} 
                    className="category-card-img" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/premium_spices.png';
                    }}
                  />
                  <div className="category-card-pdf-badge" title="Catalog PDF Available">
                    <FaFilePdf size={16} color="#e11d48" />
                  </div>
                </div>

                {/* Category/Product Name below image */}
                <h3 className="category-card-title">
                  {displayName}
                </h3>
              </div>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        <button 
          className="carousel-arrow-btn next" 
          onClick={handleNextWithAnim} 
          aria-label="Next categories"
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </section>
  )
}

export default ShopCategory
