import { ref, reactive, provide, inject } from 'vue'

// Global notification state
const notifications = ref([])
const maxNotifications = 5

// Generate unique ID for notifications
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Core notification management
const addNotification = (notification) => {
  const id = generateId()
  const newNotification = {
    id,
    showProgress: true,
    duration: 5000,
    ...notification
  }
  
  // Add to the beginning of the array (newest first)
  notifications.value.unshift(newNotification)
  
  // Limit the number of notifications
  if (notifications.value.length > maxNotifications) {
    notifications.value = notifications.value.slice(0, maxNotifications)
  }
  
  return id
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAllNotifications = () => {
  notifications.value = []
}

// Notification type methods
const showSuccess = (title, message = '', options = {}) => {
  return addNotification({
    type: 'success',
    title,
    message,
    duration: options.duration || 4000,
    showProgress: options.showProgress !== false,
    ...options
  })
}

const showError = (title, message = '', options = {}) => {
  return addNotification({
    type: 'error',
    title,
    message,
    duration: options.duration || 6000,
    showProgress: options.showProgress !== false,
    ...options
  })
}

const showWarning = (title, message = '', options = {}) => {
  return addNotification({
    type: 'warning',
    title,
    message,
    duration: options.duration || 5000,
    showProgress: options.showProgress !== false,
    ...options
  })
}

const showConfirmation = (title, message = '', options = {}) => {
  return new Promise((resolve, reject) => {
    const id = addNotification({
      type: 'confirmation',
      title,
      message,
      showProgress: false,
      onConfirm: () => {
        removeNotification(id)
        resolve(true)
      },
      onCancel: () => {
        removeNotification(id)
        resolve(false)
      },
      ...options
    })
  })
}

// Quick notification methods with predefined messages
const showQuickSuccess = (message) => {
  return showSuccess('Success!', message, { duration: 3000 })
}

const showQuickError = (message) => {
  return showError('Error!', message, { duration: 4000 })
}

const showQuickWarning = (message) => {
  return showWarning('Warning!', message, { duration: 4000 })
}

// Notification provider for app-wide usage
export const provideNotifications = () => {
  provide('notifications', notifications)
  provide('removeNotification', removeNotification)
  provide('clearAllNotifications', clearAllNotifications)
}

// Main composable
export const useNotification = () => {
  return {
    // State
    notifications,
    
    // Core methods
    addNotification,
    removeNotification,
    clearAllNotifications,
    
    // Type-specific methods
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
    
    // Quick methods
    showQuickSuccess,
    showQuickError,
    showQuickWarning,
    
    // Utility methods
    getNotificationCount: () => notifications.value.length,
    hasNotifications: () => notifications.value.length > 0,
    
    // Advanced methods
    showLoadingNotification: (title, message = 'Please wait...') => {
      return addNotification({
        type: 'warning',
        title,
        message,
        showProgress: false,
        duration: 0 // Manual dismiss only
      })
    },
    
    updateNotification: (id, updates) => {
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        Object.assign(notification, updates)
      }
    },
    
    // Batch operations
    showMultiple: (notificationList) => {
      const ids = []
      notificationList.forEach((notification, index) => {
        setTimeout(() => {
          const id = addNotification(notification)
          ids.push(id)
        }, index * 200) // Stagger notifications
      })
      return ids
    }
  }
}

// Inject notifications (for components)
export const useNotificationContainer = () => {
  const notifications = inject('notifications', ref([]))
  const removeNotification = inject('removeNotification', () => {})
  const clearAllNotifications = inject('clearAllNotifications', () => {})
  
  return {
    notifications,
    removeNotification,
    clearAllNotifications
  }
}

// Export for direct usage without composable
export {
  showSuccess,
  showError,
  showWarning,
  showConfirmation,
  showQuickSuccess,
  showQuickError,
  showQuickWarning,
  clearAllNotifications
}

// Default export
export default useNotification