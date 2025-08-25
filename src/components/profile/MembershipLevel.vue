<template>
  <div class="space-y-6">
    <!-- Current Level Display -->
    <div class="text-center">
      <div
        class="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
      >
        <div class="text-4xl">{{ getLevelIcon(currentLevel) }}</div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{{ levelName }}</h3>
          <p class="text-gray-600">Level {{ currentLevel }}</p>
        </div>
      </div>
    </div>

    <!-- Progress to Next Level -->
    <div
      v-if="nextLevelName"
      class="bg-white border border-gray-200 rounded-xl p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-lg font-semibold text-gray-900">
          Progress to {{ nextLevelName }}
        </h4>
        <span class="text-sm font-medium text-blue-600">
          {{ progressPercentage }}%
        </span>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

      <!-- Progress Details -->
      <div class="flex justify-between text-sm text-gray-600">
        <span>{{ currentPoints }} points</span>
        <span>{{ pointsToNextLevel }} more needed</span>
      </div>

      <!-- Estimated Time -->
      <div class="mt-3 text-center">
        <p class="text-xs text-gray-500">
          {{ getEstimatedTime() }}
        </p>
      </div>
    </div>

    <!-- Level Benefits Preview -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Current Level Benefits -->
      <div class="bg-green-50 border border-green-200 rounded-xl p-4">
        <h5 class="font-semibold text-green-800 mb-3 flex items-center">
          <span class="mr-2">✅</span>
          Current Benefits
        </h5>
        <ul class="space-y-2 text-sm text-green-700">
          <li
            v-for="benefit in currentBenefits"
            :key="benefit"
            class="flex items-start"
          >
            <span class="mr-2 mt-0.5">•</span>
            <span>{{ benefit }}</span>
          </li>
        </ul>
      </div>

      <!-- Next Level Benefits -->
      <div
        v-if="nextLevelName"
        class="bg-blue-50 border border-blue-200 rounded-xl p-4"
      >
        <h5 class="font-semibold text-blue-800 mb-3 flex items-center">
          <span class="mr-2">🔒</span>
          {{ nextLevelName }} Benefits
        </h5>
        <ul class="space-y-2 text-sm text-blue-700">
          <li
            v-for="benefit in nextBenefits"
            :key="benefit"
            class="flex items-start"
          >
            <span class="mr-2 mt-0.5">•</span>
            <span>{{ benefit }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Level Milestones -->
    <div class="bg-gray-50 rounded-xl p-6">
      <h4 class="text-lg font-semibold text-gray-900 mb-4">Level Milestones</h4>
      <div class="space-y-3">
        <div
          v-for="level in levelMilestones"
          :key="level.level"
          :class="[
            'flex items-center justify-between p-3 rounded-lg transition-colors',
            level.level <= currentLevel
              ? 'bg-green-100 border border-green-200'
              : level.level === currentLevel + 1
                ? 'bg-blue-100 border border-blue-200'
                : 'bg-white border border-gray-200'
          ]"
        >
          <div class="flex items-center space-x-3">
            <div class="text-2xl">{{ getLevelIcon(level.level) }}</div>
            <div>
              <div class="font-medium text-gray-900">{{ level.name }}</div>
              <div class="text-sm text-gray-600">Level {{ level.level }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-medium text-gray-900">
              {{ level.pointsRequired }} pts
            </div>
            <div class="text-xs text-gray-500">
              {{
                level.level <= currentLevel
                  ? 'Achieved'
                  : level.level === currentLevel + 1
                    ? 'Next'
                    : 'Locked'
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  currentLevel: {
    type: Number,
    required: true
  },
  levelName: {
    type: String,
    required: true
  },
  currentPoints: {
    type: Number,
    required: true
  },
  pointsToNextLevel: {
    type: Number,
    default: 0
  },
  nextLevelName: {
    type: String,
    default: null
  }
})

// Computed
const progressPercentage = computed(() => {
  if (!props.pointsToNextLevel) return 100

  // Calculate progress based on current level requirements
  const currentLevelPoints = getLevelPoints(props.currentLevel)
  const nextLevelPoints = getLevelPoints(props.currentLevel + 1)
  const totalNeeded = nextLevelPoints - currentLevelPoints
  const currentProgress = props.currentPoints - currentLevelPoints

  return Math.min(Math.round((currentProgress / totalNeeded) * 100), 100)
})

const currentBenefits = computed(() => {
  return getLevelBenefits(props.currentLevel)
})

const nextBenefits = computed(() => {
  if (!props.nextLevelName) return []
  return getLevelBenefits(props.currentLevel + 1)
})

const levelMilestones = computed(() => {
  return [
    { level: 1, name: 'Bronze', pointsRequired: 0 },
    { level: 2, name: 'Silver', pointsRequired: 500 },
    { level: 3, name: 'Gold', pointsRequired: 1000 },
    { level: 4, name: 'Platinum', pointsRequired: 2000 },
    { level: 5, name: 'Diamond', pointsRequired: 5000 }
  ]
})

// Methods
const getLevelIcon = level => {
  const icons = {
    1: '🥉', // Bronze
    2: '🥈', // Silver
    3: '🥇', // Gold
    4: '💎', // Platinum
    5: '👑' // Diamond
  }
  return icons[level] || '🏆'
}

const getLevelPoints = level => {
  const points = {
    1: 0,
    2: 500,
    3: 1000,
    4: 2000,
    5: 5000
  }
  return points[level] || 0
}

const getLevelBenefits = level => {
  const benefits = {
    1: ['Daily wheel spins', 'Basic point rewards'],
    2: ['All Bronze benefits', 'Weekly bonus missions', '5% bonus points'],
    3: [
      'All Silver benefits',
      'Extra daily spin',
      '10% bonus points',
      'Priority support'
    ],
    4: [
      'All Gold benefits',
      'Exclusive wheel prizes',
      '15% bonus points',
      'Monthly bonus'
    ],
    5: [
      'All Platinum benefits',
      'VIP support',
      '25% bonus points',
      'Special events access'
    ]
  }
  return benefits[level] || []
}

const getEstimatedTime = () => {
  if (!props.pointsToNextLevel) return 'Level maxed out!'

  // Estimate based on average daily points (assuming 50 points per day)
  const avgDailyPoints = 50
  const daysNeeded = Math.ceil(props.pointsToNextLevel / avgDailyPoints)

  if (daysNeeded <= 1) return 'Less than a day to go!'
  if (daysNeeded <= 7) return `About ${daysNeeded} days to go`
  if (daysNeeded <= 30) return `About ${Math.ceil(daysNeeded / 7)} weeks to go`
  return `About ${Math.ceil(daysNeeded / 30)} months to go`
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
