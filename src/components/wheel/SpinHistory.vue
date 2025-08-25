<template>
  <div class="space-y-4">
    <div v-if="history.length === 0" class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-2">🎰</div>
      <p>No spin history yet</p>
      <p class="text-sm">Start spinning to see your history!</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="spin in displayedHistory"
        :key="spin.id"
        class="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center space-x-4">
          <!-- Prize Icon -->
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm"
          >
            {{ getPrizeIcon(spin.prizeValue) }}
          </div>

          <!-- Spin Details -->
          <div>
            <div class="font-medium text-gray-900">{{ spin.prizeName }}</div>
            <div class="text-sm text-gray-600">
              {{ formatSpinDate(spin.spinDate) }}
            </div>
          </div>
        </div>

        <!-- Prize Value -->
        <div class="text-right">
          <div class="font-bold text-green-600">+{{ spin.prizeValue }}</div>
          <div class="text-xs text-gray-500">points</div>
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

    <!-- Load More Button (alternative to pagination) -->
    <div v-if="!showPagination && hasMore" class="text-center mt-4">
      <button
        @click="loadMore"
        class="text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        Load More
      </button>
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

  // Show up to 5 pages
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  // Adjust start if we're near the end
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const hasMore = computed(() => {
  // This would be determined by the parent component
  return false
})

// Methods
const formatSpinDate = dateString => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const getPrizeIcon = value => {
  if (value >= 500) return '💎'
  if (value >= 200) return '🏆'
  if (value >= 100) return '🥇'
  if (value >= 50) return '🥈'
  if (value >= 25) return '🥉'
  return '🎁'
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
