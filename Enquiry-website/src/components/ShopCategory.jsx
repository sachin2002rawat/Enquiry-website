import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { FaFilePdf } from 'react-icons/fa'
import { Store } from 'lucide-react'

import productsData from '../ProductsData.json'

const ShopCategory = ({ data }) => {
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
          onClick={handlePrev} 
          aria-label="Previous categories"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Category Cards Section */}
        <div className="shop-category-list">
          {categories.slice(0, 3).map((category) => {
            const displayName = category.name || category.title || 'Product';
            return (
              <div          
                key={category.id} 
                className="category-card"  
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
