import { ref, computed } from 'vue'
import { useMissionStore } from '@/stores/missions.js'
import { useUserStore } from '@/stores/user.js'
import { useApi } from './useApi.js'
import { mockMissionService } from '@/services/missionService.js'
import { storeToRefs } from 'pinia'

export const useMissions = () => {
  const missionStore = useMissionStore()
  const userStore = useUserStore()
  const { request, loading, error } = useApi()

  // Get reactive references from stores
  const {
    availableMissions,
    completedMissions,
    missionProgress,
    isLoading,
    dailyMissions,
    weeklyMissions,
    monthlyMissions,
    completableMissions,
    totalPointsEarned
  } = storeToRefs(missionStore)

  // Computed properties
  const missionStats = computed(() => {
    const total = availableMissions.value.length
    const completed = availableMissions.value.filter(
      m => m.status === 'completed' || m.status === 'claimed'
    ).length
    const available = availableMissions.value.filter(
      m => m.status === 'available'
    ).length
    const claimable = completableMissions.value.length

    return {
      total,
      completed,
      available,
      claimable,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  })

  const missionsByType = computed(() => {
    return {
      daily: dailyMissions.value,
      weekly: weeklyMissions.value,
      monthly: monthlyMissions.value
    }
  })

  // Actions
  const loadMissions = async () => {
    try {
      missionStore.setLoading(true)
      const result = await request(() => mockMissionService.getMissions())

      if (result.success) {
        missionStore.setMissions(result.data.missions || [])
        missionStore.setCompletedMissions(result.data.completedMissions || [])
      }

      return result
    } catch (err) {
      console.error('Failed to load missions:', err)
      throw err
    } finally {
      missionStore.setLoading(false)
    }
  }

  const claimMission = async missionId => {
    try {
      const result = await request(() =>
        mockMissionService.claimMission(missionId)
      )

      if (result.success && result.data.success) {
        // Update mission status in store
        const reward = missionStore.claimMission(missionId)

        // Update user points
        if (reward && reward.points) {
          const currentPoints = userStore.currentPoints
          userStore.updatePoints(currentPoints + reward.points)
        }

        return {
          success: true,
          reward: result.data.reward,
          newBalance: result.data.newBalance
        }
      } else {
        throw new Error(result.error || 'Failed to claim mission')
      }
    } catch (err) {
      console.error('Failed to claim mission:', err)
      throw err
    }
  }

  const updateMissionProgress = async (missionId, progress) => {
    try {
      // Update local store immediately for better UX
      missionStore.updateMissionProgress(missionId, progress)

      // Sync with backend
      const result = await request(() =>
        mockMissionService.updateMissionProgress(missionId, progress)
      )

      if (!result.success) {
        // Revert local changes if backend fails
        console.error('Failed to sync mission progress with backend')
      }

      return result
    } catch (err) {
      console.error('Failed to update mission progress:', err)
      throw err
    }
  }

  const loadMissionHistory = async (page = 1, limit = 10) => {
    try {
      const result = await request(() =>
        mockMissionService.getMissionHistory(page, limit)
      )
      return result
    } catch (err) {
      console.error('Failed to load mission history:', err)
      throw err
    }
  }

  const resetDailyMissions = () => {
    missionStore.resetDailyMissions()
  }

  // Utility functions
  const getMissionTypeColor = type => {
    const colors = {
      daily: 'bg-blue-100 text-blue-800',
      weekly: 'bg-green-100 text-green-800',
      monthly: 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getMissionIcon = type => {
    const icons = {
      daily: '🌅',
      weekly: '📅',
      monthly: '🗓️'
    }
    return icons[type] || '📋'
  }

  const formatMissionProgress = mission => {
    const percentage = Math.round((mission.progress / mission.target) * 100)
    return {
      percentage: Math.min(percentage, 100),
      text: `${mission.progress}/${mission.target}`,
      isComplete: mission.progress >= mission.target
    }
  }

  const getMissionStatusText = mission => {
    switch (mission.status) {
      case 'available':
        return mission.progress >= mission.target
          ? 'Ready to Claim'
          : 'In Progress'
      case 'completed':
        return 'Completed'
      case 'claimed':
        return 'Claimed'
      default:
        return 'Unknown'
    }
  }

  const getMissionStatusColor = mission => {
    switch (mission.status) {
      case 'available':
        return mission.progress >= mission.target
          ? 'text-green-600'
          : 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      case 'claimed':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatTimeRemaining = expiresAt => {
    if (!expiresAt) return null

    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h remaining`

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes}m remaining`
  }

  return {
    // State
    availableMissions,
    completedMissions,
    missionProgress,
    isLoading,
    loading,
    error,

    // Computed
    dailyMissions,
    weeklyMissions,
    monthlyMissions,
    completableMissions,
    totalPointsEarned,
    missionStats,
    missionsByType,

    // Actions
    loadMissions,
    claimMission,
    updateMissionProgress,
    loadMissionHistory,
    resetDailyMissions,

    // Utilities
    getMissionTypeColor,
    getMissionIcon,
    formatMissionProgress,
    getMissionStatusText,
    getMissionStatusColor,
    formatTimeRemaining
  }
}
