<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">👤 Profile</h1>
          </div>
          <nav class="flex space-x-8">
            <router-link to="/wheel" class="text-gray-500 hover:text-gray-700">
              Wheel
            </router-link>
            <router-link to="/profile" class="text-blue-600 font-medium">
              Profile
            </router-link>
            <router-link
              to="/missions"
              class="text-gray-500 hover:text-gray-700"
            >
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
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- User Info Card -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center space-x-6">
              <div
                class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              >
                {{ getUserInitials() }}
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900">
                  {{ currentUser.name }}
                </h2>
                <p class="text-gray-600">{{ currentUser.email }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <span
                    :class="getLevelBadgeColor(currentUser.level)"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    Level {{ currentUser.level }} - {{ currentUser.levelName }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Membership Level Progress -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">
              Membership Progress
            </h3>
            <MembershipLevel
              :current-level="currentUser.level"
              :level-name="currentUser.levelName"
              :current-points="currentPoints"
              :points-to-next-level="membershipData.pointsToNextLevel"
              :next-level-name="membershipData.nextLevel?.name"
            />
          </div>

          <!-- Points Balance -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">
              Points Balance
            </h3>
            <PointsBalance
              :current-points="currentPoints"
              :recent-transactions="pointsHistory"
              :loading="loading"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Level Benefits -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Current Benefits
            </h3>
            <BenefitsList
              :benefits="membershipData.currentLevel?.benefits || []"
              :show-locked="false"
            />
          </div>

          <!-- Next Level Preview -->
          <div
            class="bg-white rounded-xl shadow-lg p-6"
            v-if="membershipData.nextLevel"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Next Level Benefits
            </h3>
            <div class="mb-4">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress to {{ membershipData.nextLevel.name }}</span>
                <span>{{ progressPercentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ membershipData.pointsToNextLevel }} more points needed
              </p>
            </div>
            <BenefitsList
              :benefits="membershipData.nextLevel?.benefits || []"
              :show-locked="true"
            />
          </div>

          <!-- Quick Stats -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Member Since</span>
                <span class="font-medium">{{ formatMemberSince() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Spins</span>
                <span class="font-medium text-blue-600">{{ totalSpins }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Points Earned</span>
                <span class="font-medium text-green-600">
                  {{ totalPointsWon }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Missions Completed</span>
                <span class="font-medium text-purple-600">
                  {{ totalMissionsCompleted }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useWheel } from '@/composables/useWheel.js'
import { useMissions } from '@/composables/useMissions.js'
import { mockUserService } from '@/services/userService.js'
import MembershipLevel from '@/components/profile/MembershipLevel.vue'
import PointsBalance from '@/components/profile/PointsBalance.vue'
import BenefitsList from '@/components/profile/BenefitsList.vue'

const router = useRouter()

// Composables
const {
  currentUser,
  currentPoints,
  getUserDisplayName,
  getUserInitials,
  getLevelBadgeColor,
  logout
} = useAuth()

const { totalSpins, totalPointsWon } = useWheel()

const { totalPointsEarned: totalMissionsCompleted } = useMissions()

// Local state
const loading = ref(false)
const membershipData = ref({
  currentLevel: null,
  nextLevel: null,
  pointsToNextLevel: 0,
  allLevels: []
})
const pointsHistory = ref([])

// Computed
const userDisplayName = computed(() => getUserDisplayName())
const progressPercentage = computed(() => {
  if (!membershipData.value.pointsToNextLevel) return 100
  const currentLevelPoints =
    membershipData.value.currentLevel?.pointsRequired || 0
  const nextLevelPoints = membershipData.value.nextLevel?.pointsRequired || 0
  const totalNeeded = nextLevelPoints - currentLevelPoints
  const currentProgress = currentPoints.value - currentLevelPoints
  return Math.min(Math.round((currentProgress / totalNeeded) * 100), 100)
})

// Methods
const loadMembershipData = async () => {
  try {
    loading.value = true
    const result = await mockUserService.getMembershipBenefits()
    if (result.success) {
      membershipData.value = result.data
    }
  } catch (error) {
    console.error('Failed to load membership data:', error)
  } finally {
    loading.value = false
  }
}

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

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const formatMemberSince = () => {
  // Mock member since date
  const memberSince = new Date('2024-01-01')
  return memberSince
}

// Initialize data
onMounted(async () => {
  try {
    await Promise.all([loadMembershipData(), loadPointsHistory()])
  } catch (error) {
    console.error('Failed to initialize profile view:', error)
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
