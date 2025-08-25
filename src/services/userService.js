import { apiGet, apiPost, apiPut } from './api.js'

export const userService = {
  // Get user profile
  async getProfile() {
    try {
      const response = await apiGet('/member/profile')
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

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiPut('/member/profile', profileData)
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

  // Get membership benefits
  async getMembershipBenefits() {
    try {
      const response = await apiGet('/member/benefits')
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

  // Get points history
  async getPointsHistory(page = 1, limit = 10) {
    try {
      const response = await apiGet(
        `/member/points/history?page=${page}&limit=${limit}`
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

  // Login user
  async login(credentials) {
    try {
      const response = await apiPost('/auth/login', credentials)
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
      }
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

  // Logout user
  async logout() {
    try {
      await apiPost('/auth/logout')
      localStorage.removeItem('auth_token')
      return {
        success: true
      }
    } catch (error) {
      localStorage.removeItem('auth_token')
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Mock data for development (remove when backend is ready)
export const mockUserService = {
  async getProfile() {
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        id: 'user123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        level: 3,
        levelName: 'Gold',
        points: 1250,
        pointsToNextLevel: 750,
        dailySpinsRemaining: 2,
        benefits: [
          {
            id: '1',
            name: 'Extra Daily Spin',
            description: 'Get 1 additional spin per day',
            unlocked: true
          },
          {
            id: '2',
            name: 'Bonus Points',
            description: '10% bonus on all point rewards',
            unlocked: true
          },
          {
            id: '3',
            name: 'Priority Support',
            description: 'Get priority customer support',
            unlocked: false
          }
        ]
      }
    }
  },

  async updateProfile(profileData) {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      data: {
        message: 'Profile updated successfully',
        profile: profileData
      }
    }
  },

  async getMembershipBenefits() {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      data: {
        currentLevel: {
          level: 3,
          name: 'Gold',
          benefits: [
            'Extra Daily Spin',
            'Bonus Points (10%)',
            'Weekly Bonus Missions'
          ]
        },
        nextLevel: {
          level: 4,
          name: 'Platinum',
          pointsRequired: 750,
          benefits: [
            'All Gold benefits',
            'Priority Support',
            'Exclusive Wheel Prizes',
            'Monthly Bonus Points'
          ]
        },
        allLevels: [
          { level: 1, name: 'Bronze', pointsRequired: 0 },
          { level: 2, name: 'Silver', pointsRequired: 500 },
          { level: 3, name: 'Gold', pointsRequired: 1000 },
          { level: 4, name: 'Platinum', pointsRequired: 2000 },
          { level: 5, name: 'Diamond', pointsRequired: 5000 }
        ]
      }
    }
  },

  async getPointsHistory() {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      data: {
        transactions: [
          {
            id: '1',
            type: 'earned',
            amount: 25,
            source: 'Wheel Spin',
            date: new Date().toISOString()
          },
          {
            id: '2',
            type: 'earned',
            amount: 10,
            source: 'Daily Login Mission',
            date: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            type: 'earned',
            amount: 50,
            source: 'Wheel Spin',
            date: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        total: 3,
        page: 1,
        totalPages: 1
      }
    }
  },

  async login(credentials) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock successful login
    const mockToken = 'mock_jwt_token_' + Date.now()
    localStorage.setItem('auth_token', mockToken)

    return {
      success: true,
      data: {
        token: mockToken,
        user: {
          id: 'user123',
          name: 'John Doe',
          email: credentials.email
        }
      }
    }
  },

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 300))
    localStorage.removeItem('auth_token')

    return {
      success: true
    }
  }
}
