import { ref, readonly } from 'vue'

// Global state for page loader
const isLoading = ref(false)
const loadingTimeout = ref(null)

export function usePageLoader() {
  /**
   * Show the page loader
   * @param {number} minDuration - Minimum duration to show loader (in ms)
   */
  const showLoader = (minDuration = 500) => {
    isLoading.value = true
    
    // Clear any existing timeout
    if (loadingTimeout.value) {
      clearTimeout(loadingTimeout.value)
    }
    
    // Set minimum display duration
    loadingTimeout.value = setTimeout(() => {
      // This timeout ensures loader shows for at least minDuration
      // The actual hiding will be controlled by hideLoader()
    }, minDuration)
  }
  
  /**
   * Hide the page loader
   * @param {number} delay - Delay before hiding (in ms)
   */
  const hideLoader = (delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        isLoading.value = false
      }, delay)
    } else {
      isLoading.value = false
    }
    
    // Clear timeout
    if (loadingTimeout.value) {
      clearTimeout(loadingTimeout.value)
      loadingTimeout.value = null
    }
  }
  
  /**
   * Show loader for a specific duration
   * @param {number} duration - Duration to show loader (in ms)
   */
  const showLoaderFor = (duration = 1000) => {
    showLoader()
    setTimeout(() => {
      hideLoader()
    }, duration)
  }
  
  return {
    isLoading: readonly(isLoading),
    showLoader,
    hideLoader,
    showLoaderFor
  }
}

// Export for direct access if needed
export { isLoading }