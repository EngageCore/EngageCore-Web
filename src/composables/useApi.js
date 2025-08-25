import { ref } from 'vue'

export const useApi = () => {
  const loading = ref(false)
  const error = ref(null)

  const request = async apiCall => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      return result
    } catch (err) {
      error.value = err.message || 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    loading,
    error,
    request,
    clearError
  }
}

// Specialized hook for handling multiple API calls
export const useApiQueue = () => {
  const loading = ref(false)
  const errors = ref([])
  const results = ref([])

  const executeQueue = async apiCalls => {
    loading.value = true
    errors.value = []
    results.value = []

    try {
      const promises = apiCalls.map(async (apiCall, index) => {
        try {
          const result = await apiCall()
          results.value[index] = result
          return result
        } catch (error) {
          errors.value[index] = error.message || 'An error occurred'
          throw error
        }
      })

      await Promise.allSettled(promises)
      return results.value
    } finally {
      loading.value = false
    }
  }

  const clearErrors = () => {
    errors.value = []
  }

  const clearResults = () => {
    results.value = []
  }

  return {
    loading,
    errors,
    results,
    executeQueue,
    clearErrors,
    clearResults
  }
}
