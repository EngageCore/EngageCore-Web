<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-lg border transition-all hover:shadow-xl',
      mission.status === 'completed'
        ? 'border-green-200 bg-green-50'
        : mission.status === 'claimed'
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-200'
    ]"
  >
    <div class="p-6">
      <!-- Mission Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start space-x-4">
          <!-- Mission Icon -->
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
              getMissionTypeColor(mission.type)
            ]"
          >
            {{ getMissionIcon(mission.type) }}
          </div>

          <!-- Mission Info -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ mission.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-2">{{ mission.description }}</p>

            <!-- Mission Type Badge -->
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getMissionTypeColor(mission.type)
                ]"
              >
                {{
                  mission.type.charAt(0).toUpperCase() + mission.type.slice(1)
                }}
              </span>

              <!-- Difficulty Badge -->
              <span
                v-if="mission.difficulty"
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getDifficultyColor(mission.difficulty)
                ]"
              >
                {{ mission.difficulty }}
              </span>
            </div>
          </div>
        </div>

        <!-- Status Icon -->
        <div class="flex-shrink-0">
          <div
            v-if="mission.status === 'completed'"
            class="text-green-500 text-xl"
          >
            ✅
          </div>
          <div
            v-else-if="mission.status === 'claimed'"
            class="text-gray-400 text-xl"
          >
            🏆
          </div>
          <div v-else-if="isExpiringSoon" class="text-amber-500 text-xl">
            ⏰
          </div>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm text-gray-600">
            {{ mission.progress }}/{{ mission.target }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="[
              'h-2 rounded-full transition-all duration-300',
              mission.status === 'completed' || mission.status === 'claimed'
                ? 'bg-green-500'
                : 'bg-blue-500'
            ]"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>

        <!-- Progress Text -->
        <div class="flex justify-between items-center mt-2">
          <span
            :class="['text-sm font-medium', getMissionStatusColor(mission)]"
          >
            {{ getMissionStatusText(mission) }}
          </span>
          <span class="text-sm text-gray-500">
            {{ progressPercentage }}% complete
          </span>
        </div>
      </div>

      <!-- Reward Section -->
      <div
        class="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-lg">🎁</span>
            <span class="text-sm font-medium text-gray-700">Reward</span>
          </div>
          <div class="text-right">
            <div class="font-bold text-blue-600">
              +{{ mission.reward.points }}
            </div>
            <div class="text-xs text-gray-500">points</div>
          </div>
        </div>

        <!-- Additional Rewards -->
        <div
          v-if="mission.reward.items && mission.reward.items.length > 0"
          class="mt-2"
        >
          <div class="flex flex-wrap gap-1">
            <span
              v-for="item in mission.reward.items"
              :key="item"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>

      <!-- Time Remaining -->
      <div v-if="mission.expiresAt" class="mb-4">
        <div class="flex items-center space-x-2 text-sm">
          <span class="text-gray-500">⏰</span>
          <span
            :class="[
              'font-medium',
              isExpiringSoon ? 'text-amber-600' : 'text-gray-600'
            ]"
          >
            {{ formatTimeRemaining(mission.expiresAt) }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex space-x-3">
        <button
          v-if="mission.status === 'completed'"
          @click="handleClaim"
          :disabled="claiming"
          class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg
            v-if="claiming"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ claiming ? 'Claiming...' : 'Claim Reward' }}
        </button>

        <button
          v-else-if="mission.status === 'claimed'"
          disabled
          class="flex-1 bg-gray-300 text-gray-600 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
        >
          ✅ Claimed
        </button>

        <button
          v-else
          @click="handleViewDetails"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>

        <!-- Quick Action Button -->
        <button
          v-if="mission.status === 'available' && hasQuickAction"
          @click="handleQuickAction"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          :title="getQuickActionTitle()"
        >
          ⚡
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  mission: {
    type: Object,
    required: true,
    validator: value => {
      return (
        value &&
        typeof value.id === 'string' &&
        typeof value.title === 'string' &&
        typeof value.type === 'string' &&
        typeof value.status === 'string' &&
        typeof value.progress === 'number' &&
        typeof value.target === 'number'
      )
    }
  }
})

// Emits
const emit = defineEmits([
  'claim',
  'view-details',
  'quick-action',
  'update-progress'
])

// Local state
const claiming = ref(false)

// Computed
const progressPercentage = computed(() => {
  return Math.min(
    Math.round((props.mission.progress / props.mission.target) * 100),
    100
  )
})

const isExpiringSoon = computed(() => {
  if (!props.mission.expiresAt) return false

  const now = new Date()
  const expiry = new Date(props.mission.expiresAt)
  const hoursRemaining = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)

  return hoursRemaining <= 24 && hoursRemaining > 0
})

const hasQuickAction = computed(() => {
  // Define which missions have quick actions
  const quickActionMissions = ['Daily Login', 'Spin the Wheel']
  return quickActionMissions.includes(props.mission.title)
})

// Methods
const getMissionIcon = type => {
  const icons = {
    daily: '🌅',
    weekly: '📅',
    monthly: '🗓️',
    special: '⭐',
    event: '🎉'
  }
  return icons[type] || '📋'
}

const getMissionTypeColor = type => {
  const colors = {
    daily: 'bg-blue-100 text-blue-800',
    weekly: 'bg-green-100 text-green-800',
    monthly: 'bg-purple-100 text-purple-800',
    special: 'bg-yellow-100 text-yellow-800',
    event: 'bg-pink-100 text-pink-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getDifficultyColor = difficulty => {
  const colors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-700'
}

const getMissionStatusText = mission => {
  switch (mission.status) {
    case 'available':
      return mission.progress >= mission.target
        ? 'Ready to Claim!'
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
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

const getQuickActionTitle = () => {
  if (props.mission.title === 'Daily Login') return 'Quick Login'
  if (props.mission.title === 'Spin the Wheel') return 'Go to Wheel'
  return 'Quick Action'
}

const handleClaim = async () => {
  if (claiming.value) return

  claiming.value = true
  try {
    await emit('claim', props.mission.id)
  } finally {
    claiming.value = false
  }
}

const handleViewDetails = () => {
  emit('view-details', props.mission)
}

const handleQuickAction = () => {
  emit('quick-action', props.mission)
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
