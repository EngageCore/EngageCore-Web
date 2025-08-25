<template>
  <div class="text-center">
    <button
      @click="handleClick"
      :disabled="disabled || loading"
      :class="[
        'relative px-8 py-4 rounded-full font-bold text-lg transition-all transform',
        disabled || loading
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95'
      ]"
    >
      <!-- Loading Spinner -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <svg
          class="animate-spin h-6 w-6 text-white"
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
      </div>

      <!-- Button Content -->
      <span :class="{ 'opacity-0': loading }">
        {{ buttonText }}
      </span>
    </button>

    <!-- Spins Remaining -->
    <div class="mt-3">
      <div class="flex items-center justify-center space-x-2">
        <div class="flex space-x-1">
          <div
            v-for="n in 3"
            :key="n"
            :class="[
              'w-3 h-3 rounded-full transition-colors',
              n <= spinsRemaining ? 'bg-blue-500' : 'bg-gray-300'
            ]"
          ></div>
        </div>
        <span class="text-sm text-gray-600">
          {{ spinsRemaining }}
          {{ spinsRemaining === 1 ? 'spin' : 'spins' }} remaining
        </span>
      </div>

      <!-- Reset Timer (if applicable) -->
      <div v-if="spinsRemaining === 0" class="mt-2 text-xs text-gray-500">
        Spins reset daily at midnight
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  spinsRemaining: {
    type: Number,
    default: 3
  }
})

// Emits
const emit = defineEmits(['click'])

// Computed
const buttonText = computed(() => {
  if (props.loading) return 'Spinning...'
  if (props.spinsRemaining === 0) return 'No Spins Left'
  return `SPIN! (${props.spinsRemaining} left)`
})

// Methods
const handleClick = () => {
  if (!props.disabled && !props.loading && props.spinsRemaining > 0) {
    emit('click')
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
