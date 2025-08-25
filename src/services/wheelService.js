import { apiGet, apiPost } from './api.js'

export const wheelService = {
  // Get wheel status and configuration
  async getWheelStatus() {
    try {
      const response = await apiGet('/wheel/status')
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

  // Spin the wheel
  async spin() {
    try {
      const response = await apiPost('/wheel/spin')
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

  // Get spin history
  async getSpinHistory(page = 1, limit = 10) {
    try {
      const response = await apiGet(
        `/wheel/history?page=${page}&limit=${limit}`
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

  // Get wheel prizes configuration
  async getWheelPrizes() {
    try {
      const response = await apiGet('/wheel/prizes')
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
export const mockWheelService = {
  async getWheelStatus() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        dailySpinsRemaining: 3,
        lastSpinTime: null,
        wheelPrizes: [
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
        ]
      }
    }
  },

  async spin() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple random prize selection
    const prizes = [
      { id: '1', name: '10 Points', value: 10, probability: 30 },
      { id: '2', name: '25 Points', value: 25, probability: 25 },
      { id: '3', name: '50 Points', value: 50, probability: 20 },
      { id: '4', name: '100 Points', value: 100, probability: 15 },
      { id: '5', name: '200 Points', value: 200, probability: 8 },
      { id: '6', name: '500 Points', value: 500, probability: 2 }
    ]

    const random = Math.random() * 100
    let cumulative = 0
    let selectedPrize = prizes[0]

    for (const prize of prizes) {
      cumulative += prize.probability
      if (random <= cumulative) {
        selectedPrize = prize
        break
      }
    }

    return {
      success: true,
      data: {
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name,
        prizeValue: selectedPrize.value,
        newBalance: 1000 + selectedPrize.value // Mock new balance
      }
    }
  },

  async getSpinHistory() {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      data: {
        history: [
          {
            id: '1',
            prizeId: '2',
            prizeName: '25 Points',
            prizeValue: 25,
            spinDate: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '2',
            prizeId: '1',
            prizeName: '10 Points',
            prizeValue: 10,
            spinDate: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      }
    }
  }
}
