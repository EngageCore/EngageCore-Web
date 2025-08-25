import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }

    // Return a consistent error format
    const errorMessage =
      error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(errorMessage))
  }
)

export default api

// Helper functions for common HTTP methods
export const apiGet = (url, config = {}) => api.get(url, config)
export const apiPost = (url, data = {}, config = {}) =>
  api.post(url, data, config)
export const apiPut = (url, data = {}, config = {}) =>
  api.put(url, data, config)
export const apiDelete = (url, config = {}) => api.delete(url, config)
export const apiPatch = (url, data = {}, config = {}) =>
  api.patch(url, data, config)
