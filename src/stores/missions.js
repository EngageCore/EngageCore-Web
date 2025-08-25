import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMissionStore = defineStore('missions', () => {
  // State
  const availableMissions = ref([
    {
      id: '1',
      title: 'Daily Login',
      description: 'Login to the platform',
      type: 'daily',
      reward: { points: 10 },
      progress: 0,
      target: 1,
      status: 'available',
      expiresAt: null
    },
    {
      id: '2',
      title: 'Spin the Wheel',
      description: 'Use all daily spins',
      type: 'daily',
      reward: { points: 25 },
      progress: 0,
      target: 3,
      status: 'available',
      expiresAt: null
    },
    {
      id: '3',
      title: 'Weekly Warrior',
      description: 'Complete 5 daily missions this week',
      type: 'weekly',
      reward: { points: 100 },
      progress: 0,
      target: 5,
      status: 'available',
      expiresAt: null
    }
  ])

  const completedMissions = ref([])
  const missionProgress = ref({})
  const isLoading = ref(false)

  // Getters
  const dailyMissions = computed(() =>
    availableMissions.value.filter(mission => mission.type === 'daily')
  )

  const weeklyMissions = computed(() =>
    availableMissions.value.filter(mission => mission.type === 'weekly')
  )

  const monthlyMissions = computed(() =>
    availableMissions.value.filter(mission => mission.type === 'monthly')
  )

  const completableMissions = computed(() =>
    availableMissions.value.filter(
      mission =>
        mission.progress >= mission.target && mission.status === 'available'
    )
  )

  const totalPointsEarned = computed(() =>
    completedMissions.value.reduce(
      (total, mission) => total + (mission.reward?.points || 0),
      0
    )
  )

  // Actions
  const setLoading = loading => {
    isLoading.value = loading
  }

  const updateMissionProgress = (missionId, progress) => {
    const mission = availableMissions.value.find(m => m.id === missionId)
    if (mission) {
      mission.progress = Math.min(progress, mission.target)
      if (mission.progress >= mission.target) {
        mission.status = 'completed'
      }
    }
  }

  const claimMission = missionId => {
    const missionIndex = availableMissions.value.findIndex(
      m => m.id === missionId
    )
    if (missionIndex !== -1) {
      const mission = availableMissions.value[missionIndex]
      if (mission.status === 'completed') {
        mission.status = 'claimed'
        completedMissions.value.push({
          ...mission,
          claimedAt: new Date().toISOString()
        })
        return mission.reward
      }
    }
    return null
  }

  const resetDailyMissions = () => {
    availableMissions.value.forEach(mission => {
      if (mission.type === 'daily') {
        mission.progress = 0
        mission.status = 'available'
      }
    })
  }

  const setMissions = missions => {
    availableMissions.value = missions
  }

  const setCompletedMissions = missions => {
    completedMissions.value = missions
  }

  const addMission = mission => {
    availableMissions.value.push(mission)
  }

  return {
    // State
    availableMissions,
    completedMissions,
    missionProgress,
    isLoading,
    // Getters
    dailyMissions,
    weeklyMissions,
    monthlyMissions,
    completableMissions,
    totalPointsEarned,
    // Actions
    setLoading,
    updateMissionProgress,
    claimMission,
    resetDailyMissions,
    setMissions,
    setCompletedMissions,
    addMission
  }
})
