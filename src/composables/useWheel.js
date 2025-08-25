import { ref, computed } from 'vue'
import { useWheelStore } from '@/stores/wheel.js'
import { useUserStore } from '@/stores/user.js'
import { useApi } from './useApi.js'
import { mockWheelService } from '@/services/wheelService.js'
import { storeToRefs } from 'pinia'

export const useWheel = () => {
  const wheelStore = useWheelStore()
  const userStore = useUserStore()
  const { request, loading, error } = useApi()

  // Get reactive references from stores
  const {
    wheelPrizes,
    spinHistory,
    isSpinning,
    lastSpinResult,
    dailySpinsRemaining,
    canSpin,
    totalSpins,
    totalPointsWon
  } = storeToRefs(wheelStore)

  // Computed properties
  const spinButtonText = computed(() => {
    if (isSpinning.value) return 'Spinning...'
    if (dailySpinsRemaining.value === 0) return 'No Spins Left'
    return `Spin (${dailySpinsRemaining.value} left)`
  })

  const spinButtonDisabled = computed(() => {
    return !canSpin.value || isSpinning.value
  })

  // Actions
  const loadWheelStatus = async () => {
    try {
      const result = await request(() => mockWheelService.getWheelStatus())
      if (result.success) {
        wheelStore.updateSpinsRemaining(result.data.dailySpinsRemaining)
        // Update user store with remaining spins
        userStore.updateSpinsRemaining(result.data.dailySpinsRemaining)
      }
      return result
    } catch (err) {
      console.error('Failed to load wheel status:', err)
      throw err
    }
  }

  const spin = async () => {
    if (!canSpin.value) {
      throw new Error('Cannot spin: no spins remaining or already spinning')
    }

    try {
      wheelStore.setSpinning(true)

      const result = await request(() => mockWheelService.spin())

      if (result.success) {
        // Update wheel store with spin result
        wheelStore.setSpinResult(result.data)

        // Update user store with new points and remaining spins
        userStore.updatePoints(result.data.newBalance)
        userStore.updateSpinsRemaining(wheelStore.dailySpinsRemaining)

        return result.data
      } else {
        throw new Error(result.error || 'Spin failed')
      }
    } catch (err) {
      console.error('Spin failed:', err)
      throw err
    } finally {
      wheelStore.setSpinning(false)
    }
  }

  const loadSpinHistory = async (page = 1, limit = 10) => {
    try {
      const result = await request(() =>
        mockWheelService.getSpinHistory(page, limit)
      )
      if (result.success) {
        wheelStore.setSpinHistory(result.data.history || [])
      }
      return result
    } catch (err) {
      console.error('Failed to load spin history:', err)
      throw err
    }
  }

  const clearSpinResult = () => {
    wheelStore.clearSpinResult()
  }

  const resetDailySpins = () => {
    wheelStore.resetDailySpins()
    userStore.updateSpinsRemaining(3)
  }

  // Utility functions
  const formatSpinDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getSpinResultMessage = result => {
    if (!result) return ''
    return `Congratulations! You won ${result.prizeName}!`
  }

  const calculateWheelRotation = prizeId => {
    const prizeIndex = wheelPrizes.value.findIndex(
      prize => prize.id === prizeId
    )
    if (prizeIndex === -1) return 0

    const segmentAngle = 360 / wheelPrizes.value.length
    const baseRotation = 360 * 5 // Multiple full rotations for effect
    const targetAngle = segmentAngle * prizeIndex

    return baseRotation + (360 - targetAngle)
  }

  return {
    // State
    wheelPrizes,
    spinHistory,
    isSpinning,
    lastSpinResult,
    dailySpinsRemaining,
    loading,
    error,

    // Computed
    canSpin,
    totalSpins,
    totalPointsWon,
    spinButtonText,
    spinButtonDisabled,

    // Actions
    loadWheelStatus,
    spin,
    loadSpinHistory,
    clearSpinResult,
    resetDailySpins,

    // Utilities
    formatSpinDate,
    getSpinResultMessage,
    calculateWheelRotation
  }
}
