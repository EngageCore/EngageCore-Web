<template>
  <div class="space-y-4">
    <div v-if="history.length === 0" class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-2">🎯</div>
      <p>No mission history yet</p>
      <p class="text-sm">Complete missions to see your history!</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="mission in displayedHistory"
        :key="mission.id"
        class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-start justify-between">
          <!-- Mission Info -->
          <div class="flex items-start space-x-4 flex-1">
            <!-- Mission Icon -->
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-lg',
                getMissionTypeColor(mission.type)
              ]"
            >
              {{ getMissionIcon(mission.type) }}
            </div>

            <!-- Mission Details -->
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <h4 class="font-medium text-gray-900">{{ mission.title }}</h4>
                <span
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getMissionTypeColor(mission.type)
                  ]"
                >
                  {{ mission.type }}
                </span>
              </div>

              <p v-if="mission.description" class="text-sm text-gray-600 mb-2">
                {{ mission.description }}
              </p>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  {{
                    formatCompletionDate(
                      mission.claimedAt || mission.completedAt
                    )
                  }}
                </span>
                <span v-if="mission.difficulty">
                  {{ mission.difficulty }} difficulty
                </span>
                <span v-if="mission.completionTime">
                  {{ mission.completionTime }}
                </span>
              </div>
            </div>
          </div>

          <!-- Reward Info -->
          <div class="text-right flex-shrink-0">
            <div class="font-bold text-green-600 mb-1">
              +{{ mission.reward.points }}
            </div>
            <div class="text-xs text-gray-500">points</div>

            <!-- Additional Rewards -->
            <div
              v-if="mission.reward.items && mission.reward.items.length > 0"
              class="mt-2"
            >
              <div class="flex flex-wrap gap-1 justify-end">
                <span
                  v-for="item in mission.reward.items"
                  :key="item"
                  class="inline-flex items-center px-1 py-0.5 rounded text-xs bg-purple-100 text-purple-700"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar (for completed missions) -->
        <div v-if="mission.progress && mission.target" class="mt-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-gray-500">Completed</span>
            <span class="text-xs text-gray-500">
              {{ mission.progress }}/{{ mission.target }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1">
            <div class="bg-green-500 h-1 rounded-full w-full"></div>
          </div>
        </div>

        <!-- Mission Stats -->
        <div v-if="showStats" class="mt-3 pt-3 border-t border-gray-200">
          <div class="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div>
              <div class="font-medium text-gray-900">
                {{ mission.attempts || 1 }}
              </div>
              <div>Attempts</div>
            </div>
            <div v-if="mission.streak">
              <div class="font-medium text-gray-900">{{ mission.streak }}</div>
              <div>Streak</div>
            </div>
            <div v-if="mission.bonus">
              <div class="font-medium text-green-600">
                +{{ mission.bonus }}%
              </div>
              <div>Bonus</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="showPagination && history.length > itemsPerPage"
      class="flex justify-center mt-6"
    >
      <div class="flex items-center space-x-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="!showPagination && hasMore" class="text-center mt-4">
      <button
        @click="loadMore"
        class="text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        Load More
      </button>
    </div>

    <!-- Summary Stats -->
    <div
      v-if="showSummary && history.length > 0"
      class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <h4 class="font-semibold text-blue-800 mb-3">Mission Summary</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center">
          <div class="font-bold text-blue-600">{{ history.length }}</div>
          <div class="text-blue-700">Completed</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-green-600">{{ totalPointsEarned }}</div>
          <div class="text-blue-700">Points Earned</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-purple-600">{{ averageCompletion }}</div>
          <div class="text-blue-700">Avg. Time</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-amber-600">{{ currentStreak }}</div>
          <div class="text-blue-700">Current Streak</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  history: {
    type: Array,
    required: true,
    default: () => []
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  showStats: {
    type: Boolean,
    default: false
  },
  showSummary: {
    type: Boolean,
    default: false
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

// Emits
const emit = defineEmits(['load-more'])

// Local state
const currentPage = ref(1)

// Computed
const totalPages = computed(() => {
  return Math.ceil(props.history.length / props.itemsPerPage)
})

const displayedHistory = computed(() => {
  if (!props.showPagination) {
    return props.history
  }

  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.history.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const hasMore = computed(() => {
  return false // This would be determined by the parent component
})

const totalPointsEarned = computed(() => {
  return props.history.reduce((total, mission) => {
    return total + (mission.reward?.points || 0)
  }, 0)
})

const averageCompletion = computed(() => {
  const completionTimes = props.history
    .filter(mission => mission.completionTime)
    .map(mission => parseCompletionTime(mission.completionTime))

  if (completionTimes.length === 0) return 'N/A'

  const average =
    completionTimes.reduce((sum, time) => sum + time, 0) /
    completionTimes.length
  return formatDuration(average)
})

const currentStreak = computed(() => {
  // Calculate current streak of completed missions
  let streak = 0
  const sortedHistory = [...props.history].sort(
    (a, b) =>
      new Date(b.claimedAt || b.completedAt) -
      new Date(a.claimedAt || a.completedAt)
  )

  for (const mission of sortedHistory) {
    if (mission.type === 'daily') {
      streak++
    } else {
      break
    }
  }

  return streak
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

const formatCompletionDate = dateString => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

const parseCompletionTime = timeString => {
  // Parse completion time string like "2h 30m" to minutes
  const hours = timeString.match(/(\d+)h/)
  const minutes = timeString.match(/(\d+)m/)

  let totalMinutes = 0
  if (hours) totalMinutes += parseInt(hours[1]) * 60
  if (minutes) totalMinutes += parseInt(minutes[1])

  return totalMinutes
}

const formatDuration = minutes => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.round(minutes % 60)
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = page => {
  currentPage.value = page
}

const loadMore = () => {
  emit('load-more')
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
