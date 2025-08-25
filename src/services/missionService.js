import { apiGet, apiPost } from './api.js'

export const missionService = {
  // Get all missions
  async getMissions() {
    try {
      const response = await apiGet('/missions')
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Claim mission reward
  async claimMission(missionId) {
    try {
      const response = await apiPost(`/missions/${missionId}/claim`)
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get mission history
  async getMissionHistory(page = 1, limit = 10) {
    try {
      const response = await apiGet(
        `/missions/history?page=${page}&limit=${limit}`
      )
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Update mission progress
  async updateMissionProgress(missionId, progress) {
    try {
      const response = await apiPost(`/missions/${missionId}/progress`, {
        progress
      })
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Mock data for development (remove when backend is ready)
export const mockMissionService = {
  async getMissions() {
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        missions: [
          {
            id: '1',
            title: 'Daily Login',
            description: 'Login to the platform',
            type: 'daily',
            reward: { points: 10 },
            progress: 1,
            target: 1,
            status: 'completed',
            expiresAt: null
          },
          {
            id: '2',
            title: 'Spin the Wheel',
            description: 'Use all daily spins',
            type: 'daily',
            reward: { points: 25 },
            progress: 2,
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
            progress: 3,
            target: 5,
            status: 'available',
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString()
          },
          {
            id: '4',
            title: 'Point Collector',
            description: 'Earn 500 points this month',
            type: 'monthly',
            reward: { points: 200 },
            progress: 350,
            target: 500,
            status: 'available',
            expiresAt: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString()
          }
        ],
        completedMissions: [
          {
            id: '5',
            title: 'First Spin',
            description: 'Complete your first wheel spin',
            type: 'daily',
            reward: { points: 5 },
            progress: 1,
            target: 1,
            status: 'claimed',
            claimedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      }
    }
  },

  async claimMission(missionId) {
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock successful claim
    return {
      success: true,
      data: {
        success: true,
        reward: { points: 25 },
        newBalance: 1025
      }
    }
  },

  async getMissionHistory() {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      data: {
        history: [
          {
            id: '1',
            title: 'Daily Login',
            reward: { points: 10 },
            claimedAt: new Date().toISOString(),
            type: 'daily'
          },
          {
            id: '2',
            title: 'First Spin',
            reward: { points: 5 },
            claimedAt: new Date(Date.now() - 86400000).toISOString(),
            type: 'daily'
          }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      }
    }
  },

  async updateMissionProgress(missionId, progress) {
    await new Promise(resolve => setTimeout(resolve, 200))

    return {
      success: true,
      data: {
        missionId,
        progress,
        status: progress >= 3 ? 'completed' : 'available'
      }
    }
  }
}
