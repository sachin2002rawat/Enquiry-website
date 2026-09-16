import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  FiSliders,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiEye,
  FiX,
  FiCheck,
  FiUploadCloud,
  FiLink,
  FiImage,
  FiCheckCircle,
  FiDroplet,
  FiType,
  FiTrash,
  FiCrop,
  FiScissors
} from 'react-icons/fi'
import { FaCommentDots } from 'react-icons/fa'

// Helper to parse CSS color names (e.g. 'red', 'blue', 'pink', 'lightgreen') or hex to valid 6-digit hex for <input type="color">
const parseCssColorToHex = (colorStr, fallback = '#ffffff') => {
  if (!colorStr) return fallback
  const str = colorStr.trim()
  if (/^#([0-9a-f]{3}){1,2}$/i.test(str)) {
    if (str.length === 4) {
      return '#' + str[1] + str[1] + str[2] + str[2] + str[3] + str[3]
    }
    return str
  }
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.fillStyle = str
    const computed = ctx.fillStyle
    if (computed && computed.startsWith('#')) {
      return computed
    }
  } catch (err) {
    // fallback
  }
  return fallback
}

const COLOR_PRESET_OPTIONS = [
  { label: '-- Select Color Name --', value: '' },
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Pink', value: 'pink' },
  { label: 'Purple', value: 'purple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Light Green', value: 'lightgreen' },
  { label: 'Sky Blue', value: 'skyblue' },
  { label: 'Dark Green', value: 'darkgreen' },
  { label: 'Navy', value: 'navy' },
  { label: 'Teal', value: 'teal' },
  { label: 'Maroon', value: 'maroon' },
  { label: 'Gold', value: 'gold' },
  { label: 'Cyan', value: 'cyan' },
  { label: 'Gray', value: 'gray' }
]

const HomepageSettings = ({
  heroSlides,
  setHeroSlides,
  storeSettings,
  setStoreSettings,
  sectionVisibility,
  setSectionVisibility,
  showToast
}) => {
  // Modal state for adding/editing a Hero Banner Slide
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [imageSourceType, setImageSourceType] = useState('upload') // 'upload' | 'url'
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [deleteSlideId, setDeleteSlideId] = useState(null)

  // Simple Logo Draft State (Changes only apply when Save Changes is clicked)
  const [logoTextDraft, setLogoTextDraft] = useState(storeSettings.logoText || 'QuickEnquiry')
  const [logoUrlDraft, setLogoUrlDraft] = useState(storeSettings.logoUrl || '')

  // Easy Mouse Selection Box Cropper State
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 })
  const [activeDrag, setActiveDrag] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialBox, setInitialBox] = useState({ x: 10, y: 10, width: 80, height: 80 })
  const cropContainerRef = React.useRef(null)

  const handleStartDrag = (handleType, e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveDrag(handleType)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX, y: clientY })
    setInitialBox({ ...cropBox })
  }

  const handleDragMove = (e) => {
    if (!activeDrag || !cropContainerRef.current) return
    const rect = cropContainerRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    const dx = ((clientX - dragStart.x) / rect.width) * 100
    const dy = ((clientY - dragStart.y) / rect.height) * 100

    setCropBox(() => {
      let { x, y, width, height } = initialBox

      if (activeDrag === 'move') {
        x = Math.max(0, Math.min(100 - width, initialBox.x + dx))
        y = Math.max(0, Math.min(100 - height, initialBox.y + dy))
      } else if (activeDrag === 'br') {
        width = Math.max(10, Math.min(100 - initialBox.x, initialBox.width + dx))
        height = Math.max(10, Math.min(100 - initialBox.y, initialBox.height + dy))
      } else if (activeDrag === 'tl') {
        const newX = Math.max(0, Math.min(initialBox.x + initialBox.width - 10, initialBox.x + dx))
        const newY = Math.max(0, Math.min(initialBox.y + initialBox.height - 10, initialBox.y + dy))
        width = initialBox.width + (initialBox.x - newX)
        height = initialBox.height + (initialBox.y - newY)
        x = newX
        y = newY
      } else if (activeDrag === 'tr') {
        const newY = Math.max(0, Math.min(initialBox.y + initialBox.height - 10, initialBox.y + dy))
        width = Math.max(10, Math.min(100 - initialBox.x, initialBox.width + dx))
        height = initialBox.height + (initialBox.y - newY)
        y = newY
      } else if (activeDrag === 'bl') {
        const newX = Math.max(0, Math.min(initialBox.x + initialBox.width - 10, initialBox.x + dx))
        width = initialBox.width + (initialBox.x - newX)
        height = Math.max(10, Math.min(100 - initialBox.y, initialBox.height + dy))
        x = newX
      }

      return { x, y, width, height }
    })
  }

  const handleEndDrag = () => {
    setActiveDrag(null)
  }

  // Apply Crop Function using Mouse Box coordinates
  const handleApplyCrop = () => {
    if (!logoUrlDraft) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const sx = (cropBox.x / 100) * img.naturalWidth
      const sy = (cropBox.y / 100) * img.naturalHeight
      const sw = (cropBox.width / 100) * img.naturalWidth
      const sh = (cropBox.height / 100) * img.naturalHeight

      const canvas = document.createElement('canvas')
      canvas.width = Math.max(10, Math.round(sw))
      canvas.height = Math.max(10, Math.round(sh))
      const ctx = canvas.getContext('2d')

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
      const croppedDataUrl = canvas.toDataURL('image/png')

      setLogoUrlDraft(croppedDataUrl)
      setCropModalOpen(false)
      showToast('Image cropped successfully!')
    }
    img.src = logoUrlDraft
  }

  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    url: ''
  })

  // Handle logo file selection (draft state update only)
  const handleLogoFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file for logo', 'warning')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setLogoUrlDraft(reader.result)
      showToast(`Selected logo image: ${file.name}`)
    }
    reader.readAsDataURL(file)
  }

  // Save Logo Changes handler (applies changes to storeSettings and localStorage)
  const handleSaveLogo = () => {
    const updated = {
      ...storeSettings,
      logoText: logoTextDraft,
      logoUrl: logoUrlDraft
    }
    setStoreSettings(updated)
    localStorage.setItem('enquiry_admin_store_settings', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    showToast('Logo changes saved successfully!')
  }

  // Save Theme & Colors handler
  const handleSaveThemeColors = () => {
    localStorage.setItem('enquiry_admin_store_settings', JSON.stringify(storeSettings))
    window.dispatchEvent(new Event('storage'))
    showToast('Header Theme & Colors saved successfully!')
  }

  // Handle local image file upload conversion to DataURL
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'warning')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setSlideForm((prev) => ({ ...prev, url: reader.result }))
      setUploadedFileName(file.name)
      showToast(`Uploaded ${file.name} successfully!`)
    }
    reader.readAsDataURL(file)
  }

  // Open modal for new slide
  const handleAddSlideClick = () => {
    setEditingSlide(null)
    setSlideForm({ title: '', subtitle: '', url: '' })
    setModalOpen(true)
  }

  // Open modal for editing slide
  const handleEditSlideClick = (slide) => {
    setEditingSlide(slide)
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle,
      url: slide.url
    })
    setModalOpen(true)
  }

  // Save slide form submit
  const handleSlideFormSubmit = (e) => {
    e.preventDefault()
    if (!slideForm.title || !slideForm.url) {
      showToast('Please fill in Slide Title and Image URL', 'warning')
      return
    }

    if (editingSlide) {
      // Edit existing
      const updated = heroSlides.map((item) =>
        item.id === editingSlide.id ? { ...item, ...slideForm } : item
      )
      setHeroSlides(updated)
      showToast('Hero banner updated successfully!')
    } else {
      // Create new
      const newSlide = {
        id: Date.now(),
        ...slideForm
      }
      setHeroSlides([...heroSlides, newSlide])
      showToast('New hero banner slide added!')
    }
    setModalOpen(false)
  }

  // Delete slide
  const handleDeleteSlide = (id) => {
    if (heroSlides.length <= 1) {
      showToast('You must keep at least one Hero Slide!', 'warning')
      setDeleteSlideId(null)
      return
    }
    const filtered = heroSlides.filter((slide) => slide.id !== id)
    setHeroSlides(filtered)
    setDeleteSlideId(null)
    showToast('Hero slide deleted!')
  }

  // Store settings handler
  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target
    setStoreSettings((prev) => ({ ...prev, [name]: value }))
  }

  // Section toggle handler
  const handleToggleSection = (key) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Save general homepage settings
  const handleSaveAll = () => {
    try {
      localStorage.setItem('enquiry_admin_store_settings', JSON.stringify(storeSettings))
      window.dispatchEvent(new Event('storage'))
      showToast('Homepage settings & logo saved successfully!')
    } catch {
      showToast('Saved homepage settings!')
    }
  }

  return (
    <div className="homepage-settings-container">

      {/* 0. HOMEPAGE VERSION SELECTION */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <div className="admin-card-header" style={{ marginBottom: '14px' }}>
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
              <FiEye className="card-title-icon" size={20} />
            </div>
            <div>
              <div className="card-title-row">
                <h2 className="card-title">Select Homepage</h2>
                <span className="live-count-badge" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                  {(storeSettings.activeHomepage || 'home1') === 'home2' ? 'Homepage 2 (Beauty Products) Active' : 'Homepage 1 (Masala Products) Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Option 1: Homepage 1 */}
          <div
            onClick={() => {
              const updated = { ...storeSettings, activeHomepage: 'home1' }
              setStoreSettings(updated)
              localStorage.setItem('enquiry_admin_store_settings', JSON.stringify(updated))
              window.dispatchEvent(new Event('storage'))
              showToast('Set Homepage 1 (Masala Products) as default homepage!')
            }}
            style={{
              padding: '18px 20px',
              borderRadius: '14px',
              border: (storeSettings.activeHomepage || 'home1') === 'home1' ? '2px solid #6366F1' : '1px solid var(--admin-card-border)',
              backgroundColor: (storeSettings.activeHomepage || 'home1') === 'home1' ? 'rgba(99, 102, 241, 0.03)' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="activeHomepage"
                  checked={(storeSettings.activeHomepage || 'home1') === 'home1'}
                  onChange={() => {}}
                  style={{ width: '18px', height: '18px', accentColor: '#6366F1', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--admin-text-main)' }}>
                  Homepage 1 (Masala Products)
                </span>
              </div>
              {(storeSettings.activeHomepage || 'home1') === 'home1' && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#6366F1', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                  ACTIVE
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', margin: 0, lineHeight: 1.4 }}>
              Spices & Masala products enquiry website layout.
            </p>
          </div>

          {/* Option 2: Homepage 2 */}
          <div
            onClick={() => {
              const updated = { ...storeSettings, activeHomepage: 'home2' }
              setStoreSettings(updated)
              localStorage.setItem('enquiry_admin_store_settings', JSON.stringify(updated))
              window.dispatchEvent(new Event('storage'))
              showToast('Set Homepage 2 (Beauty Products) as default homepage!')
            }}
            style={{
              padding: '18px 20px',
              borderRadius: '14px',
              border: (storeSettings.activeHomepage || 'home1') === 'home2' ? '2px solid #6366F1' : '1px solid var(--admin-card-border)',
              backgroundColor: (storeSettings.activeHomepage || 'home1') === 'home2' ? 'rgba(99, 102, 241, 0.03)' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="activeHomepage"
                  checked={(storeSettings.activeHomepage || 'home1') === 'home2'}
                  onChange={() => {}}
                  style={{ width: '18px', height: '18px', accentColor: '#6366F1', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--admin-text-main)' }}>
                  Homepage 2 (Beauty Products)
                </span>
              </div>
              {(storeSettings.activeHomepage || 'home1') === 'home2' && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#6366F1', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                  ACTIVE
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)', margin: 0, lineHeight: 1.4 }}>
              Beauty & Skincare products enquiry website layout.
            </p>
          </div>
        </div>
      </div>

      {/* 1. HERO SLIDER BANNER MANAGEMENT */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <div className="card-title-icon-wrapper">
              <FiSliders className="card-title-icon" size={20} />
            </div>
            <div>
              <div className="card-title-row">
                <h2 className="card-title">Hero Banner Carousel</h2>
                <span className="live-count-badge">{heroSlides.length} Banners</span>
              </div>
              <p className="card-subtitle">
                Curate high-converting hero banners, promotional slides, and seasonal hero media.
              </p>
            </div>
          </div>
          <button className="btn-secondary" onClick={handleAddSlideClick}>
            <FiPlus size={16} /> Add Hero Banner
          </button>
        </div>

        <div className="banners-grid">
          {heroSlides.map((slide, index) => (
            <div className="banner-item-card" key={slide.id || index}>
              <div className="banner-img-wrap">
                <span className="banner-order-badge">Slide #{index + 1}</span>
                <img
                  src={slide.url}
                  alt={slide.title}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
                  }}
                />
              </div>
              <div className="banner-content">
                <div className="banner-title">{slide.title}</div>
                <div className="banner-sub">{slide.subtitle}</div>
                <div className="banner-actions">
                  {deleteSlideId === slide.id ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '6px',
                        padding: '3px 6px'
                      }}
                    >
                      <span style={{ fontSize: '0.74rem', color: '#991B1B', fontWeight: 600 }}>
                        Delete?
                      </span>
                      <button
                        type="button"
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDeleteSlide(slide.id)}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        onClick={() => setDeleteSlideId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="btn-icon"
                        title="Edit Banner"
                        onClick={() => handleEditSlideClick(slide)}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Delete Banner"
                        onClick={() => setDeleteSlideId(slide.id)}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 2. SECTION VISIBILITY TOGGLES */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <div className="card-title-icon-wrapper">
              <FiEye className="card-title-icon" size={20} />
            </div>
            <div>
              <h2 className="card-title">Section Visibility Controls</h2>
              <p className="card-subtitle">
                Toggle dynamic homepage layout sections and storefront content blocks.
              </p>
            </div>
          </div>
        </div>

        <div className="toggle-row-list">
          <div className="toggle-item">
            <div className="toggle-label-group">
              <span className="toggle-title">Hero Carousel Slider</span>
              <span className="toggle-desc">Top main carousel banner section</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={!!sectionVisibility.heroSlider}
                onChange={() => handleToggleSection('heroSlider')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-label-group">
              <span className="toggle-title">Featured Products Grid</span>
              <span className="toggle-desc">Showcase top recommended spice items</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={!!sectionVisibility.featuredProducts}
                onChange={() => handleToggleSection('featuredProducts')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-label-group">
              <span className="toggle-title">Why Choose Us Section</span>
              <span className="toggle-desc">Highlight organic quality & fast delivery metrics</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={!!sectionVisibility.whyChoose}
                onChange={() => handleToggleSection('whyChoose')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-label-group">
              <span className="toggle-title">Customer Video & Text Reviews</span>
              <span className="toggle-desc">Display social proof & customer ratings</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={!!sectionVisibility.reviews}
                onChange={() => handleToggleSection('reviews')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-label-group">
              <span className="toggle-title">Frequently Asked Questions (FAQ)</span>
              <span className="toggle-desc">Accordion view of customer common questions</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={!!sectionVisibility.faq}
                onChange={() => handleToggleSection('faq')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-label-group">
              <span className="toggle-title">Latest Articles / Blog Grid</span>
              <span className="toggle-desc">Recent recipe guides & spice tips</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={!!sectionVisibility.blogs}
                onChange={() => handleToggleSection('blogs')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. HEADER LOGO & THEME CUSTOMIZATION */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ backgroundColor: '#EEF2FF' }}>
              <FiImage className="card-title-icon" size={20} color="#4F46E5" />
            </div>
            <div>
              <h2 className="card-title">Header Logo Settings</h2>
              <p className="card-subtitle">
                Enter logo name or upload a logo image. Click "Save Changes" to update the header logo.
              </p>
            </div>
          </div>
        </div>

        {/* Simple Logo Inputs Row */}
        <div className="form-row" style={{ gap: '20px', alignItems: 'flex-start', marginBottom: '16px' }}>
          {/* Logo Name Input */}
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Logo Name / Brand Text</label>
            <input
              type="text"
              className="form-input"
              value={logoTextDraft}
              onChange={(e) => setLogoTextDraft(e.target.value)}
              placeholder="e.g. QuickEnquiry"
            />
          </div>

          {/* Upload Logo Image & Action Controls */}
          <div className="form-group" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>Upload Logo Image</label>
              {logoUrlDraft && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '3px 9px', color: '#4F46E5', borderColor: '#A5B4FC' }}
                    onClick={() => setCropModalOpen(true)}
                    title="Crop / Cut unwanted borders of image"
                  >
                    <FiCrop size={14} /> Cut / Crop Image
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '3px 9px', color: '#EF4444', borderColor: '#FCA5A5' }}
                    onClick={() => setLogoUrlDraft('')}
                    title="Remove uploaded image"
                  >
                    <FiTrash size={14} /> Cut / Remove
                  </button>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              style={{ padding: '7px 10px', background: '#FFFFFF', cursor: 'pointer' }}
              onChange={handleLogoFileSelect}
            />
          </div>
        </div>

        {/* Live Logo Preview Box (Real-time draft preview) */}
        <div style={{ marginTop: '10px', marginBottom: '18px' }}>
          <label className="form-label" style={{ marginBottom: '6px', fontWeight: 600, color: 'var(--admin-text-main)' }}>
            Header Logo Live Preview (Before Saving):
          </label>
          <div
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: storeSettings.topbarBgColor || '#E0F2FE',
              color: storeSettings.topbarTextColor || '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--admin-card-border)',
              transition: 'all 0.25s ease'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'inherit', opacity: 0.7 }}>
              *Welcome <span style={{ textDecoration: 'underline' }}>Enquiry Now</span> *
            </span>

            {/* Dynamic Draft Logo Live Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {logoUrlDraft ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={logoUrlDraft}
                    alt={logoTextDraft || 'QuickEnquiry'}
                    style={{ maxHeight: '38px', objectFit: 'contain' }}
                  />
                  {logoTextDraft && (
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'inherit' }}>
                      {logoTextDraft}
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#4F46E5', borderColor: '#A5B4FC', background: '#FFFFFF', marginLeft: '4px' }}
                    onClick={() => setCropModalOpen(true)}
                  >
                    <FiCrop size={12} /> Crop
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#EF4444', borderColor: '#FCA5A5', background: '#FFFFFF' }}
                    onClick={() => setLogoUrlDraft('')}
                  >
                    <FiTrash size={12} /> Cut Image
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCommentDots style={{ fontSize: '22px', color: '#86d2a3' }} />
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'inherit' }}>
                    {logoTextDraft || 'QuickEnquiry'}
                  </span>
                </div>
              )}
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'inherit', opacity: 0.7 }}>
              Search... 🔍
            </span>
          </div>
        </div>

        {/* Save Logo Changes Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveLogo}
            style={{ padding: '9px 22px', fontSize: '0.88rem', fontWeight: 700 }}
          >
            <FiSave size={16} /> Save Changes
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--admin-card-border)', margin: '20px 0' }} />

        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '4px', height: '22px', borderRadius: '4px', background: 'linear-gradient(180deg, #6366F1 0%, #4338CA 100%)', flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: '#1E1B4B', background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Header Topbar Theme & Colors
            </h3>
            <p className="card-subtitle" style={{ margin: '2px 0 0 0' }}>
              Customize topbar background color and text color.
            </p>
          </div>
        </div>

        {/* Custom Color Pickers with Dropdown Select & Direct Text Input */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Top Bar Background Color
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={parseCssColorToHex(storeSettings.topbarBgColor, '#E0F2FE')}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarBgColor: e.target.value })
                }
                title="Click to open color picker"
                style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}
              />
              <input
                type="text"
                className="form-input"
                value={storeSettings.topbarBgColor || '#E0F2FE'}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarBgColor: e.target.value })
                }
                placeholder="Type name (red, blue) or #hex"
                style={{ flex: 1 }}
              />
              <select
                className="form-input"
                value={COLOR_PRESET_OPTIONS.some(c => c.value === storeSettings.topbarBgColor?.toLowerCase()) ? storeSettings.topbarBgColor.toLowerCase() : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setStoreSettings({ ...storeSettings, topbarBgColor: e.target.value })
                  }
                }}
                style={{ width: '180px', flexShrink: 0, cursor: 'pointer' }}
              >
                {COLOR_PRESET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Top Bar Text & Link Color
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={parseCssColorToHex(storeSettings.topbarTextColor, '#1E293B')}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarTextColor: e.target.value })
                }
                title="Click to open color picker"
                style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}
              />
              <input
                type="text"
                className="form-input"
                value={storeSettings.topbarTextColor || '#1E293B'}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarTextColor: e.target.value })
                }
                placeholder="Type name (white, black) or #hex"
                style={{ flex: 1 }}
              />
              <select
                className="form-input"
                value={COLOR_PRESET_OPTIONS.some(c => c.value === storeSettings.topbarTextColor?.toLowerCase()) ? storeSettings.topbarTextColor.toLowerCase() : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setStoreSettings({ ...storeSettings, topbarTextColor: e.target.value })
                  }
                }}
                style={{ width: '180px', flexShrink: 0, cursor: 'pointer' }}
              >
                {COLOR_PRESET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Topbar Color & Logo Preview Box */}
        <div style={{ marginTop: '14px' }}>
          <label className="form-label" style={{ marginBottom: '6px' }}>
            Live Header Topbar & Logo Preview:
          </label>
          <div
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: storeSettings.topbarBgColor || '#E0F2FE',
              color: storeSettings.topbarTextColor || '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--admin-card-border)',
              transition: 'all 0.25s ease'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'inherit' }}>
              *Welcome <span style={{ textDecoration: 'underline' }}>Enquiry Now</span> *
            </span>

            {/* Dynamic Logo Live Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              {storeSettings.logoUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={storeSettings.logoUrl}
                    alt={storeSettings.logoText || 'QuickEnquiry'}
                    style={{ maxHeight: '36px', objectFit: 'contain' }}
                  />
                  {storeSettings.logoText && (
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'inherit' }}>
                      {storeSettings.logoText}
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCommentDots style={{ fontSize: '22px', color: '#86d2a3' }} />
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'inherit' }}>
                    {storeSettings.logoText || 'QuickEnquiry'}
                  </span>
                </div>
              )}
            </div>

            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'inherit' }}>
              Search... 🔍
            </span>
          </div>
        </div>

        {/* Save Theme & Colors Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveThemeColors}
            style={{ padding: '9px 22px', fontSize: '0.88rem', fontWeight: 700 }}
          >
            <FiSave size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* BOTTOM ACTION SAVE BAR */}
      <div
        className="admin-card"
        style={{
          marginTop: '24px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFDF9',
          border: '1px solid var(--admin-card-border)',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
            Save Storefront Configuration
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
            Apply and persist all changes made to hero banners, section visibility, and topbar theme colors.
          </div>
        </div>

        <button className="btn-primary" onClick={handleSaveAll} style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
          <FiSave size={16} /> Save All Settings
        </button>
      </div>
      {modalOpen &&
        createPortal(
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingSlide ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
                </h3>
                <button className="btn-icon" onClick={() => setModalOpen(false)} aria-label="Close">
                  <FiX size={18} />
                </button>
              </div>
              <form onSubmit={handleSlideFormSubmit}>
                <div className="modal-body" style={{ padding: '14px 18px' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ marginBottom: '4px' }}>Banner Headline Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '8px 12px' }}
                      value={slideForm.title}
                      onChange={(e) =>
                        setSlideForm({ ...slideForm, title: e.target.value })
                      }
                      placeholder="e.g. Pure Turmeric Powder"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ marginBottom: '4px' }}>Subhead Description</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      style={{ minHeight: '50px', padding: '8px 12px', resize: 'vertical' }}
                      value={slideForm.subtitle}
                      onChange={(e) =>
                        setSlideForm({ ...slideForm, subtitle: e.target.value })
                      }
                      placeholder="Brief description highlight..."
                    />
                  </div>

                  {/* Dual Image Input Mode: File Upload vs URL Link */}
                  <div className="form-group" style={{ marginBottom: '4px' }}>
                    <label className="form-label" style={{ marginBottom: '4px' }}>Banner Background Image *</label>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          padding: '6px 10px',
                          backgroundColor:
                            imageSourceType === 'upload' ? '#EEF2FF' : '#FAF6F0',
                          borderColor:
                            imageSourceType === 'upload' ? '#6366F1' : 'var(--admin-card-border)',
                          color: imageSourceType === 'upload' ? '#4F46E5' : 'var(--admin-text-main)',
                          fontWeight: 700
                        }}
                        onClick={() => setImageSourceType('upload')}
                      >
                        <FiUploadCloud size={15} /> Upload Image File
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          padding: '6px 10px',
                          backgroundColor:
                            imageSourceType === 'url' ? '#EEF2FF' : '#FAF6F0',
                          borderColor:
                            imageSourceType === 'url' ? '#6366F1' : 'var(--admin-card-border)',
                          color: imageSourceType === 'url' ? '#4F46E5' : 'var(--admin-text-main)',
                          fontWeight: 700
                        }}
                        onClick={() => setImageSourceType('url')}
                      >
                        <FiLink size={15} /> Paste Image URL Link
                      </button>
                    </div>

                    {imageSourceType === 'upload' ? (
                      <div
                        style={{
                          border: slideForm.url ? '2px solid #10B981' : '2px dashed var(--admin-card-border)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          backgroundColor: slideForm.url ? '#ECFDF5' : '#FAF6F0',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => document.getElementById('hero-slide-file-input').click()}
                      >
                        <input
                          id="hero-slide-file-input"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                        />
                        {slideForm.url ? (
                          <>
                            <FiCheckCircle size={18} color="#10B981" />
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                              Selected: {uploadedFileName || 'Image File Loaded ✓'}
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
                        type="url"
                        className="form-input"
                        style={{ padding: '8px 12px' }}
                        value={slideForm.url}
                        onChange={(e) =>
                          setSlideForm({ ...slideForm, url: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        required={imageSourceType === 'url'}
                      />
                    )}

                    {/* Compact Image Thumbnail Preview */}
                    {slideForm.url && (
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
                          src={slideForm.url}
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
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <FiCheck size={16} /> Save Slide
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* EASY MOUSE SELECTION CROPPER MODAL */}
      {cropModalOpen &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setCropModalOpen(false)}
            onMouseMove={handleDragMove}
            onMouseUp={handleEndDrag}
            onTouchMove={handleDragMove}
            onTouchEnd={handleEndDrag}
          >
            <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCrop size={18} color="#6366F1" /> Crop Logo Image
                </h3>
                <button className="btn-icon" onClick={() => setCropModalOpen(false)} aria-label="Close">
                  <FiX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 14px 0' }}>
                  Drag the box or corner handles with your mouse pointer to select the crop area.
                </p>

                {/* Main Interactive Crop Container */}
                <div
                  ref={cropContainerRef}
                  style={{
                    width: '100%',
                    height: '280px',
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    touchAction: 'none'
                  }}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleEndDrag}
                >
                  <img
                    src={logoUrlDraft}
                    alt="Crop Target"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Resizable & Draggable Crop Selection Box */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${cropBox.x}%`,
                      top: `${cropBox.y}%`,
                      width: `${cropBox.width}%`,
                      height: `${cropBox.height}%`,
                      border: '2px solid #38BDF8',
                      boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)',
                      cursor: 'move',
                      boxSizing: 'border-box'
                    }}
                    onMouseDown={(e) => handleStartDrag('move', e)}
                    onTouchStart={(e) => handleStartDrag('move', e)}
                  >
                    {/* Corner Drag Handles */}
                    {/* Top-Left Handle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        left: '-7px',
                        width: '14px',
                        height: '14px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0284C7',
                        borderRadius: '50%',
                        cursor: 'nwse-resize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                      }}
                      onMouseDown={(e) => handleStartDrag('tl', e)}
                      onTouchStart={(e) => handleStartDrag('tl', e)}
                    />

                    {/* Top-Right Handle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '-7px',
                        width: '14px',
                        height: '14px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0284C7',
                        borderRadius: '50%',
                        cursor: 'nesw-resize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                      }}
                      onMouseDown={(e) => handleStartDrag('tr', e)}
                      onTouchStart={(e) => handleStartDrag('tr', e)}
                    />

                    {/* Bottom-Left Handle */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-7px',
                        left: '-7px',
                        width: '14px',
                        height: '14px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0284C7',
                        borderRadius: '50%',
                        cursor: 'nesw-resize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                      }}
                      onMouseDown={(e) => handleStartDrag('bl', e)}
                      onTouchStart={(e) => handleStartDrag('bl', e)}
                    />

                    {/* Bottom-Right Handle */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-7px',
                        right: '-7px',
                        width: '14px',
                        height: '14px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0284C7',
                        borderRadius: '50%',
                        cursor: 'nwse-resize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                      }}
                      onMouseDown={(e) => handleStartDrag('br', e)}
                      onTouchStart={(e) => handleStartDrag('br', e)}
                    />
                  </div>
                </div>

                {/* Quick Presets Bar */}
                <div style={{ marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Quick Presets:</span>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                    onClick={() => setCropBox({ x: 5, y: 5, width: 90, height: 90 })}
                  >
                    Reset Full
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                    onClick={() => setCropBox({ x: 25, y: 10, width: 50, height: 80 })}
                  >
                    Square 1:1
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                    onClick={() => setCropBox({ x: 5, y: 25, width: 90, height: 50 })}
                  >
                    Header Banner
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setCropModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={handleApplyCrop}>
                  <FiCheck size={16} /> Apply Crop
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default React.memo(HomepageSettings)
