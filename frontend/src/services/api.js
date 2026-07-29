// api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Check if it's an admin route
    const isAdminRoute = config.url.includes('/admin/')
    
    if (isAdminRoute) {
      // For admin routes, only send admin token
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
      // Don't send guest ID for admin routes
    } else {
      // For non-admin routes, send guest ID
      const guestId = localStorage.getItem('guestId')
      if (guestId) {
        config.headers['X-Guest-ID'] = guestId
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
      const { status, data } = error.response
      
      if (status === 401) {
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
      
      return Promise.reject({
        status,
        message: data?.message || 'An error occurred',
        data: data,
      })
    } else if (error.request) {
      console.error('Network Error:', error.request)
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      })
    } else {
      console.error('Error:', error.message)
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred',
      })
    }
  }
)

export const apiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  patch: (url, data = {}) => api.patch(url, data),
  delete: (url) => api.delete(url),
}

export default api