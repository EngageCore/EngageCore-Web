<template>
  <div class="space-y-4">
    <div v-if="history.length === 0" class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-2">💰</div>
      <p>No points history yet</p>
      <p class="text-sm">Start earning points to see your history!</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="transaction in displayedHistory"
        :key="transaction.id"
        class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center justify-between">
          <!-- Transaction Info -->
          <div class="flex items-center space-x-4">
            <!-- Transaction Icon -->
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-lg',
                getTransactionColor(transaction.type)
              ]"
            >
              {{ getTransactionIcon(transaction.source || transaction.type) }}
            </div>

            <!-- Transaction Details -->
            <div>
              <div class="font-medium text-gray-900">
                {{
                  transaction.source || getTransactionTitle(transaction.type)
                }}
              </div>
              <div class="text-sm text-gray-600">
                {{
                  formatTransactionDate(
                    transaction.date || transaction.createdAt
                  )
                }}
              </div>

              <!-- Transaction Description -->
              <div
                v-if="transaction.description"
                class="text-xs text-gray-500 mt-1"
              >
                {{ transaction.description }}
              </div>
            </div>
          </div>

          <!-- Transaction Amount -->
          <div class="text-right">
            <div
              :class="[
                'font-bold text-lg',
                transaction.type === 'earned' || transaction.type === 'credit'
                  ? 'text-green-600'
                  : 'text-red-600'
              ]"
            >
              {{
                transaction.type === 'earned' || transaction.type === 'credit'
                  ? '+'
                  : '-'
              }}{{ transaction.amount }}
            </div>
            <div class="text-xs text-gray-500">points</div>

            <!-- Balance After Transaction -->
            <div
              v-if="transaction.balanceAfter"
              class="text-xs text-gray-400 mt-1"
            >
              Balance: {{ transaction.balanceAfter }}
            </div>
          </div>
        </div>

        <!-- Additional Transaction Info -->
        <div
          v-if="transaction.metadata"
          class="mt-3 pt-3 border-t border-gray-200"
        >
          <div class="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div v-if="transaction.metadata.missionId">
              <span class="font-medium">Mission ID:</span>
              {{ transaction.metadata.missionId }}
            </div>
            <div v-if="transaction.metadata.spinId">
              <span class="font-medium">Spin ID:</span>
              {{ transaction.metadata.spinId }}
            </div>
            <div v-if="transaction.metadata.multiplier">
              <span class="font-medium">Multiplier:</span>
              {{ transaction.metadata.multiplier }}x
            </div>
            <div v-if="transaction.metadata.bonus">
              <span class="font-medium">Bonus:</span>
              +{{ transaction.metadata.bonus }}%
            </div>
          </div>
        </div>

        <!-- Transaction Status -->
        <div
          v-if="transaction.status && transaction.status !== 'completed'"
          class="mt-2"
        >
          <span
            :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getStatusColor(transaction.status)
            ]"
          >
            {{
              transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)
            }}
          </span>
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
      class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
    >
      <h4 class="font-semibold text-green-800 mb-3">Points Summary</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center">
          <div class="font-bold text-green-600">{{ totalEarned }}</div>
          <div class="text-green-700">Total Earned</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-red-600">{{ totalSpent }}</div>
          <div class="text-green-700">Total Spent</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-blue-600">{{ averageTransaction }}</div>
          <div class="text-green-700">Avg. Transaction</div>
        </div>
        <div class="text-center">
          <div class="font-bold text-purple-600">{{ transactionCount }}</div>
          <div class="text-green-700">Transactions</div>
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

const totalEarned = computed(() => {
  return props.history
    .filter(t => t.type === 'earned' || t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalSpent = computed(() => {
  return props.history
    .filter(t => t.type === 'spent' || t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0)
})

const averageTransaction = computed(() => {
  if (props.history.length === 0) return 0
  const total = props.history.reduce((sum, t) => sum + t.amount, 0)
  return Math.round(total / props.history.length)
})

const transactionCount = computed(() => {
  return props.history.length
})

// Methods
const getTransactionIcon = source => {
  const iconMap = {
    'Wheel Spin': '🎰',
    'Daily Login Mission': '📅',
    'Mission Reward': '🎯',
    'Weekly Bonus': '🎁',
    'Level Up Bonus': '🏆',
    'Referral Bonus': '👥',
    Purchase: '🛒',
    Redemption: '💸',
    Refund: '↩️',
    earned: '💰',
    spent: '💸',
    credit: '➕',
    debit: '➖'
  }
  return iconMap[source] || '💰'
}

const getTransactionColor = type => {
  const colorMap = {
    earned: 'bg-green-100 text-green-600',
    credit: 'bg-green-100 text-green-600',
    spent: 'bg-red-100 text-red-600',
    debit: 'bg-red-100 text-red-600',
    refund: 'bg-blue-100 text-blue-600'
  }
  return colorMap[type] || 'bg-gray-100 text-gray-600'
}

const getTransactionTitle = type => {
  const titleMap = {
    earned: 'Points Earned',
    spent: 'Points Spent',
    credit: 'Points Added',
    debit: 'Points Deducted',
    refund: 'Points Refunded'
  }
  return titleMap[type] || 'Transaction'
}

const getStatusColor = status => {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-700'
}

const formatTransactionDate = dateString => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    })
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
