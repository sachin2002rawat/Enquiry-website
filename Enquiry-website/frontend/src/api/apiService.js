/**
 * Frontend API Service Layer for Enquiry Website MERN Stack
 * Communicates with Node.js Express Backend at http://localhost:5000/api
 * Features automatic fallback to localStorage/default JSONs if backend server is offline.
 */

const API_BASE_URL = 'http://localhost:5000/api'

// Helper for HTTP requests
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.warn(`[apiService] Backend unreachable at ${endpoint}, falling back to local client state:`, error.message)
    return null
  }
}

export const apiService = {
  // Check backend server health
  checkHealth: async () => {
    return await fetchAPI('/health')
  },

  // Products API
  getProducts: async () => {
    const data = await fetchAPI('/products')
    return data && data.success ? data.data : null
  },

  createProduct: async (productData) => {
    return await fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  },

  updateProduct: async (id, productData) => {
    return await fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  },

  deleteProduct: async (id) => {
    return await fetchAPI(`/products/${id}`, {
      method: 'DELETE'
    })
  },

  // Settings API
  getSettings: async () => {
    const data = await fetchAPI('/settings')
    return data && data.success ? data.data : null
  },

  updateSettings: async (settingsData) => {
    return await fetchAPI('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
  },

  // Enquiries API
  submitEnquiry: async (enquiryData) => {
    return await fetchAPI('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData)
    })
  },

  getEnquiries: async () => {
    const data = await fetchAPI('/enquiries')
    return data && data.success ? data.data : null
  },

  // Hero Slides API
  getHeroSlides: async () => {
    const data = await fetchAPI('/hero-slides')
    return data && data.success ? data.data : null
  },

  updateHeroSlides: async (slides) => {
    return await fetchAPI('/hero-slides', {
      method: 'PUT',
      body: JSON.stringify({ slides })
    })
  }
}

export default apiService
