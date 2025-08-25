<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">🎯 Missions</h1>
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
            <router-link to="/missions" class="text-blue-600 font-medium">
              Missions
            </router-link>
            <router-link
              to="/history"
              class="text-gray-500 hover:text-gray-700"
            >
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
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Mission Stats -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Mission Stats
            </h3>
            <div class="space-y-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">
                  {{ missionStats.total }}
                </div>
                <div class="text-sm text-gray-600">Total Missions</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600">
                  {{ missionStats.completed }}
                </div>
                <div class="text-sm text-gray-600">Completed</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-amber-600">
                  {{ missionStats.claimable }}
                </div>
                <div class="text-sm text-gray-600">Ready to Claim</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">
                  {{ totalPointsEarned }}
                </div>
                <div class="text-sm text-gray-600">Points Earned</div>
              </div>
            </div>
          </div>

          <!-- Mission Filter -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
            <div class="space-y-2">
              <button
                v-for="type in ['all', 'daily', 'weekly', 'monthly']"
                :key="type"
                @click="selectedFilter = type"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedFilter === type
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                <span class="float-right text-xs">
                  {{ getMissionCountByType(type) }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mission List -->
        <div class="lg:col-span-3">
          <!-- Mission Tabs -->
          <div class="bg-white rounded-xl shadow-lg mb-6">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8 px-6">
                <button
                  v-for="tab in missionTabs"
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
                  <span
                    v-if="tab.count > 0"
                    class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs"
                  >
                    {{ tab.count }}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Mission Cards -->
          <div class="space-y-4">
            <div v-if="isLoading" class="text-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
              ></div>
              <p class="text-gray-600 mt-2">Loading missions...</p>
            </div>

            <div
              v-else-if="filteredMissions.length === 0"
              class="text-center py-8"
            >
              <div class="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                No missions found
              </h3>
              <p class="text-gray-600">Check back later for new missions!</p>
            </div>

            <MissionCard
              v-else
              v-for="mission in filteredMissions"
              :key="mission.id"
              :mission="mission"
              @claim="handleClaimMission"
              @update-progress="handleUpdateProgress"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-8 max-w-md mx-4">
        <div class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Mission Completed!
          </h3>
          <p class="text-gray-600 mb-4">
            You earned {{ lastReward?.points || 0 }} points!
          </p>
          <button
            @click="showSuccessModal = false"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useMissions } from '@/composables/useMissions.js'
import MissionCard from '@/components/missions/MissionCard.vue'

const router = useRouter()

// Composables
const { currentPoints, getUserDisplayName, logout } = useAuth()

const {
  availableMissions,
  isLoading,
  missionStats,
  totalPointsEarned,
  missionsByType,
  loadMissions,
  claimMission,
  updateMissionProgress
} = useMissions()

// Local state
const activeTab = ref('available')
const selectedFilter = ref('all')
const showSuccessModal = ref(false)
const lastReward = ref(null)

// Computed
const userDisplayName = computed(() => getUserDisplayName())

const missionTabs = computed(() => [
  {
    key: 'available',
    label: 'Available',
    icon: '📋',
    count: availableMissions.value.filter(m => m.status === 'available').length
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: '✅',
    count: availableMissions.value.filter(m => m.status === 'completed').length
  },
  {
    key: 'claimed',
    label: 'Claimed',
    icon: '🏆',
    count: availableMissions.value.filter(m => m.status === 'claimed').length
  }
])

const filteredMissions = computed(() => {
  let missions = availableMissions.value

  // Filter by tab
  if (activeTab.value !== 'available') {
    missions = missions.filter(mission => mission.status === activeTab.value)
  } else {
    missions = missions.filter(
      mission =>
        mission.status === 'available' || mission.status === 'completed'
    )
  }

  // Filter by type
  if (selectedFilter.value !== 'all') {
    missions = missions.filter(mission => mission.type === selectedFilter.value)
  }

  return missions
})

// Methods
const getMissionCountByType = type => {
  if (type === 'all') return availableMissions.value.length
  return availableMissions.value.filter(mission => mission.type === type).length
}

const handleClaimMission = async missionId => {
  try {
    const result = await claimMission(missionId)
    if (result.success) {
      lastReward.value = result.reward
      showSuccessModal.value = true
    }
  } catch (error) {
    console.error('Failed to claim mission:', error)
    // Handle error (show toast, etc.)
  }
}

const handleUpdateProgress = async (missionId, progress) => {
  try {
    await updateMissionProgress(missionId, progress)
  } catch (error) {
    console.error('Failed to update mission progress:', error)
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

// Initialize data
onMounted(async () => {
  try {
    await loadMissions()
  } catch (error) {
    console.error('Failed to initialize missions view:', error)
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
