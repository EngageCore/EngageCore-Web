import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref({
    id: '',
    name: '',
    email: '',
    points: 0,
    level: 1,
    levelName: 'Bronze',
    dailySpinsRemaining: 3
  })

  const isAuthenticated = ref(false)

  // Getters
  const userInfo = computed(() => user.value)
  const currentPoints = computed(() => user.value.points)
  const currentLevel = computed(() => user.value.level)
  const spinsRemaining = computed(() => user.value.dailySpinsRemaining)

  // Actions
  const setUser = userData => {
    user.value = { ...user.value, ...userData }
    isAuthenticated.value = true
  }

  const updatePoints = newPoints => {
    user.value.points = newPoints
  }

  const updateSpinsRemaining = spins => {
    user.value.dailySpinsRemaining = spins
  }

  const updateLevel = (level, levelName) => {
    user.value.level = level
    user.value.levelName = levelName
  }

  const logout = () => {
    user.value = {
      id: '',
      name: '',
      email: '',
      points: 0,
      level: 1,
      levelName: 'Bronze',
      dailySpinsRemaining: 3
    }
    isAuthenticated.value = false
  }

  return {
    // State
    user,
    isAuthenticated,
    // Getters
    userInfo,
    currentPoints,
    currentLevel,
    spinsRemaining,
    // Actions
    setUser,
    updatePoints,
    updateSpinsRemaining,
    updateLevel,
    logout
  }
})
