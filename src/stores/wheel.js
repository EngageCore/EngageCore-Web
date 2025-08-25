import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWheelStore = defineStore('wheel', () => {
  // State
  const wheelPrizes = ref([
    {
      id: '1',
      name: '10 Points',
      value: 10,
      color: '#3B82F6',
      probability: 30
    },
    {
      id: '2',
      name: '25 Points',
      value: 25,
      color: '#10B981',
      probability: 25
    },
    {
      id: '3',
      name: '50 Points',
      value: 50,
      color: '#F59E0B',
      probability: 20
    },
    {
      id: '4',
      name: '100 Points',
      value: 100,
      color: '#EF4444',
      probability: 15
    },
    {
      id: '5',
      name: '200 Points',
      value: 200,
      color: '#8B5CF6',
      probability: 8
    },
    {
      id: '6',
      name: '500 Points',
      value: 500,
      color: '#EC4899',
      probability: 2
    }
  ])

  const spinHistory = ref([])
  const isSpinning = ref(false)
  const lastSpinResult = ref(null)
  const dailySpinsRemaining = ref(3)

  // Getters
  const canSpin = computed(
    () => dailySpinsRemaining.value > 0 && !isSpinning.value
  )
  const totalSpins = computed(() => spinHistory.value.length)
  const totalPointsWon = computed(() =>
    spinHistory.value.reduce((total, spin) => total + spin.prizeValue, 0)
  )

  // Actions
  const setSpinning = spinning => {
    isSpinning.value = spinning
  }

  const setSpinResult = result => {
    lastSpinResult.value = result
    // Add to history
    spinHistory.value.unshift({
      id: Date.now().toString(),
      prizeId: result.prizeId,
      prizeName: result.prizeName,
      prizeValue: result.prizeValue,
      spinDate: new Date().toISOString()
    })
    // Update remaining spins
    if (dailySpinsRemaining.value > 0) {
      dailySpinsRemaining.value--
    }
  }

  const updateSpinsRemaining = spins => {
    dailySpinsRemaining.value = spins
  }

  const resetDailySpins = () => {
    dailySpinsRemaining.value = 3
  }

  const clearSpinResult = () => {
    lastSpinResult.value = null
  }

  const setSpinHistory = history => {
    spinHistory.value = history
  }

  return {
    // State
    wheelPrizes,
    spinHistory,
    isSpinning,
    lastSpinResult,
    dailySpinsRemaining,
    // Getters
    canSpin,
    totalSpins,
    totalPointsWon,
    // Actions
    setSpinning,
    setSpinResult,
    updateSpinsRemaining,
    resetDailySpins,
    clearSpinResult,
    setSpinHistory
  }
})
