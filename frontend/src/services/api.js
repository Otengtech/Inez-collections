import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get guestId from localStorage
    const guestId = localStorage.getItem('guestId')
    if (guestId) {
      config.headers['X-Guest-ID'] = guestId
    }

    // Get admin token from localStorage
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      try {
        const parsed = JSON.parse(adminToken)
        if (parsed && parsed._id) {
          config.headers['X-Admin-ID'] = parsed._id
        }
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response
      
      // Handle specific status codes
      if (status === 401) {
        // Unauthorized - clear admin token if present
        localStorage.removeItem('adminToken')
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
      }
      
      if (status === 404) {
        console.error('Resource not found:', error.config.url)
      }
      
      if (status === 500) {
        console.error('Server error:', data)
      }
      
      // Return error with message
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data: data,
      })
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      })
    } else {
      // Something else happened
      console.error('Error:', error.message)
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred',
      })
    }
  }
)

// Helper methods
export const apiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  patch: (url, data = {}) => api.patch(url, data),
  delete: (url) => api.delete(url),
}

export default api