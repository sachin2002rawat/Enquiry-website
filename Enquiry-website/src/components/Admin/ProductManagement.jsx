import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  FiPackage,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiCheck,
  FiGrid,
  FiTag,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiUploadCloud,
  FiLink
} from 'react-icons/fi'

const ITEMS_PER_PAGE = 5

const ProductManagement = ({ products, setProducts, showToast, globalSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageSourceType, setImageSourceType] = useState('upload') // 'upload' | 'url'
  const [formState, setFormState] = useState({
    name: '',
    category: 'PURE SPICES',
    sku: '',
    weight: '100g',
    netWeight: '100g / Pack',
    minOrderQty: '50 Units',
    availability: 'In Stock',
    image: '',
    description: '',
    rating: 4.5,
    reviewsCount: 10
  })

  const [uploadedProductFileName, setUploadedProductFileName] = useState('')

  // Handle local image file upload conversion to DataURL
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'warning')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setFormState((prev) => ({ ...prev, image: reader.result }))
      setUploadedProductFileName(file.name)
      showToast(`Uploaded ${file.name} successfully!`)
    }
    reader.readAsDataURL(file)
  }

  // Modal State for Delete Confirmation
  const [deleteId, setDeleteId] = useState(null)

  // Sync with global header search if present
  const activeSearch = searchTerm || globalSearch

  // Reset page to 1 whenever search or category filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, globalSearch])

  // Categories list derived from products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean))
    return ['ALL', ...Array.from(cats)]
  }, [products])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !activeSearch ||
        p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(activeSearch.toLowerCase()))
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [products, activeSearch, selectedCategory])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProducts, startIndex])

  // KPIs
  const totalProducts = products.length
  const inStockCount = products.filter(
    (p) => p.availability === 'In Stock' || p.availability === true
  ).length
  const outOfStockCount = totalProducts - inStockCount
  const categoryCount = categories.length - 1

  // Open modal for new product
  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormState({
      name: '',
      category: categories[1] || 'PURE SPICES',
      sku: `SKU-PRD-${Math.floor(100 + Math.random() * 900)}`,
      weight: '100g',
      netWeight: '100g / Pack',
      minOrderQty: '50 Units',
      availability: 'In Stock',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      description: 'Premium authentic spice product crafted with natural ingredients.',
      rating: 4.8,
      reviewsCount: 15
    })
    setIsModalOpen(true)
  }

  // Open modal for editing product
  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormState({
      name: product.name || '',
      category: product.category || 'PURE SPICES',
      sku: product.sku || '',
      weight: product.weight || '100g',
      netWeight: product.netWeight || '100g / Pack',
      minOrderQty: product.minOrderQty || '50 Units',
      availability: product.availability || 'In Stock',
      image: product.image || '',
      description: product.description || '',
      rating: product.rating || 4.5,
      reviewsCount: product.reviewsCount || 10
    })
    setIsModalOpen(true)
  }

  // Quick toggle product stock status
  const handleToggleStock = (product) => {
    const isCurrentlyInStock =
      product.availability === 'In Stock' || product.availability === true
    const newStatus = isCurrentlyInStock ? 'Out of Stock' : 'In Stock'
    const updated = products.map((p) =>
      p.id === product.id ? { ...p, availability: newStatus } : p
    )
    setProducts(updated)
    showToast(`${product.name} marked as ${newStatus}`)
  }

  // Form Submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!formState.name) {
      showToast('Please enter Product Name', 'warning')
      return
    }

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...formState } : p
      )
      setProducts(updated)
      showToast('Product updated successfully!')
    } else {
      // Create new
      const newProduct = {
        id: Date.now(),
        slug: formState.name.toLowerCase().replace(/\s+/g, '-'),
        ...formState
      }
      setProducts([newProduct, ...products])
      showToast('New product added to catalogue!')
    }
    setIsModalOpen(false)
  }

  // Confirm delete handler
  const confirmDelete = () => {
    if (!deleteId) return
    const updated = products.filter((p) => p.id !== deleteId)
    setProducts(updated)
    setDeleteId(null)
    showToast('Product removed successfully!')
  }

  return (
    <div className="product-management-container">
      {/* KPI METRICS ROW */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper indigo">
            <FiPackage />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Total Products</span>
            <span className="kpi-value">{totalProducts}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper emerald">
            <FiCheckCircle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">In Stock Items</span>
            <span className="kpi-value">{inStockCount}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper amber">
            <FiAlertTriangle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Out of Stock</span>
            <span className="kpi-value">{outOfStockCount}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper blue">
            <FiLayers />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Categories</span>
            <span className="kpi-value">{categoryCount > 0 ? categoryCount : 1}</span>
          </div>
        </div>
      </div>

      {/* MAIN PRODUCTS TABLE CARD */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <div className="card-title-icon-wrapper">
              <FiGrid className="card-title-icon" size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 className="card-title">Product Inventory & Catalogue</h2>
                <span className="live-count-badge">{totalProducts} Items</span>
              </div>
              <p className="card-subtitle">
                Real-time catalog management, stock monitoring, and item control.
              </p>
            </div>
          </div>
          <button className="btn-primary" onClick={handleAddProduct}>
            <FiPlus size={16} /> Add Product
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="table-filter-bar">
          <div className="table-search">
            <FiSearch className="table-search-icon" size={16} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>Weight / Pack</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const isInStock =
                    product.availability === 'In Stock' || product.availability === true
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumb"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src =
                                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
                            }}
                          />
                          <div>
                            <div className="product-info-name">{product.name}</div>
                            <div className="product-info-sku">
                              {product.sku || `SKU-${product.id}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-tag">{product.category || 'GENERAL'}</span>
                      </td>
                      <td>{product.netWeight || product.weight || '100g'}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStock(product)}
                          className={`status-badge ${isInStock ? 'in-stock' : 'out-stock'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle availability"
                        >
                          {isInStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td>
                        {deleteId === product.id ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '6px',
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FCA5A5',
                              borderRadius: '8px',
                              padding: '4px 8px'
                            }}
                          >
                            <span style={{ fontSize: '0.78rem', color: '#991B1B', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              Delete item?
                            </span>
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#EF4444',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              onClick={confirmDelete}
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#475569',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              onClick={() => setDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: '8px'
                            }}
                          >
                            <button
                              className="btn-icon"
                              title="Edit Product"
                              onClick={() => handleEditProduct(product)}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              className="btn-icon delete"
                              title="Delete Product"
                              onClick={() => setDeleteId(product.id)}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                    <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>
                      No products found matching your search filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        {filteredProducts.length > 0 && (
          <div className="admin-pagination-bar">
            <div className="pagination-info">
              Showing <span style={{ color: 'var(--admin-text-main)', fontWeight: 600 }}>{startIndex + 1}</span> to{' '}
              <span style={{ color: 'var(--admin-text-main)', fontWeight: 600 }}>{endIndex}</span> of{' '}
              <span style={{ color: 'var(--admin-text-main)', fontWeight: 600 }}>{filteredProducts.length}</span> products
            </div>

            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                title="Previous Page"
              >
                <FiChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                title="Next Page"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen &&
        createPortal(
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                </h3>
                <button className="btn-icon" onClick={() => setIsModalOpen(false)} aria-label="Close">
                  <FiX size={18} />
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      placeholder="e.g. Pure Turmeric Powder"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formState.category}
                        onChange={(e) =>
                          setFormState({ ...formState, category: e.target.value })
                        }
                        placeholder="PURE SPICES"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SKU Code</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formState.sku}
                        onChange={(e) =>
                          setFormState({ ...formState, sku: e.target.value })
                        }
                        placeholder="SKU-GM-001"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Net Weight / Pack</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formState.netWeight}
                        onChange={(e) =>
                          setFormState({ ...formState, netWeight: e.target.value })
                        }
                        placeholder="100g / Pack"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock Availability</label>
                      <select
                        className="form-select"
                        value={formState.availability}
                        onChange={(e) =>
                          setFormState({ ...formState, availability: e.target.value })
                        }
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {/* Dual Image Input Mode */}
                  <div className="form-group">
                    <label className="form-label">Product Display Image</label>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          fontSize: '0.82rem',
                          padding: '8px 12px',
                          backgroundColor:
                            imageSourceType === 'upload' ? '#EEF2FF' : '#FAF6F0',
                          borderColor:
                            imageSourceType === 'upload' ? '#6366F1' : 'var(--admin-card-border)',
                          color: imageSourceType === 'upload' ? '#4F46E5' : 'var(--admin-text-main)',
                          fontWeight: 700
                        }}
                        onClick={() => setImageSourceType('upload')}
                      >
                        <FiUploadCloud size={16} /> Upload Image File
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          fontSize: '0.82rem',
                          padding: '8px 12px',
                          backgroundColor:
                            imageSourceType === 'url' ? '#EEF2FF' : '#FAF6F0',
                          borderColor:
                            imageSourceType === 'url' ? '#6366F1' : 'var(--admin-card-border)',
                          color: imageSourceType === 'url' ? '#4F46E5' : 'var(--admin-text-main)',
                          fontWeight: 700
                        }}
                        onClick={() => setImageSourceType('url')}
                      >
                        <FiLink size={16} /> Paste Image Link URL
                      </button>
                    </div>

                    {imageSourceType === 'upload' ? (
                      <div
                        style={{
                          border: formState.image ? '2px solid #10B981' : '2px dashed var(--admin-card-border)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          backgroundColor: formState.image ? '#ECFDF5' : '#FAF6F0',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => document.getElementById('product-file-input').click()}
                      >
                        <input
                          id="product-file-input"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleProductImageUpload}
                        />
                        {formState.image ? (
                          <>
                            <FiCheckCircle size={18} color="#10B981" />
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                              Selected: {uploadedProductFileName || 'Product Image Loaded ✓'}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', marginLeft: '6px' }}>(Click to change)</span>
                          </>
                        ) : (
                          <>
                            <FiUploadCloud size={18} color="#6366F1" />
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                              Click to select image file from device (JPG, PNG, WEBP)
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        value={formState.image}
                        onChange={(e) =>
                          setFormState({ ...formState, image: e.target.value })
                        }
                        placeholder="/garam_masala.png or https://..."
                      />
                    )}

                    {/* Compact Image Thumbnail Preview */}
                    {formState.image && (
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '6px 10px',
                          backgroundColor: '#FAF6F0',
                          border: '1px solid var(--admin-card-border)',
                          borderRadius: '8px'
                        }}
                      >
                        <img
                          src={formState.image}
                          alt="Uploaded Preview"
                          style={{
                            width: '54px',
                            height: '38px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid var(--admin-card-border)'
                          }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.style.display = 'none'
                          }}
                        />
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-main)', fontWeight: 600 }}>
                          Image Preview Ready
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={formState.description}
                      onChange={(e) =>
                        setFormState({ ...formState, description: e.target.value })
                      }
                      placeholder="Brief summary of product features..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <FiCheck size={16} /> Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

    </div>
  )
}

export default React.memo(ProductManagement)
