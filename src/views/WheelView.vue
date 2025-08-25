<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">🎰 Lucky Wheel</h1>
          </div>
          <nav class="flex space-x-8">
            <router-link to="/wheel" class="text-blue-600 font-medium">
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
        <!-- Wheel Section -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-2">
                Spin the Wheel!
              </h2>
              <p class="text-gray-600">Try your luck and win amazing prizes</p>
            </div>

            <!-- Wheel Component -->
            <div class="flex justify-center mb-8">
              <SpinWheel
                :prizes="wheelPrizes"
                :is-spinning="isSpinning"
                :rotation="wheelRotation"
                @spin="handleSpin"
              />
            </div>

            <!-- Spin Button -->
            <div class="text-center">
              <SpinButton
                :disabled="spinButtonDisabled"
                :loading="isSpinning"
                :spins-remaining="dailySpinsRemaining"
                @click="handleSpin"
              />
              <p class="text-sm text-gray-500 mt-2">
                {{ dailySpinsRemaining }} spins remaining today
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- User Stats -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Current Points</span>
                <span class="font-semibold text-blue-600">
                  {{ currentPoints }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Level</span>
                <span class="font-semibold text-purple-600">
                  {{ currentUser.levelName }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Spins</span>
                <span class="font-semibold text-green-600">
                  {{ totalSpins }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Points Won</span>
                <span class="font-semibold text-amber-600">
                  {{ totalPointsWon }}
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Spins -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Recent Spins
            </h3>
            <SpinHistory
              :history="spinHistory.slice(0, 5)"
              :show-pagination="false"
            />
            <div class="mt-4">
              <router-link
                to="/history"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All History →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Spin Result Modal -->
    <SpinResult
      v-if="lastSpinResult"
      :result="lastSpinResult"
      @close="clearSpinResult"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWheel } from '@/composables/useWheel.js'
import { useAuth } from '@/composables/useAuth.js'
import SpinWheel from '@/components/wheel/SpinWheel.vue'
import SpinButton from '@/components/wheel/SpinButton.vue'
import SpinHistory from '@/components/wheel/SpinHistory.vue'
import SpinResult from '@/components/wheel/SpinResult.vue'

const router = useRouter()

// Composables
const {
  wheelPrizes,
  spinHistory,
  isSpinning,
  lastSpinResult,
  dailySpinsRemaining,
  totalSpins,
  totalPointsWon,
  spinButtonDisabled,
  loadWheelStatus,
  spin,
  loadSpinHistory,
  clearSpinResult,
  calculateWheelRotation
} = useWheel()

const { currentUser, currentPoints, getUserDisplayName, logout } = useAuth()

// Local state
const wheelRotation = ref(0)
const userDisplayName = computed(() => getUserDisplayName())

// Methods
const handleSpin = async () => {
  try {
    const result = await spin()
    // Calculate wheel rotation for animation
    wheelRotation.value = calculateWheelRotation(result.prizeId)
  } catch (error) {
    console.error('Spin failed:', error)
    // Handle error (show toast, etc.)
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
    await Promise.all([loadWheelStatus(), loadSpinHistory()])
  } catch (error) {
    console.error('Failed to initialize wheel view:', error)
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
