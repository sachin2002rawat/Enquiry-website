import React, { useState } from 'react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { Store } from 'lucide-react'

import productsData from '../ProductsData.json'

const ShopCategory = () => {
  // Store the list of categories/products in state so we can rotate/reorder it
  const [categories, setCategories] = useState(productsData)

  // Sizing styles matching wide range products section (3 large cards layout)
  const cardStyle = {
    height: '460px',
    padding: '20px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  }

  const imgContainerStyle = {
    width: '100%',
    height: '75%',
    borderRadius: '18px',
    overflow: 'hidden',
    backgroundColor: '#FAF5EE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '18px',
  }

  const titleStyle = {
    width: '100%',
    height: '25%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: '700',
    color: '#12213d',
    margin: '0',
    padding: '12px 6px 4px 6px',
    lineHeight: '1.3',
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
            <h2 className="shop-category-title">Shop by Category</h2>
          </div>
        </div>
         
        
            
        {/* Right Side: View All Button */}
        <button 
          className="view-all-btn"  
          onClick={() => alert('View All Categories Clicked')}   
        >
          View All
        </button>
      </div>

      {/* 2. Carousel Container (with Left & Right Overlay Arrows) */}
      <div className="shop-category-carousel-wrapper">
        {/* Left Arrow Button */}
        <button 
          className="carousel-arrow-btn prev" 
          onClick={handlePrev} 
          aria-label="Previous categories"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Category Cards Section (3 Large Cards visible per slide) */}
        <div className="shop-category-list">
          {categories.slice(0, 3).map((category) => {
            const displayName = category.name || category.title || 'Product';
            return (
              <div          
                key={category.id} 
                className="category-card"  
                style={cardStyle}
                onClick={() => alert(`Clicked Category: ${displayName}`)}
              >
                {/* Container for the category image (covers 75% of card height) */}
                <div 
                  className="category-card-img-container" 
                  style={imgContainerStyle}
                >
                  <img 
                    src={category.image} 
                    alt={displayName} 
                    className="category-card-img" 
                    style={imgStyle}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/premium_spices.png';
                    }}
                  />
                </div>

                {/* Category/Product Name below image */}
                <h3 
                  className="category-card-title" 
                  style={titleStyle}
                >
                  {displayName}
                </h3>
              </div>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        <button 
          className="carousel-arrow-btn next" 
          onClick={handleNext} 
          aria-label="Next categories"
        >
          <FiArrowRight size={20} />
        </button>
      </div>
    </section>
  )
}

export default ShopCategory
