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
  FiDroplet
} from 'react-icons/fi'

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
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    url: ''
  })

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
      return
    }
    const filtered = heroSlides.filter((slide) => slide.id !== id)
    setHeroSlides(filtered)
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
    showToast('Homepage settings saved successfully!')
  }

  return (
    <div className="homepage-settings-container">
      {/* Top Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={handleSaveAll}>
          <FiSave size={16} /> Save Settings
        </button>
      </div>

      {/* 1. HERO SLIDER BANNER MANAGEMENT */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <FiSliders className="card-title-icon" size={22} />
            <div>
              <h2 className="card-title">Hero Carousel Slides</h2>
              <p className="card-subtitle">
                Manage high-impact hero banner slides displayed at top of homepage.
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
                    onClick={() => handleDeleteSlide(slide.id)}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 3. SECTION VISIBILITY TOGGLES */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <FiEye className="card-title-icon" size={22} />
            <div>
              <h2 className="card-title">Homepage Section Visibility</h2>
              <p className="card-subtitle">
                Enable or disable dynamic sections displayed on the homepage.
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

      {/* 3. TOP BAR & HEADER COLOR CUSTOMIZATION */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="card-title-group">
            <FiDroplet className="card-title-icon" size={22} color="#6366F1" />
            <div>
              <h2 className="card-title">Homepage Top Bar Color Customization</h2>
              <p className="card-subtitle">
                Customize the background color, text color, and theme of the homepage top bar header.
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette Presets */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ marginBottom: '8px' }}>
            Quick Preset Color Themes:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { name: 'Sky Blue', bg: '#E0F2FE', text: '#1E293B' },
              { name: 'Fresh Mint', bg: '#ECFDF5', text: '#065F46' },
              { name: 'Warm Amber', bg: '#FEF3C7', text: '#92400E' },
              { name: 'Soft Rose', bg: '#FCE7F3', text: '#9D174D' },
              { name: 'Royal Indigo', bg: '#EEF2FF', text: '#3730A3' },
              { name: 'Dark Slate Navy', bg: '#0F172A', text: '#FFFFFF' },
              { name: 'Pure White', bg: '#FFFFFF', text: '#1E293B' },
              { name: 'Emerald Gradient', bg: 'linear-gradient(90deg, #dcfce7, #ecfdf5)', text: '#065F46' }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-secondary"
                style={{
                  fontSize: '0.8rem',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: preset.bg,
                  color: preset.text,
                  borderColor:
                    storeSettings.topbarBgColor === preset.bg ? '#6366F1' : 'var(--admin-card-border)',
                  fontWeight: 700,
                  boxShadow:
                    storeSettings.topbarBgColor === preset.bg ? '0 0 0 2px #6366F1' : 'none'
                }}
                onClick={() => {
                  const updated = {
                    ...storeSettings,
                    topbarBgColor: preset.bg,
                    topbarTextColor: preset.text
                  }
                  setStoreSettings(updated)
                  showToast(`Applied ${preset.name} Theme!`)
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Pickers */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Top Bar Background Color / Gradient</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={storeSettings.topbarBgColor?.startsWith('#') ? storeSettings.topbarBgColor : '#E0F2FE'}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarBgColor: e.target.value })
                }
                style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              />
              <input
                type="text"
                className="form-input"
                value={storeSettings.topbarBgColor || '#E0F2FE'}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarBgColor: e.target.value })
                }
                placeholder="#E0F2FE or linear-gradient(...)"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Top Bar Text & Link Color</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={storeSettings.topbarTextColor || '#1E293B'}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarTextColor: e.target.value })
                }
                style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              />
              <input
                type="text"
                className="form-input"
                value={storeSettings.topbarTextColor || '#1E293B'}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, topbarTextColor: e.target.value })
                }
                placeholder="#1E293B"
              />
            </div>
          </div>
        </div>

        {/* Live Topbar Color Preview Box */}
        <div style={{ marginTop: '14px' }}>
          <label className="form-label" style={{ marginBottom: '6px' }}>
            Live Header Topbar Preview:
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
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'inherit' }}>
              QuickEnquiry
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'inherit' }}>
              Search... 🔍
            </span>
          </div>
        </div>
      </div>

      {/* HERO SLIDE ADD/EDIT MODAL */}
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
    </div>
  )
}

export default React.memo(HomepageSettings)
