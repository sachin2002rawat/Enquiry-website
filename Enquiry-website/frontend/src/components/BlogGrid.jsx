import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import productsData from '../ProductsData.json'
import beautyArticles from '../BeautyLatestArticle.json'
import './BlogGrid.css'

const categories = ['All', 'SKINCARE ROUTINE', 'HYDRATION TIPS', 'HAIR CARE ELIXIR', 'SPA TREATMENTS', 'COSMETICS', 'ESSENTIAL OILS', 'PURE SPICES', 'WHOLE SPICES', 'SOYA CHUNKS', 'PULSES', 'RICE']

const ITEMS_PER_PAGE = 9 // Exactly 3 rows of 3 articles each

const BlogGrid = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const allArticles = useMemo(() => [...beautyArticles, ...productsData], [])

  // 1. Filter articles based on Category tab and Search Query
  const filteredArticles = useMemo(() => {
    return allArticles.filter((item) => {
      const matchesSearch = 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())

      if (activeTab === 'All') return matchesSearch
      return matchesSearch && (item.category || '').toUpperCase() === activeTab.toUpperCase()
    })
  }, [allArticles, activeTab, searchQuery])

  // 2. Calculate pagination slices (9 items per page: 3 rows of 3)
  const totalArticles = filteredArticles.length
  const totalPages = Math.max(1, Math.ceil(totalArticles / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const currentArticles = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredArticles, safeCurrentPage])

  const handleTabChange = (cat) => {
    setActiveTab(cat)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      const section = document.querySelector('.blog-grid-section')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <section className="blog-grid-section">
      {/* Filter Tabs & Search Bar */}
      <div className="blog-grid-toolbar">
        <div className="blog-filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`blog-filter-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => handleTabChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="blog-search-box">
          <input
            type="text"
            className="blog-search-input"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FiSearch size={18} className="blog-search-icon" />
        </div>
      </div>

      {/* Blog Cards Grid (3 Columns x 3 Rows = 9 Cards) */}
      <div className="blog-articles-grid">
        {currentArticles.map((item) => (
          <div 
            key={item.id} 
            className="blog-card"
            onClick={() => navigate(`/blog/${item.id}`)}
          >
            <div className="blog-card-img-wrapper">
              <span className="blog-card-date-ribbon">{item.category || 'ARTICLE'}</span>
              <img
                src={item.image}
                alt={item.name}
                className="blog-card-img"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/premium_spices.png'
                }}
              />
            </div>

            <div className="blog-card-body">
              <h3 className="blog-card-title">{item.name}</h3>
              <p className="blog-card-desc">{item.description}</p>
              
              <div className="blog-card-footer">
                <span className="blog-read-link">
                  Read Article <FiArrowRight size={14} />
                </span>
                <span className="blog-read-time">⭐ {item.rating || 4.8} ({item.reviewsCount || 120})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="blog-pagination-wrapper">
          <div className="blog-pagination-info">
            Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, totalArticles)} of {totalArticles} articles
          </div>

          <div className="blog-pagination-controls">
            <button
              type="button"
              className="blog-page-btn nav-arrow"
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              aria-label="Previous Page"
            >
              <FiChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`blog-page-btn page-num ${safeCurrentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              type="button"
              className="blog-page-btn nav-arrow"
              disabled={safeCurrentPage === totalPages}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              aria-label="Next Page"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default BlogGrid
