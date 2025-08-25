import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useApi } from './useApi.js'
import { mockUserService } from '@/services/userService.js'
import { storeToRefs } from 'pinia'

export const useAuth = () => {
  const userStore = useUserStore()
  const { request, loading, error } = useApi()

  // Get reactive references from store
  const { user, isAuthenticated } = storeToRefs(userStore)

  // Local state
  const loginForm = ref({
    email: '',
    password: ''
  })

  // Computed properties
  const isLoggedIn = computed(() => isAuthenticated.value)
  const currentUser = computed(() => user.value)
  const hasAuthToken = computed(() => {
    return !!localStorage.getItem('auth_token')
  })

  // Actions
  const login = async credentials => {
    try {
      const result = await request(() => mockUserService.login(credentials))

      if (result.success) {
        // Set user data in store
        userStore.setUser(result.data.user)

        // Load user profile after login
        await loadUserProfile()

        return {
          success: true,
          user: result.data.user
        }
      } else {
        throw new Error(result.error || 'Login failed')
      }
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await request(() => mockUserService.logout())

      // Clear user data from store
      userStore.logout()

      return { success: true }
    } catch (err) {
      // Even if logout request fails, clear local data
      userStore.logout()
      console.error('Logout error:', err)
      return { success: true } // Don't throw error for logout
    }
  }

  const loadUserProfile = async () => {
    try {
      const result = await request(() => mockUserService.getProfile())

      if (result.success) {
        userStore.setUser(result.data)
        return result.data
      } else {
        throw new Error(result.error || 'Failed to load profile')
      }
    } catch (err) {
      console.error('Failed to load user profile:', err)
      throw err
    }
  }

  const updateProfile = async profileData => {
    try {
      const result = await request(() =>
        mockUserService.updateProfile(profileData)
      )

      if (result.success) {
        // Update user data in store
        userStore.setUser({ ...user.value, ...profileData })
        return result.data
      } else {
        throw new Error(result.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
      throw err
    }
  }

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      userStore.logout()
      return false
    }

    try {
      // Verify token by loading user profile
      await loadUserProfile()
      return true
    } catch (err) {
      // Token is invalid, clear it
      localStorage.removeItem('auth_token')
      userStore.logout()
      return false
    }
  }

  const initializeAuth = async () => {
    const token = localStorage.getItem('auth_token')

    if (token) {
      try {
        await loadUserProfile()
      } catch (err) {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token')
        userStore.logout()
      }
    }
  }

  // Utility functions
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = password => {
    return password.length >= 6
  }

  const validateLoginForm = () => {
    const errors = []

    if (!loginForm.value.email) {
      errors.push('Email is required')
    } else if (!validateEmail(loginForm.value.email)) {
      errors.push('Please enter a valid email address')
    }

    if (!loginForm.value.password) {
      errors.push('Password is required')
    } else if (!validatePassword(loginForm.value.password)) {
      errors.push('Password must be at least 6 characters long')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const clearLoginForm = () => {
    loginForm.value = {
      email: '',
      password: ''
    }
  }

  const getUserDisplayName = () => {
    if (!user.value) return 'Guest'
    return user.value.name || user.value.email || 'User'
  }

  const getUserInitials = () => {
    if (!user.value || !user.value.name) return 'U'
    return user.value.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  const getLevelBadgeColor = level => {
    const colors = {
      1: 'bg-amber-100 text-amber-800', // Bronze
      2: 'bg-gray-100 text-gray-800', // Silver
      3: 'bg-yellow-100 text-yellow-800', // Gold
      4: 'bg-purple-100 text-purple-800', // Platinum
      5: 'bg-blue-100 text-blue-800' // Diamond
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  return {
    // State
    user,
    isAuthenticated,
    loginForm,
    loading,
    error,

    // Computed
    isLoggedIn,
    currentUser,
    hasAuthToken,

    // Actions
    login,
    logout,
    loadUserProfile,
    updateProfile,
    checkAuthStatus,
    initializeAuth,

    // Utilities
    validateEmail,
    validatePassword,
    validateLoginForm,
    clearLoginForm,
    getUserDisplayName,
    getUserInitials,
    getLevelBadgeColor
  }
}
