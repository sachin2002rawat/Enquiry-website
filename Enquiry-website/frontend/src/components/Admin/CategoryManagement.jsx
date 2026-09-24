import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  FiTag,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiX,
  FiCheck,
  FiArrowRight,
  FiLayers,
  FiImage
} from 'react-icons/fi'

const CategoryManagement = ({ products = [], setProducts, setActiveTab, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  })
  const [deleteCatName, setDeleteCatName] = useState(null)

  // Extract unique categories from products, with product counts and images
  const categoryStats = useMemo(() => {
    const map = new Map()

    products.forEach((p) => {
      const cat = (p.category || 'UNCATEGORIZED').trim().toUpperCase()
      if (!map.has(cat)) {
        map.set(cat, {
          name: cat,
          count: 0,
          sampleImage: p.image || '/garam_masala.png',
          description: `Premium selection of ${cat.toLowerCase()} products crafted for authentic taste and quality.`
        })
      }
      const existing = map.get(cat)
      existing.count += 1
      if (!existing.sampleImage && p.image) {
        existing.sampleImage = p.image
      }
    })

    return Array.from(map.values())
  }, [products])

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return categoryStats
    return categoryStats.filter((c) =>
      c.name.toLowerCase().includes(term) || c.description.toLowerCase().includes(term)
    )
  }, [categoryStats, searchTerm])

  // Top category with most items
  const topCategory = useMemo(() => {
    if (categoryStats.length === 0) return 'N/A'
    return [...categoryStats].sort((a, b) => b.count - a.count)[0].name
  }, [categoryStats])

  const handleOpenAddModal = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      description: '',
      image: '/garam_masala.png'
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat.name)
    setCategoryForm({
      name: cat.name,
      description: cat.description,
      image: cat.sampleImage
    })
    setIsModalOpen(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const cleanName = categoryForm.name.trim().toUpperCase()
    if (!cleanName) {
      showToast('Category name is required', 'warning')
      return
    }

    if (editingCategory) {
      // Rename category across all products
      const updatedProducts = products.map((p) =>
        (p.category || '').trim().toUpperCase() === editingCategory
          ? { ...p, category: cleanName }
          : p
      )
      setProducts(updatedProducts)
      localStorage.setItem('enquiry_admin_products', JSON.stringify(updatedProducts))
      window.dispatchEvent(new Event('storage'))
      showToast(`Category "${editingCategory}" updated to "${cleanName}"!`)
    } else {
      // Check if already exists
      const exists = categoryStats.some((c) => c.name === cleanName)
      if (exists) {
        showToast(`Category "${cleanName}" already exists!`, 'warning')
        return
      }

      // Create a starter product under this category so it immediately persists in catalog
      const newProduct = {
        id: Date.now(),
        name: `${cleanName} Special`,
        category: cleanName,
        sku: `SKU-${cleanName.slice(0, 3)}-001`,
        netWeight: '200g / Pack',
        minOrderQty: '25 Units',
        availability: 'In Stock',
        image: categoryForm.image || '/garam_masala.png',
        description: categoryForm.description || `Freshly sourced ${cleanName.toLowerCase()} product.`,
        rating: 5,
        reviewsCount: 1
      }
      const updatedProducts = [newProduct, ...products]
      setProducts(updatedProducts)
      localStorage.setItem('enquiry_admin_products', JSON.stringify(updatedProducts))
      window.dispatchEvent(new Event('storage'))
      showToast(`Category "${cleanName}" created with initial product!`)
    }

    setIsModalOpen(false)
  }

  const handleDeleteCategory = (catName) => {
    // Reassign products in this category to 'PURE SPICES' or remove category tag
    const updatedProducts = products.map((p) =>
      (p.category || '').trim().toUpperCase() === catName
        ? { ...p, category: 'PURE SPICES' }
        : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('enquiry_admin_products', JSON.stringify(updatedProducts))
    window.dispatchEvent(new Event('storage'))
    setDeleteCatName(null)
    showToast(`Category "${catName}" removed. Products reassigned to "PURE SPICES".`)
  }

  const handleViewProductsOfCategory = (catName) => {
    if (setActiveTab) {
      setActiveTab('product')
    }
  }

  return (
    <div className="category-management-container">
      {/* 1. TOP STATS BAR */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid #0D9488' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#CCFBF1', color: '#0D9488' }}>
            <FiTag size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Total Categories</span>
            <span className="kpi-value">{categoryStats.length}</span>
            <span className="kpi-meta" style={{ color: '#0D9488' }}>Active store departments</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #4F46E5' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
            <FiPackage size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Catalog Products</span>
            <span className="kpi-value">{products.length}</span>
            <span className="kpi-meta" style={{ color: '#4F46E5' }}>Items organized in categories</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <FiLayers size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Top Category</span>
            <span className="kpi-value" style={{ fontSize: '1.25rem', textTransform: 'capitalize' }}>
              {topCategory}
            </span>
            <span className="kpi-meta" style={{ color: '#D97706' }}>Highest product count</span>
          </div>
        </div>
      </div>

      {/* 2. CONTROLS HEADER */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ backgroundColor: '#CCFBF1', color: '#0D9488' }}>
              <FiTag className="card-title-icon" size={20} />
            </div>
            <div>
              <div className="card-title-row">
                <h2 className="card-title">Category Management</h2>
                <span className="live-count-badge" style={{ backgroundColor: '#CCFBF1', color: '#0D9488' }}>
                  {filteredCategories.length} Categories
                </span>
              </div>
              <p className="card-subtitle">
                Organize store products into logical categories for catalog browsing and storefront filters.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '240px' }}>
              <FiSearch
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ backgroundColor: '#0D9488', borderColor: '#0D9488', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={handleOpenAddModal}
            >
              <FiPlus size={16} /> Add New Category
            </button>
          </div>
        </div>

        {/* 3. CATEGORIES GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '18px',
            marginTop: '10px'
          }}
        >
          {filteredCategories.map((cat) => (
            <div
              key={cat.name}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid var(--admin-card-border)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <img
                    src={cat.sampleImage}
                    alt={cat.name}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC'
                    }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/garam_masala.png'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--admin-text-main)', margin: 0 }}>
                        {cat.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor: '#CCFBF1',
                          color: '#0D9488'
                        }}
                      >
                        {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.45, margin: '0 0 16px 0' }}>
                  {cat.description}
                </p>
              </div>

              {/* Actions Bottom Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #F1F5F9'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleViewProductsOfCategory(cat.name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0D9488',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  View Products <FiArrowRight size={14} />
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => handleOpenEditModal(cat)}
                    title="Edit Category"
                    style={{ color: '#0D9488' }}
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => setDeleteCatName(cat.name)}
                    title="Delete Category"
                    style={{ color: '#EF4444' }}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
            <FiTag size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--admin-text-main)' }}>No categories found</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Try adjusting your search query or add a new category.</p>
          </div>
        )}
      </div>

      {/* ADD / EDIT CATEGORY MODAL */}
      {isModalOpen &&
        createPortal(
          <div className="modal-overlay" style={{ zIndex: 10000 }}>
            <div className="modal-card" style={{ maxWidth: '480px', width: '90%' }}>
              <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-card-border)' }}>
                <h3 className="modal-title" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {editingCategory ? `Edit Category: ${editingCategory}` : 'Add New Category'}
                </h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Category Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g. EDIBLE OILS, MIX MASALA"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Brief summary of items in this department..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Representative Image URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                      placeholder="https://... or /garam_masala.png"
                    />
                  </div>
                </div>

                <div className="modal-footer" style={{ padding: '12px 20px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ backgroundColor: '#0D9488', borderColor: '#0D9488' }}>
                    <FiCheck size={16} /> {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteCatName &&
        createPortal(
          <div className="modal-overlay" style={{ zIndex: 10000 }}>
            <div className="modal-card" style={{ maxWidth: '400px' }}>
              <div className="modal-header">
                <h3 className="modal-title" style={{ color: '#EF4444' }}>Delete Category?</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setDeleteCatName(null)}
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="modal-body" style={{ padding: '16px 20px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                  Are you sure you want to delete category <strong>"{deleteCatName}"</strong>? Products currently in this category will be safely reassigned to "PURE SPICES".
                </p>
              </div>
              <div className="modal-footer" style={{ padding: '12px 20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setDeleteCatName(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}
                  onClick={() => handleDeleteCategory(deleteCatName)}
                >
                  <FiTrash2 size={16} /> Yes, Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default React.memo(CategoryManagement)
