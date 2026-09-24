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
  FiLink,
  FiEye,
  FiStar,
  FiArrowRight
} from 'react-icons/fi'
import { apiService } from '../../api/apiService'

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

  // Handle image file upload to Cloudinary via Multer backend API
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'warning')
      return
    }

    setIsUploadingImage(true)
    setUploadedProductFileName(file.name)
    showToast(`Uploading ${file.name} to Cloudinary...`, 'info')

    try {
      const uploadRes = await apiService.uploadImage(file)
      if (uploadRes && uploadRes.url) {
        setFormState((prev) => ({ ...prev, image: uploadRes.url }))
        showToast(`Uploaded ${file.name} to Cloudinary successfully!`)
      } else {
        // Fallback to local DataURL if server upload returned fallback
        const reader = new FileReader()
        reader.onload = () => {
          setFormState((prev) => ({ ...prev, image: reader.result }))
          showToast(`Loaded ${file.name} image successfully!`)
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      console.warn('Cloudinary upload warning:', err)
      const reader = new FileReader()
      reader.onload = () => {
        setFormState((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Modal State for Delete Confirmation (tracks targeted product object)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Modal States for KPI Card Details Popup
  const [activeKpiModal, setActiveKpiModal] = useState(null) // 'total' | 'inStock' | 'outOfStock' | 'categories' | null
  const [kpiModalSearch, setKpiModalSearch] = useState('')
  const [selectedProductDetail, setSelectedProductDetail] = useState(null)

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

  // KPI Modal list calculation
  const kpiModalProducts = useMemo(() => {
    if (!activeKpiModal || activeKpiModal === 'categories') return []
    let list = products
    if (activeKpiModal === 'inStock') {
      list = products.filter((p) => p.availability === 'In Stock' || p.availability === true)
    } else if (activeKpiModal === 'outOfStock') {
      list = products.filter((p) => p.availability !== 'In Stock' && p.availability !== true)
    }
    if (kpiModalSearch.trim()) {
      const q = kpiModalSearch.toLowerCase()
      list = list.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      )
    }
    return list
  }, [products, activeKpiModal, kpiModalSearch])

  // Category breakdown calculation for KPI Categories Modal
  const categoryBreakdown = useMemo(() => {
    if (activeKpiModal !== 'categories') return []
    const map = {}
    products.forEach((p) => {
      const cat = p.category || 'GENERAL'
      if (!map[cat]) {
        map[cat] = { name: cat, count: 0, products: [] }
      }
      map[cat].count += 1
      if (map[cat].products.length < 5) {
        map[cat].products.push(p)
      }
    })
    let list = Object.values(map)
    if (kpiModalSearch.trim()) {
      const q = kpiModalSearch.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q))
    }
    return list
  }, [products, activeKpiModal, kpiModalSearch])

  // KPI Card Popup Pagination (5 items per page)
  const KPI_ITEMS_PER_PAGE = 5
  const [kpiCurrentPage, setKpiCurrentPage] = useState(1)

  // Reset KPI pagination to page 1 whenever activeKpiModal or search query changes
  useEffect(() => {
    setKpiCurrentPage(1)
  }, [activeKpiModal, kpiModalSearch])

  // Active dataset count and pagination indices for KPI popup
  const activeKpiTotalItems =
    activeKpiModal === 'categories' ? categoryBreakdown.length : kpiModalProducts.length
  const totalKpiPages = Math.max(1, Math.ceil(activeKpiTotalItems / KPI_ITEMS_PER_PAGE))
  const kpiStartIndex = (kpiCurrentPage - 1) * KPI_ITEMS_PER_PAGE
  const kpiEndIndex = Math.min(kpiStartIndex + KPI_ITEMS_PER_PAGE, activeKpiTotalItems)

  // Paginated 5 items per page for Products (Total / In Stock / Out of Stock)
  const paginatedKpiProducts = useMemo(() => {
    return kpiModalProducts.slice(kpiStartIndex, kpiStartIndex + KPI_ITEMS_PER_PAGE)
  }, [kpiModalProducts, kpiStartIndex])

  // Paginated 5 items per page for Categories
  const paginatedKpiCategories = useMemo(() => {
    return categoryBreakdown.slice(kpiStartIndex, kpiStartIndex + KPI_ITEMS_PER_PAGE)
  }, [categoryBreakdown, kpiStartIndex])

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
  const handleToggleStock = async (product) => {
    const isCurrentlyInStock =
      product.availability === 'In Stock' || product.availability === true
    const newStatus = isCurrentlyInStock ? 'Out of Stock' : 'In Stock'
    const targetId = product._id || product.id

    try {
      if (product._id) {
        await apiService.updateProduct(product._id, { availability: newStatus })
      }
    } catch (err) {
      console.warn('Backend stock status update error:', err.message)
    }

    const updated = products.map((p) =>
      (p._id === targetId || p.id === targetId) ? { ...p, availability: newStatus } : p
    )
    setProducts(updated)
    showToast(`${product.name} marked as ${newStatus}`)
  }

  // Form Submit handler (Add/Edit in MongoDB)
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formState.name) {
      showToast('Please enter Product Name', 'warning')
      return
    }

    try {
      if (editingProduct) {
        // Update existing in MongoDB if _id exists, or fallback API update
        const targetId = editingProduct._id || editingProduct.id
        if (editingProduct._id) {
          await apiService.updateProduct(editingProduct._id, formState)
        } else {
          await apiService.createProduct(formState)
        }

        const updated = products.map((p) =>
          (p._id === targetId || p.id === targetId) ? { ...p, ...formState } : p
        )
        setProducts(updated)
        showToast('Product updated successfully in MongoDB!')
      } else {
        // Create new in MongoDB
        const res = await apiService.createProduct(formState)
        const savedProduct = res && res.data ? res.data : {
          id: Date.now(),
          slug: formState.name.toLowerCase().replace(/\s+/g, '-'),
          ...formState
        }
        setProducts([savedProduct, ...products])
        showToast('New product saved to MongoDB catalogue!')
      }
    } catch (err) {
      console.warn('MongoDB save error, falling back to client state:', err.message)
      if (editingProduct) {
        const updated = products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...formState } : p
        )
        setProducts(updated)
      } else {
        const newProduct = {
          id: Date.now(),
          slug: formState.name.toLowerCase().replace(/\s+/g, '-'),
          ...formState
        }
        setProducts([newProduct, ...products])
      }
      showToast('Product saved successfully!')
    }
    setIsModalOpen(false)
  }

  // Confirm delete handler with full multi-identifier support & storage sync
  const confirmDelete = async (productToDel) => {
    const target = productToDel || deleteTarget
    if (!target) return

    const targetMongoId = target._id
    const targetLocalId = target.id
    const targetName = target.name

    // 1. Delete from MongoDB API if _id exists
    const apiId =
      targetMongoId ||
      (typeof targetLocalId === 'string' && targetLocalId.length >= 24 ? targetLocalId : null)
    if (apiId) {
      try {
        await apiService.deleteProduct(apiId)
      } catch (err) {
        console.warn('MongoDB delete warning:', err.message)
      }
    }

    // 2. Filter out product from local state
    const updated = products.filter((p) => {
      if (targetMongoId && p._id && String(p._id) === String(targetMongoId)) return false
      if (
        targetLocalId !== undefined &&
        targetLocalId !== null &&
        p.id !== undefined &&
        p.id !== null &&
        String(p.id) === String(targetLocalId)
      )
        return false
      if (
        !targetMongoId &&
        (targetLocalId === undefined || targetLocalId === null) &&
        p.name &&
        p.name === targetName
      )
        return false
      return true
    })

    setProducts(updated)

    // 3. Immediately persist to localStorage and trigger storage event
    try {
      localStorage.setItem('enquiry_admin_products', JSON.stringify(updated))
      window.dispatchEvent(new Event('storage'))
    } catch (e) {
      console.warn('LocalStorage save warning:', e)
    }

    setDeleteTarget(null)
    showToast(`"${targetName || 'Product'}" removed successfully!`)
  }

  return (
    <div className="product-management-container">
      {/* KPI METRICS ROW */}
      <div className="kpi-grid">
        <div
          className="kpi-card clickable"
          onClick={() => {
            setKpiModalSearch('')
            setActiveKpiModal('total')
          }}
          title="Click to view total products list"
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="kpi-icon-wrapper indigo">
            <FiPackage />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Total Products</span>
            <span className="kpi-value">{totalProducts}</span>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#6366F1',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#EEF2FF',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            <FiEye size={13} />
            <span>View</span>
          </div>
        </div>

        <div
          className="kpi-card clickable"
          onClick={() => {
            setKpiModalSearch('')
            setActiveKpiModal('inStock')
          }}
          title="Click to view in-stock products"
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="kpi-icon-wrapper emerald">
            <FiCheckCircle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">In Stock Items</span>
            <span className="kpi-value">{inStockCount}</span>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#059669',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#ECFDF5',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            <FiEye size={13} />
            <span>View</span>
          </div>
        </div>

        <div
          className="kpi-card clickable"
          onClick={() => {
            setKpiModalSearch('')
            setActiveKpiModal('outOfStock')
          }}
          title="Click to view out-of-stock products"
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="kpi-icon-wrapper amber">
            <FiAlertTriangle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Out of Stock</span>
            <span className="kpi-value">{outOfStockCount}</span>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#D97706',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#FFFBEB',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            <FiEye size={13} />
            <span>View</span>
          </div>
        </div>

        <div
          className="kpi-card clickable"
          onClick={() => {
            setKpiModalSearch('')
            setActiveKpiModal('categories')
          }}
          title="Click to view categories breakdown"
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="kpi-icon-wrapper blue">
            <FiLayers />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Categories</span>
            <span className="kpi-value">{categoryCount > 0 ? categoryCount : 1}</span>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#2563EB',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#EFF6FF',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            <FiEye size={13} />
            <span>View</span>
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
              <div className="card-title-row">
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
                <th style={{ width: '28%' }}>Product Details</th>
                <th style={{ width: '16%' }}>Category</th>
                <th style={{ width: '12%' }}>Weight / Pack</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '32%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const currentProdKey =
                    product._id || product.id || product.slug || product.name
                  const isInStock =
                    product.availability === 'In Stock' || product.availability === true
                  const isDeletingThis =
                    deleteTarget &&
                    ((deleteTarget._id && product._id && deleteTarget._id === product._id) ||
                      (deleteTarget.id !== undefined &&
                        product.id !== undefined &&
                        String(deleteTarget.id) === String(product.id)) ||
                      (deleteTarget.name &&
                        product.name &&
                        deleteTarget.name === product.name))

                  return (
                    <tr key={currentProdKey}>
                      <td>
                        <div
                          className="product-cell"
                          style={{ cursor: 'pointer' }}
                          title="Click to view full product details"
                          onClick={() => setSelectedProductDetail(product)}
                        >
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
                            <div className="product-info-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{product.name}</span>
                              <FiEye size={12} color="#6366F1" style={{ opacity: 0.8 }} />
                            </div>
                            <div className="product-info-sku">
                              {product.sku ||
                                (product.id
                                  ? `SKU-${product.id}`
                                  : product._id
                                  ? `SKU-${product._id.slice(-6).toUpperCase()}`
                                  : 'SKU-PRD')}
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
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                        {isDeletingThis ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '5px',
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FECACA',
                              borderRadius: '8px',
                              padding: '3px 6px',
                              boxShadow: '0 2px 5px rgba(239, 68, 68, 0.08)'
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.74rem',
                                color: '#991B1B',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <FiAlertTriangle size={12} style={{ color: '#DC2626' }} />
                              Delete?
                            </span>
                            <button
                              type="button"
                              style={{
                                backgroundColor: '#DC2626',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(220, 38, 38, 0.25)',
                                transition: 'all 0.15s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
                              onClick={() => confirmDelete(product)}
                            >
                              <FiTrash2 size={11} />
                              Delete
                            </button>
                            <button
                              type="button"
                              title="Cancel"
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#475569',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#F1F5F9'
                                e.currentTarget.style.borderColor = '#94A3B8'
                                e.currentTarget.style.color = '#0F172A'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFFFFF'
                                e.currentTarget.style.borderColor = '#CBD5E1'
                                e.currentTarget.style.color = '#475569'
                              }}
                              onClick={() => setDeleteTarget(null)}
                            >
                              <FiX size={13} style={{ strokeWidth: 2.5 }} />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '6px'
                            }}
                          >
                            <button
                              type="button"
                              className="btn-icon"
                              title="View Product Info"
                              onClick={() => setSelectedProductDetail(product)}
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon"
                              title="Edit Product"
                              onClick={() => handleEditProduct(product)}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon delete"
                              title="Delete Product"
                              onClick={() => setDeleteTarget(product)}
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

      {/* KPI CARD DETAIL POPUP MODAL */}
      {activeKpiModal &&
        createPortal(
          <div
            className="modal-overlay"
            style={{
              zIndex: 10000,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setActiveKpiModal(null)}
          >
            <div
              className="modal-content"
              style={{
                maxWidth: '750px',
                width: '100%',
                maxHeight: '85vh',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
                border: '1px solid var(--admin-card-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#FAF6F0',
                  borderBottom: '1px solid var(--admin-card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    className={`kpi-icon-wrapper ${
                      activeKpiModal === 'total'
                        ? 'indigo'
                        : activeKpiModal === 'inStock'
                        ? 'emerald'
                        : activeKpiModal === 'outOfStock'
                        ? 'amber'
                        : 'blue'
                    }`}
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', borderRadius: '10px' }}
                  >
                    {activeKpiModal === 'total' && <FiPackage />}
                    {activeKpiModal === 'inStock' && <FiCheckCircle />}
                    {activeKpiModal === 'outOfStock' && <FiAlertTriangle />}
                    {activeKpiModal === 'categories' && <FiLayers />}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text-main)' }}>
                      {activeKpiModal === 'total' && `Total Products (${products.length})`}
                      {activeKpiModal === 'inStock' && `In Stock Items (${inStockCount})`}
                      {activeKpiModal === 'outOfStock' && `Out of Stock Items (${outOfStockCount})`}
                      {activeKpiModal === 'categories' && `Catalogue Categories (${categoryCount > 0 ? categoryCount : 1})`}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                      {activeKpiModal === 'total' && 'Detailed inspection of all catalogue items, SKU codes, and weights.'}
                      {activeKpiModal === 'inStock' && 'Products currently available and ready for customer orders.'}
                      {activeKpiModal === 'outOfStock' && 'Products currently out of stock requiring inventory reorder.'}
                      {activeKpiModal === 'categories' && 'Distribution of products across catalogue categories.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--admin-card-border)',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--admin-text-muted)'
                  }}
                  onClick={() => setActiveKpiModal(null)}
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* SEARCH BAR */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#FFFFFF' }}>
                <div style={{ position: 'relative' }}>
                  <FiSearch
                    size={15}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                  />
                  <input
                    type="text"
                    placeholder={
                      activeKpiModal === 'categories'
                        ? 'Search categories by name...'
                        : 'Search by product name, SKU or category...'
                    }
                    value={kpiModalSearch}
                    onChange={(e) => setKpiModalSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-card-border)',
                      fontSize: '0.84rem',
                      outline: 'none',
                      backgroundColor: '#FAF6F0'
                    }}
                  />
                </div>
              </div>

              {/* MODAL BODY CONTENT */}
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, maxHeight: '55vh' }}>
                {activeKpiModal === 'categories' ? (
                  paginatedKpiCategories.length > 0 ? (
                    paginatedKpiCategories.map((cat) => (
                      <div
                        key={cat.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: '1px solid var(--admin-card-border)',
                          backgroundColor: '#FFFFFF',
                          marginBottom: '10px',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--admin-text-main)' }}>
                              {cat.name}
                            </span>
                            <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                              {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {cat.products.map((cp) => (
                              <span
                                key={cp._id || cp.id}
                                style={{
                                  fontSize: '0.72rem',
                                  color: '#64748B',
                                  backgroundColor: '#F8FAFC',
                                  border: '1px solid #E2E8F0',
                                  padding: '1px 6px',
                                  borderRadius: '4px'
                                }}
                              >
                                {cp.name}
                              </span>
                            ))}
                            {cat.count > cat.products.length && (
                              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                                +{cat.count - cat.products.length} more
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '0.76rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
                          onClick={() => {
                            setSelectedCategory(cat.name)
                            setActiveKpiModal(null)
                            showToast(`Filtered catalogue by ${cat.name}`)
                          }}
                        >
                          Filter in Table →
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B', fontSize: '0.85rem' }}>
                      No categories found matching "{kpiModalSearch}".
                    </div>
                  )
                ) : (
                  paginatedKpiProducts.length > 0 ? (
                    paginatedKpiProducts.map((p) => {
                      const isInStock = p.availability === 'In Stock' || p.availability === true
                      return (
                        <div
                          key={p._id || p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid var(--admin-card-border)',
                            backgroundColor: '#FFFFFF',
                            marginBottom: '8px',
                            gap: '12px'
                          }}
                        >
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, cursor: 'pointer' }}
                            onClick={() => setSelectedProductDetail(p)}
                            title="Click to view full product information"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid #E2E8F0' }}
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
                              }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--admin-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                  {p.sku || `SKU-${p.id || 'PRD'}`}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#6366F1', fontWeight: 600 }}>
                                  {p.category || 'GENERAL'}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                  {p.netWeight || p.weight || '100g'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStock(p)}
                              className={`status-badge ${isInStock ? 'in-stock' : 'out-stock'}`}
                              style={{ cursor: 'pointer', border: 'none', fontSize: '0.72rem', padding: '3px 8px' }}
                              title="Click to toggle stock"
                            >
                              {isInStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                            <button
                              type="button"
                              className="btn-icon"
                              style={{ width: '30px', height: '30px' }}
                              title="View Details"
                              onClick={() => setSelectedProductDetail(p)}
                            >
                              <FiEye size={14} />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                      {activeKpiModal === 'outOfStock' ? (
                        <>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.4rem' }}>
                            <FiCheckCircle />
                          </div>
                          <h4 style={{ margin: '0 0 6px', color: '#065F46', fontSize: '1rem', fontWeight: 700 }}>All Products In Stock!</h4>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>Currently zero products are marked out of stock in your catalogue.</p>
                        </>
                      ) : (
                        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No products match your search query.</p>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* MODAL FOOTER WITH 5-ITEM PAGINATION */}
              <div
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#FAF6F0',
                  borderTop: '1px solid var(--admin-card-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', minWidth: '140px' }}>
                  {activeKpiTotalItems > 0 ? (
                    <>
                      Showing <strong style={{ color: 'var(--admin-text-main)' }}>{kpiStartIndex + 1}</strong> to{' '}
                      <strong style={{ color: 'var(--admin-text-main)' }}>{kpiEndIndex}</strong> of{' '}
                      <strong style={{ color: 'var(--admin-text-main)' }}>{activeKpiTotalItems}</strong> items
                    </>
                  ) : (
                    '0 items'
                  )}
                </div>

                {/* PAGINATION CONTROLS (5 ITEMS PER PAGE) */}
                {totalKpiPages > 1 && (
                  <div className="pagination-controls" style={{ gap: '4px', margin: '0 auto' }}>
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={kpiCurrentPage === 1}
                      onClick={() => setKpiCurrentPage((prev) => Math.max(prev - 1, 1))}
                      title="Previous Page"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                    >
                      <FiChevronLeft size={14} />
                    </button>

                    {Array.from({ length: totalKpiPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${page === kpiCurrentPage ? 'active' : ''}`}
                        onClick={() => setKpiCurrentPage(page)}
                        style={{
                          width: '28px',
                          height: '28px',
                          padding: 0,
                          fontSize: '0.78rem',
                          fontWeight: page === kpiCurrentPage ? 700 : 500
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={kpiCurrentPage === totalKpiPages}
                      onClick={() => setKpiCurrentPage((prev) => Math.min(prev + 1, totalKpiPages))}
                      title="Next Page"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                    >
                      <FiChevronRight size={14} />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 18px', minWidth: '80px' }}
                  onClick={() => setActiveKpiModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* FULL PRODUCT DETAIL POPUP MODAL */}
      {selectedProductDetail &&
        createPortal(
          <div
            className="modal-overlay"
            style={{
              zIndex: 10001,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(4px)',
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setSelectedProductDetail(null)}
          >
            <div
              className="modal-content"
              style={{
                maxWidth: '560px',
                width: '100%',
                maxHeight: '90vh',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4)',
                border: '1px solid var(--admin-card-border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#FAF6F0',
                  borderBottom: '1px solid var(--admin-card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                    {selectedProductDetail.category || 'PURE SPICES'}
                  </span>
                  <span
                    className={`status-badge ${
                      selectedProductDetail.availability === 'In Stock' || selectedProductDetail.availability === true
                        ? 'in-stock'
                        : 'out-stock'
                    }`}
                    style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  >
                    {selectedProductDetail.availability === 'In Stock' || selectedProductDetail.availability === true
                      ? 'In Stock'
                      : 'Out of Stock'}
                  </span>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--admin-card-border)',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--admin-text-muted)'
                  }}
                  onClick={() => setSelectedProductDetail(null)}
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* BODY */}
              <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <img
                    src={selectedProductDetail.image}
                    alt={selectedProductDetail.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid var(--admin-card-border)',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src =
                        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--admin-text-main)' }}>
                      {selectedProductDetail.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '10px' }}>
                      SKU: <strong style={{ color: 'var(--admin-text-main)' }}>{selectedProductDetail.sku || (selectedProductDetail.id ? `SKU-${selectedProductDetail.id}` : 'SKU-PRD')}</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#FAF6F0', border: '1px solid var(--admin-card-border)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Weight / Pack</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                          {selectedProductDetail.netWeight || selectedProductDetail.weight || '100g'}
                        </div>
                      </div>
                      <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#FAF6F0', border: '1px solid var(--admin-card-border)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Min Order Qty</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                          {selectedProductDetail.minOrderQty || '50 Units'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                    Description
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, backgroundColor: '#FAF6F0', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--admin-card-border)' }}>
                    {selectedProductDetail.description || 'No description provided for this product catalogue item.'}
                  </p>
                </div>

                {/* RATING & REVIEWS */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FEF9C3', border: '1px solid #FEF08A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiStar size={16} fill="#CA8A04" color="#CA8A04" />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#854D0E' }}>
                      {selectedProductDetail.rating || 4.8} / 5.0
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#854D0E', fontWeight: 600 }}>
                    {selectedProductDetail.reviewsCount || 12} Verified Customer Reviews
                  </span>
                </div>
              </div>

              {/* FOOTER */}
              <div
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#FAF6F0',
                  borderTop: '1px solid var(--admin-card-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  onClick={() => {
                    handleToggleStock(selectedProductDetail)
                    setSelectedProductDetail((prev) => ({
                      ...prev,
                      availability: prev.availability === 'In Stock' || prev.availability === true ? 'Out of Stock' : 'In Stock'
                    }))
                  }}
                >
                  Toggle Stock Status
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                    onClick={() => {
                      handleEditProduct(selectedProductDetail)
                      setSelectedProductDetail(null)
                    }}
                  >
                    <FiEdit2 size={13} /> Edit Product
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                    onClick={() => setSelectedProductDetail(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

    </div>
  )
}

export default React.memo(ProductManagement)
