<template>
  <div class="space-y-6">
    <!-- Current Balance -->
    <div
      class="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6"
    >
      <div class="text-4xl font-bold text-green-600 mb-2">
        {{ formatPoints(currentPoints) }}
      </div>
      <p class="text-gray-600">Current Points Balance</p>
      <div class="mt-4 flex justify-center space-x-4 text-sm">
        <div class="text-center">
          <div class="font-semibold text-gray-900">{{ todayEarned }}</div>
          <div class="text-gray-500">Today</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-gray-900">{{ weekEarned }}</div>
          <div class="text-gray-500">This Week</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-gray-900">{{ monthEarned }}</div>
          <div class="text-gray-500">This Month</div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-semibold text-gray-900">Recent Transactions</h4>
        <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div v-if="loading" class="text-center py-4">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-gray-600 mt-2 text-sm">Loading transactions...</p>
      </div>

      <div
        v-else-if="recentTransactions.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <div class="text-3xl mb-2">💰</div>
        <p>No transactions yet</p>
        <p class="text-sm">Start earning points to see your history!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <!-- Transaction Icon -->
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm',
                getTransactionColor(transaction.type)
              ]"
            >
              {{ getTransactionIcon(transaction.source) }}
            </div>

            <!-- Transaction Details -->
            <div>
              <div class="font-medium text-gray-900">
                {{ transaction.source }}
              </div>
              <div class="text-sm text-gray-600">
                {{ formatTransactionDate(transaction.date) }}
              </div>
            </div>
          </div>

          <!-- Transaction Amount -->
          <div class="text-right">
            <div
              :class="[
                'font-bold',
                transaction.type === 'earned'
                  ? 'text-green-600'
                  : 'text-red-600'
              ]"
            >
              {{ transaction.type === 'earned' ? '+' : '-'
              }}{{ transaction.amount }}
            </div>
            <div class="text-xs text-gray-500">points</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Points Summary -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Total Earned -->
      <div class="bg-green-50 border border-green-200 rounded-xl p-4">
        <div class="flex items-center space-x-2 mb-2">
          <div
            class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm"
          >
            📈
          </div>
          <h5 class="font-semibold text-green-800">Total Earned</h5>
        </div>
        <div class="text-2xl font-bold text-green-600">
          {{ formatPoints(totalEarned) }}
        </div>
        <div class="text-sm text-green-600">All time</div>
      </div>

      <!-- Average Daily -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-center space-x-2 mb-2">
          <div
            class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm"
          >
            📊
          </div>
          <h5 class="font-semibold text-blue-800">Daily Average</h5>
        </div>
        <div class="text-2xl font-bold text-blue-600">{{ averageDaily }}</div>
        <div class="text-sm text-blue-600">Last 30 days</div>
      </div>
    </div>

    <!-- Points Expiry (if applicable) -->
    <div
      v-if="expiringPoints > 0"
      class="bg-amber-50 border border-amber-200 rounded-xl p-4"
    >
      <div class="flex items-center space-x-2 mb-2">
        <div
          class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm"
        >
          ⚠️
        </div>
        <h5 class="font-semibold text-amber-800">Points Expiring Soon</h5>
      </div>
      <p class="text-amber-700 text-sm mb-2">
        {{ expiringPoints }} points will expire on {{ expiryDate }}
      </p>
      <button class="text-amber-600 hover:text-amber-700 text-sm font-medium">
        Learn More
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  currentPoints: {
    type: Number,
    required: true
  },
  recentTransactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Computed
const todayEarned = computed(() => {
  const today = new Date().toDateString()
  return props.recentTransactions
    .filter(
      t => new Date(t.date).toDateString() === today && t.type === 'earned'
    )
    .reduce((sum, t) => sum + t.amount, 0)
})

const weekEarned = computed(() => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return props.recentTransactions
    .filter(t => new Date(t.date) >= weekAgo && t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthEarned = computed(() => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return props.recentTransactions
    .filter(t => new Date(t.date) >= monthAgo && t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalEarned = computed(() => {
  return props.recentTransactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0)
})

const averageDaily = computed(() => {
  if (props.recentTransactions.length === 0) return 0

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentEarned = props.recentTransactions
    .filter(t => new Date(t.date) >= thirtyDaysAgo && t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0)

  return Math.round(recentEarned / 30)
})

const expiringPoints = computed(() => {
  // Mock expiring points - in real app this would come from props
  return 0
})

const expiryDate = computed(() => {
  // Mock expiry date
  const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  return date.toLocaleDateString()
})

// Methods
const formatPoints = points => {
  if (points >= 1000000) {
    return (points / 1000000).toFixed(1) + 'M'
  } else if (points >= 1000) {
    return (points / 1000).toFixed(1) + 'K'
  }
  return points
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
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
}

const getTransactionIcon = source => {
  const icons = {
    'Wheel Spin': '🎰',
    'Daily Login Mission': '📅',
    'Mission Reward': '🎯',
    'Weekly Bonus': '🎁',
    'Level Up Bonus': '🏆',
    'Referral Bonus': '👥',
    Purchase: '🛒',
    Redemption: '🎁'
  }
  return icons[source] || '💰'
}

const getTransactionColor = type => {
  return type === 'earned' ? 'bg-green-500' : 'bg-red-500'
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
