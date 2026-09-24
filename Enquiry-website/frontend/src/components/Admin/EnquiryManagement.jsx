import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  FiSearch,
  FiMail,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiEye,
  FiX,
  FiRefreshCw,
  FiDownload,
  FiSend,
  FiInbox
} from 'react-icons/fi'
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa'
import { apiService } from '../../api/apiService'

const LOCAL_KEY_ENQUIRIES = 'enquiry_admin_customer_enquiries'

const defaultEnquiriesList = [
  {
    _id: 'enq-101',
    id: 101,
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98234 56789',
    productName: 'Kitchen King Masala',
    message: 'Hello, we run a chain of 4 restaurants in Pune. We are interested in procuring 50kg bulk packs of Kitchen King Masala every month. Please share your wholesale price sheet and delivery schedule.',
    status: 'New',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    _id: 'enq-102',
    id: 102,
    name: 'Pooja Agarwal',
    email: 'pooja.agarwal@outlook.com',
    phone: '+91 98112 34567',
    productName: 'Chaat Masala',
    message: 'Looking for distributor opportunities in Delhi NCR. Could you please send product samples and distributor margin details for Pure Spices and Mix Masala ranges?',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString() // 14 hours ago
  },
  {
    _id: 'enq-103',
    id: 103,
    name: 'Anand Kulkarni',
    email: 'anand.k@foodmart.in',
    phone: '+91 99778 12345',
    productName: 'Garam Masala',
    message: 'We are expanding our retail supermarket shelves in Bangalore and want to stock your 100g and 200g Garam Masala pouches. Need confirmation on shelf-life and MOQ.',
    status: 'Completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'enq-104',
    id: 104,
    name: 'Dr. Sunita Sen',
    email: 'sunita.sen@wellness.org',
    phone: '+91 97456 78901',
    productName: 'Organic Turmeric Powder',
    message: 'Does your turmeric powder contain high curcumin level (above 4%)? Need lab test certification for organic wellness manufacturing.',
    status: 'New',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  },
  {
    _id: 'enq-105',
    id: 105,
    name: 'Harpreet Singh',
    email: 'harpreet.singh@caterers.com',
    phone: '+91 98881 23456',
    productName: 'Pav Bhaji Masala',
    message: 'Need 100 units urgently for upcoming wedding catering event in Chandigarh next weekend. Please call back immediately to confirm dispatch.',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString()
  }
]

const EnquiryManagement = ({ showToast }) => {
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY_ENQUIRIES)
      return saved ? JSON.parse(saved) : defaultEnquiriesList
    } catch {
      return defaultEnquiriesList
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // Fetch enquiries from MongoDB API
  const fetchEnquiries = async () => {
    setIsLoading(true)
    try {
      const remote = await apiService.getEnquiries()
      if (remote && Array.isArray(remote) && remote.length > 0) {
        setEnquiries(remote)
        localStorage.setItem(LOCAL_KEY_ENQUIRIES, JSON.stringify(remote))
      }
    } catch (err) {
      console.warn('[EnquiryManagement] Fetching from API fallback to local:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  // KPI Counts
  const stats = useMemo(() => {
    const total = enquiries.length
    const newCount = enquiries.filter((e) => (e.status || 'New').toLowerCase() === 'new').length
    const progressCount = enquiries.filter((e) => (e.status || '').toLowerCase() === 'in progress').length
    const completedCount = enquiries.filter((e) => ['completed', 'closed'].includes((e.status || '').toLowerCase())).length

    return { total, newCount, progressCount, completedCount }
  }, [enquiries])

  // Filtered List
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const currentStatus = (item.status || 'New').toLowerCase()
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'NEW' && currentStatus === 'new') ||
        (statusFilter === 'IN_PROGRESS' && currentStatus === 'in progress') ||
        (statusFilter === 'COMPLETED' && (currentStatus === 'completed' || currentStatus === 'closed'))

      const term = searchTerm.trim().toLowerCase()
      if (!term) return matchesStatus

      const matchesSearch =
        (item.name || '').toLowerCase().includes(term) ||
        (item.email || '').toLowerCase().includes(term) ||
        (item.phone || '').toLowerCase().includes(term) ||
        (item.productName || '').toLowerCase().includes(term) ||
        (item.message || '').toLowerCase().includes(term)

      return matchesStatus && matchesSearch
    })
  }, [enquiries, statusFilter, searchTerm])

  // Update Status handler
  const handleStatusChange = async (enquiryId, newStatus) => {
    const updated = enquiries.map((e) =>
      (e._id === enquiryId || e.id === enquiryId) ? { ...e, status: newStatus } : e
    )
    setEnquiries(updated)
    localStorage.setItem(LOCAL_KEY_ENQUIRIES, JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))

    if (selectedEnquiry && (selectedEnquiry._id === enquiryId || selectedEnquiry.id === enquiryId)) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }))
    }

    try {
      await apiService.updateEnquiryStatus(enquiryId, newStatus)
    } catch {
      // local update already handled
    }

    showToast(`Enquiry marked as "${newStatus}"!`)
  }

  // Delete enquiry handler
  const handleDeleteEnquiry = (enquiryId) => {
    const updated = enquiries.filter((e) => e._id !== enquiryId && e.id !== enquiryId)
    setEnquiries(updated)
    localStorage.setItem(LOCAL_KEY_ENQUIRIES, JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    setDeleteId(null)
    if (selectedEnquiry && (selectedEnquiry._id === enquiryId || selectedEnquiry.id === enquiryId)) {
      setSelectedEnquiry(null)
    }
    showToast('Enquiry deleted successfully!')
  }

  // WhatsApp quick reply
  const handleReplyWhatsApp = (enquiry) => {
    const phone = (enquiry.phone || '').replace(/[^0-9]/g, '')
    const greeting = encodeURIComponent(
      `Hello ${enquiry.name}, thank you for your enquiry regarding "${enquiry.productName}" on QuickEnquiry! We would love to assist you with the details.`
    )
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${greeting}`, '_blank')
    } else {
      window.open(`https://wa.me/?text=${greeting}`, '_blank')
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    if (enquiries.length === 0) return
    const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Product', 'Status', 'Date', 'Message']
    const rows = enquiries.map((e) => [
      `"${e._id || e.id}"`,
      `"${e.name || ''}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.productName || ''}"`,
      `"${e.status || 'New'}"`,
      `"${new Date(e.createdAt || Date.now()).toLocaleDateString()}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `customer_enquiries_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported enquiries to CSV file!')
  }

  const getStatusBadge = (status) => {
    const s = (status || 'New').toLowerCase()
    if (s === 'new') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#B45309' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706' }}></span>
          New
        </span>
      )
    }
    if (s === 'in progress') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#E0F2FE', color: '#0284C7' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284C7' }}></span>
          In Progress
        </span>
      )
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
        Completed
      </span>
    )
  }

  return (
    <div className="enquiry-management-container">
      {/* 1. TOP STATS CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeft: '4px solid #EA580C' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#FFEDD5', color: '#EA580C' }}>
            <FaCommentDots size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Total Enquiries</span>
            <span className="kpi-value">{stats.total}</span>
            <span className="kpi-meta" style={{ color: '#EA580C' }}>All time customer requests</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <FiAlertCircle size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">New / Pending</span>
            <span className="kpi-value">{stats.newCount}</span>
            <span className="kpi-meta" style={{ color: '#D97706' }}>Requires follow-up response</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>
            <FiClock size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">In Progress</span>
            <span className="kpi-value">{stats.progressCount}</span>
            <span className="kpi-meta" style={{ color: '#0284C7' }}>Being handled by sales team</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #16A34A' }}>
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
            <FiCheckCircle size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Resolved / Closed</span>
            <span className="kpi-value">{stats.completedCount}</span>
            <span className="kpi-meta" style={{ color: '#16A34A' }}>Quotation sent or closed</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN ENQUIRIES CARD */}
      <div className="admin-card">
        {/* Header with Title and Global Actions */}
        <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="card-title-group">
            <div className="card-title-icon-wrapper" style={{ backgroundColor: '#FFEDD5', color: '#EA580C' }}>
              <FaCommentDots className="card-title-icon" size={20} />
            </div>
            <div>
              <div className="card-title-row">
                <h2 className="card-title">Customer Enquiries & Quotation Requests</h2>
                <span className="live-count-badge" style={{ backgroundColor: '#FFEDD5', color: '#EA580C' }}>
                  {filteredEnquiries.length} Enquiries
                </span>
              </div>
              <p className="card-subtitle">
                Review and respond to customer product enquiries, bulk quote submissions, and distribution leads.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={fetchEnquiries}
              disabled={isLoading}
              title="Refresh enquiries"
              style={{ fontSize: '0.82rem', padding: '7px 12px' }}
            >
              <FiRefreshCw size={14} className={isLoading ? 'spin' : ''} /> {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportCSV}
              title="Download CSV report"
              style={{ fontSize: '0.82rem', padding: '7px 12px' }}
            >
              <FiDownload size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'ALL', label: `All (${stats.total})` },
              { id: 'NEW', label: `New (${stats.newCount})` },
              { id: 'IN_PROGRESS', label: `In Progress (${stats.progressCount})` },
              { id: 'COMPLETED', label: `Completed (${stats.completedCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: statusFilter === tab.id ? '#FFFFFF' : 'transparent',
                  color: statusFilter === tab.id ? '#0F172A' : '#64748B',
                  boxShadow: statusFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <FiSearch
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
              placeholder="Search by name, email, product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 3. ENQUIRIES TABLE */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--admin-card-border)', borderRadius: '12px', background: '#FFFFFF' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--admin-card-border)', fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Contact</th>
                <th style={{ padding: '12px 16px' }}>Product Inquired</th>
                <th style={{ padding: '12px 16px', maxWidth: '280px' }}>Message Preview</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enq) => {
                const enqId = enq._id || enq.id
                const dateStr = enq.createdAt
                  ? new Date(enq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Recent'

                return (
                  <tr
                    key={enqId}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: enq.status === 'New' ? 'rgba(254, 243, 199, 0.15)' : '#FFFFFF'
                    }}
                  >
                    {/* Customer Name & Avatar */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#FFEDD5',
                            color: '#EA580C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            flexShrink: 0
                          }}
                        >
                          {(enq.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--admin-text-main)', fontSize: '0.9rem' }}>
                            {enq.name || 'Anonymous Customer'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <a
                          href={`mailto:${enq.email}`}
                          style={{ color: '#0284C7', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          <FiMail size={12} /> {enq.email}
                        </a>
                        {enq.phone && (
                          <div style={{ color: '#64748B', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiPhone size={12} /> {enq.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: '#F1F5F9',
                          color: '#334155'
                        }}
                      >
                        {enq.productName || 'General Enquiry'}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                      <p
                        onClick={() => setSelectedEnquiry(enq)}
                        style={{
                          margin: 0,
                          fontSize: '0.82rem',
                          color: '#475569',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer'
                        }}
                        title="Click to read full message"
                      >
                        {enq.message || 'No additional message text.'}
                      </p>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {dateStr}
                    </td>

                    {/* Status Select */}
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={enq.status || 'New'}
                        onChange={(e) => handleStatusChange(enqId, e.target.value)}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => setSelectedEnquiry(enq)}
                          title="View Details"
                          style={{ color: '#0284C7' }}
                        >
                          <FiEye size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleReplyWhatsApp(enq)}
                          title="Reply on WhatsApp"
                          style={{ color: '#22C55E' }}
                        >
                          <FaWhatsapp size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => setDeleteId(enqId)}
                          title="Delete Enquiry"
                          style={{ color: '#EF4444' }}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredEnquiries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
              <FiInbox size={38} color="#CBD5E1" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--admin-text-main)' }}>No enquiries found</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No customer submissions match your filter or search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. ENQUIRY DETAILS MODAL */}
      {selectedEnquiry &&
        createPortal(
          <div className="modal-overlay" style={{ zIndex: 10000 }}>
            <div className="modal-card" style={{ maxWidth: '580px', width: '92%' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--admin-card-border)', padding: '18px 22px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 className="modal-title" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      Enquiry Details
                    </h3>
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Received on {new Date(selectedEnquiry.createdAt || Date.now()).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Customer Details Box */}
                <div style={{ padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Customer Information
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    {selectedEnquiry.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.86rem' }}>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      style={{ color: '#0284C7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FiMail size={14} /> {selectedEnquiry.email}
                    </a>
                    {selectedEnquiry.phone && (
                      <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiPhone size={14} /> {selectedEnquiry.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Box */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Product Enquired
                  </div>
                  <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: '0.9rem' }}>
                    {selectedEnquiry.productName || 'General Enquiry'}
                  </div>
                </div>

                {/* Full Message */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Customer Message
                  </div>
                  <div
                    style={{
                      padding: '14px 16px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      color: '#1E293B',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {selectedEnquiry.message || 'No additional message was provided by customer.'}
                  </div>
                </div>

                {/* Change Status Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                    Update Lead Status:
                  </span>
                  <select
                    value={selectedEnquiry.status || 'New'}
                    onChange={(e) => handleStatusChange(selectedEnquiry._id || selectedEnquiry.id, e.target.value)}
                    className="form-input"
                    style={{ width: '160px', padding: '6px 10px', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="modal-footer" style={{ padding: '14px 22px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                  onClick={() => setDeleteId(selectedEnquiry._id || selectedEnquiry.id)}
                >
                  <FiTrash2 size={15} /> Delete Lead
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ backgroundColor: '#22C55E', borderColor: '#22C55E', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleReplyWhatsApp(selectedEnquiry)}
                  >
                    <FaWhatsapp size={16} /> WhatsApp Reply
                  </button>

                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Regarding your enquiry about ${encodeURIComponent(selectedEnquiry.productName || 'our products')}&body=Dear ${encodeURIComponent(selectedEnquiry.name)},%0D%0A%0D%0AThank you for contacting QuickEnquiry!`}
                    className="btn-primary"
                    style={{ backgroundColor: '#0284C7', borderColor: '#0284C7', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                  >
                    <FiSend size={15} /> Email Reply
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {deleteId !== null &&
        createPortal(
          <div className="modal-overlay" style={{ zIndex: 10000 }}>
            <div className="modal-card" style={{ maxWidth: '400px' }}>
              <div className="modal-header">
                <h3 className="modal-title" style={{ color: '#EF4444' }}>Delete Enquiry?</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setDeleteId(null)}
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="modal-body" style={{ padding: '16px 20px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                  Are you sure you want to permanently delete this customer enquiry? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer" style={{ padding: '12px 20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}
                  onClick={() => handleDeleteEnquiry(deleteId)}
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

export default React.memo(EnquiryManagement)
