<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">📊 History</h1>
          </div>
          <nav class="flex space-x-8">
            <router-link to="/wheel" class="text-gray-500 hover:text-gray-700">
              Wheel
            </router-link>
            <router-link
              to="/profile"
              class="text-gray-500 hover:text-gray-700"
            >
              Profile
            </router-link>
            <router-link
              to="/missions"
              class="text-gray-500 hover:text-gray-700"
            >
              Missions
            </router-link>
            <router-link to="/history" class="text-blue-600 font-medium">
              History
            </router-link>
          </nav>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{{ userDisplayName }}</span>
              <div class="text-xs">{{ currentPoints }} points</div>
            </div>
            <button
              @click="handleLogout"
              class="text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">🎰</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Spins</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalSpins }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">💰</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Points Won</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ totalPointsWon }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">🎯</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Missions Done</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ totalMissionsCompleted }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-amber-100 text-amber-600">🏆</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Mission Points</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ totalPointsEarned }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- History Tabs -->
      <div class="bg-white rounded-xl shadow-lg mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in historyTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- History Content -->
      <div class="bg-white rounded-xl shadow-lg">
        <!-- Filters -->
        <div class="p-6 border-b border-gray-200">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
          >
            <div class="flex items-center space-x-4">
              <div>
                <label
                  for="date-filter"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Range
                </label>
                <select
                  id="date-filter"
                  v-model="dateFilter"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div v-if="activeTab === 'spins'">
                <label
                  for="prize-filter"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prize Type
                </label>
                <select
                  id="prize-filter"
                  v-model="prizeFilter"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Prizes</option>
                  <option value="10">10 Points</option>
                  <option value="25">25 Points</option>
                  <option value="50">50 Points</option>
                  <option value="100">100+ Points</option>
                </select>
              </div>

              <div v-if="activeTab === 'missions'">
                <label
                  for="mission-type-filter"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mission Type
                </label>
                <select
                  id="mission-type-filter"
                  v-model="missionTypeFilter"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="refreshHistory"
                :disabled="loading"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <!-- History List -->
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
            ></div>
            <p class="text-gray-600 mt-2">Loading history...</p>
          </div>

          <div
            v-else-if="filteredHistory.length === 0"
            class="text-center py-8"
          >
            <div class="text-gray-400 text-6xl mb-4">📊</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              No history found
            </h3>
            <p class="text-gray-600">{{ getEmptyStateMessage() }}</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Spin History -->
            <div v-if="activeTab === 'spins'">
              <SpinHistory
                :history="filteredHistory"
                :show-pagination="true"
                @load-more="loadMoreSpinHistory"
              />
            </div>

            <!-- Mission History -->
            <div v-if="activeTab === 'missions'">
              <MissionHistory
                :history="filteredHistory"
                :show-pagination="true"
                @load-more="loadMoreMissionHistory"
              />
            </div>

            <!-- Points History -->
            <div v-if="activeTab === 'points'">
              <PointsHistory
                :history="filteredHistory"
                :show-pagination="true"
                @load-more="loadMorePointsHistory"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import MissionHistory from '@/components/missions/MissionHistory.vue'
import PointsHistory from '@/components/profile/PointsHistory.vue'
import SpinHistory from '@/components/wheel/SpinHistory.vue'
import { useAuth } from '@/composables/useAuth.js'
import { useMissions } from '@/composables/useMissions.js'
import { useWheel } from '@/composables/useWheel.js'
import { mockUserService } from '@/services/userService.js'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Composables
const { currentPoints, getUserDisplayName, logout } = useAuth()

const { spinHistory, totalSpins, totalPointsWon, loadSpinHistory } = useWheel()

const { totalPointsEarned, loadMissionHistory } = useMissions()

// Local state
const loading = ref(false)
const activeTab = ref('spins')
const dateFilter = ref('all')
const prizeFilter = ref('all')
const missionTypeFilter = ref('all')
const pointsHistory = ref([])
const missionHistory = ref([])
const totalMissionsCompleted = ref(0)

// Computed
const userDisplayName = computed(() => getUserDisplayName())

const historyTabs = computed(() => [
  { key: 'spins', label: 'Spin History', icon: '🎰' },
  { key: 'missions', label: 'Mission History', icon: '🎯' },
  { key: 'points', label: 'Points History', icon: '💰' }
])

const filteredHistory = computed(() => {
  let history = []

  switch (activeTab.value) {
    case 'spins':
      history = spinHistory.value
      break
    case 'missions':
      history = missionHistory.value
      break
    case 'points':
      history = pointsHistory.value
      break
  }

  // Apply date filter
  if (dateFilter.value !== 'all') {
    const now = new Date()
    const filterDate = new Date()

    switch (dateFilter.value) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
    }

    history = history.filter(item => {
      const itemDate = new Date(item.spinDate || item.claimedAt || item.date)
      return itemDate >= filterDate
    })
  }

  // Apply specific filters
  if (activeTab.value === 'spins' && prizeFilter.value !== 'all') {
    if (prizeFilter.value === '100') {
      history = history.filter(item => item.prizeValue >= 100)
    } else {
      history = history.filter(
        item => item.prizeValue === parseInt(prizeFilter.value)
      )
    }
  }

  if (activeTab.value === 'missions' && missionTypeFilter.value !== 'all') {
    history = history.filter(item => item.type === missionTypeFilter.value)
  }

  return history
})

// Methods
const loadPointsHistory = async () => {
  try {
    const result = await mockUserService.getPointsHistory()
    if (result.success) {
      pointsHistory.value = result.data.transactions || []
    }
  } catch (error) {
    console.error('Failed to load points history:', error)
  }
}

const loadMissionHistoryData = async () => {
  try {
    const result = await loadMissionHistory()
    if (result.success) {
      missionHistory.value = result.data.history || []
      totalMissionsCompleted.value = result.data.total || 0
    }
  } catch (error) {
    console.error('Failed to load mission history:', error)
  }
}

const refreshHistory = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadSpinHistory(),
      loadMissionHistoryData(),
      loadPointsHistory()
    ])
  } catch (error) {
    console.error('Failed to refresh history:', error)
  } finally {
    loading.value = false
  }
}

const loadMoreSpinHistory = async () => {
  // Implement pagination for spin history
  console.log('Load more spin history')
}

const loadMoreMissionHistory = async () => {
  // Implement pagination for mission history
  console.log('Load more mission history')
}

const loadMorePointsHistory = async () => {
  // Implement pagination for points history
  console.log('Load more points history')
}

const getEmptyStateMessage = () => {
  switch (activeTab.value) {
    case 'spins':
      return 'Start spinning the wheel to see your spin history!'
    case 'missions':
      return 'Complete missions to see your mission history!'
    case 'points':
      return 'Earn points to see your points history!'
    default:
      return 'No data available.'
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Watch for tab changes to reset filters
watch(activeTab, () => {
  dateFilter.value = 'all'
  prizeFilter.value = 'all'
  missionTypeFilter.value = 'all'
})

// Initialize data
onMounted(async () => {
  await refreshHistory()
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
