<template>
  <div class="space-y-3">
    <div v-if="benefits.length === 0" class="text-center py-4 text-gray-500">
      <div class="text-2xl mb-2">🎁</div>
      <p class="text-sm">No benefits available</p>
    </div>

    <div
      v-for="(benefit, index) in benefits"
      :key="index"
      :class="[
        'flex items-start space-x-3 p-3 rounded-lg transition-all',
        showLocked && !benefit.unlocked
          ? 'bg-gray-50 border border-gray-200 opacity-60'
          : 'bg-green-50 border border-green-200'
      ]"
    >
      <!-- Benefit Icon -->
      <div
        :class="[
          'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5',
          showLocked && !benefit.unlocked
            ? 'bg-gray-300 text-gray-600'
            : 'bg-green-500 text-white'
        ]"
      >
        {{ getBenefitIcon(benefit, showLocked) }}
      </div>

      <!-- Benefit Content -->
      <div class="flex-1 min-w-0">
        <div
          :class="[
            'font-medium',
            showLocked && !benefit.unlocked ? 'text-gray-600' : 'text-green-800'
          ]"
        >
          {{ getBenefitTitle(benefit) }}
        </div>

        <div
          v-if="getBenefitDescription(benefit)"
          :class="[
            'text-sm mt-1',
            showLocked && !benefit.unlocked ? 'text-gray-500' : 'text-green-600'
          ]"
        >
          {{ getBenefitDescription(benefit) }}
        </div>

        <!-- Benefit Value/Details -->
        <div
          v-if="getBenefitValue(benefit)"
          :class="[
            'text-xs mt-2 font-medium',
            showLocked && !benefit.unlocked ? 'text-gray-500' : 'text-green-700'
          ]"
        >
          {{ getBenefitValue(benefit) }}
        </div>

        <!-- Unlock Requirements -->
        <div
          v-if="showLocked && !benefit.unlocked && benefit.requirement"
          class="text-xs text-gray-500 mt-2"
        >
          🔒 {{ benefit.requirement }}
        </div>
      </div>

      <!-- Status Badge -->
      <div v-if="showStatus" class="flex-shrink-0">
        <span
          :class="[
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            showLocked && !benefit.unlocked
              ? 'bg-gray-100 text-gray-600'
              : 'bg-green-100 text-green-700'
          ]"
        >
          {{ showLocked && !benefit.unlocked ? 'Locked' : 'Active' }}
        </span>
      </div>
    </div>

    <!-- Benefits Summary -->
    <div
      v-if="showSummary && benefits.length > 0"
      class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div class="flex items-center space-x-2 mb-2">
        <div
          class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"
        >
          📊
        </div>
        <h5 class="font-semibold text-blue-800">Benefits Summary</h5>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div class="font-medium text-blue-700">Active Benefits</div>
          <div class="text-blue-600">{{ activeBenefitsCount }}</div>
        </div>
        <div v-if="showLocked">
          <div class="font-medium text-blue-700">Locked Benefits</div>
          <div class="text-blue-600">{{ lockedBenefitsCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  benefits: {
    type: Array,
    required: true,
    default: () => []
  },
  showLocked: {
    type: Boolean,
    default: false
  },
  showStatus: {
    type: Boolean,
    default: true
  },
  showSummary: {
    type: Boolean,
    default: false
  }
})

// Computed
const activeBenefitsCount = computed(() => {
  return props.benefits.filter(benefit =>
    typeof benefit === 'object' ? benefit.unlocked !== false : true
  ).length
})

const lockedBenefitsCount = computed(() => {
  return props.benefits.filter(
    benefit => typeof benefit === 'object' && benefit.unlocked === false
  ).length
})

// Methods
const getBenefitIcon = (benefit, showLocked) => {
  if (typeof benefit === 'object') {
    if (showLocked && !benefit.unlocked) return '🔒'
    return benefit.icon || getBenefitIconByName(benefit.name || benefit.title)
  }
  return getBenefitIconByName(benefit)
}

const getBenefitIconByName = name => {
  const iconMap = {
    daily: '📅',
    spin: '🎰',
    bonus: '💰',
    points: '⭐',
    support: '🎧',
    priority: '⚡',
    exclusive: '👑',
    vip: '💎',
    special: '🎁',
    extra: '➕',
    weekly: '📊',
    monthly: '🗓️'
  }

  const lowerName = name.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon
    }
  }

  return '✨'
}

const getBenefitTitle = benefit => {
  if (typeof benefit === 'object') {
    return benefit.name || benefit.title || 'Benefit'
  }
  return benefit
}

const getBenefitDescription = benefit => {
  if (typeof benefit === 'object') {
    return benefit.description
  }
  return null
}

const getBenefitValue = benefit => {
  if (typeof benefit === 'object') {
    if (benefit.value) {
      return `Value: ${benefit.value}`
    }
    if (benefit.percentage) {
      return `${benefit.percentage}% bonus`
    }
    if (benefit.quantity) {
      return `${benefit.quantity}x multiplier`
    }
  }
  return null
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
