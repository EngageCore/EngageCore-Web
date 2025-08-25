<template>
  <!-- Modal Overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="handleClose"
  >
    <!-- Modal Content -->
    <div
      class="bg-white rounded-2xl p-8 max-w-md mx-4 transform transition-all"
      @click.stop
    >
      <!-- Confetti Animation -->
      <div class="relative">
        <div class="absolute inset-0 pointer-events-none">
          <div
            v-for="i in 20"
            :key="i"
            class="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
            :style="{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
              animationDuration: Math.random() * 2 + 1 + 's'
            }"
          ></div>
        </div>

        <!-- Result Content -->
        <div class="text-center relative z-10">
          <!-- Prize Icon -->
          <div class="mb-6">
            <div
              class="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-4xl animate-pulse"
            >
              {{ getPrizeIcon(result.prizeValue) }}
            </div>
          </div>

          <!-- Congratulations -->
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            🎉 Congratulations!
          </h2>
          <p class="text-lg text-gray-600 mb-6">You won</p>

          <!-- Prize Details -->
          <div
            class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6"
          >
            <div class="text-2xl font-bold text-blue-600 mb-2">
              {{ result.prizeName }}
            </div>
            <div class="text-4xl font-bold text-green-600">
              +{{ result.prizeValue }}
            </div>
            <div class="text-sm text-gray-600">points</div>
          </div>

          <!-- New Balance -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="text-sm text-gray-600 mb-1">Your new balance</div>
            <div class="text-xl font-bold text-gray-900">
              {{ result.newBalance }} points
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              @click="handleClose"
              class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Awesome!
            </button>
            <button
              @click="handleSpinAgain"
              class="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Spin Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Props
const props = defineProps({
  result: {
    type: Object,
    required: true,
    validator: value => {
      return (
        value &&
        typeof value.prizeId === 'string' &&
        typeof value.prizeName === 'string' &&
        typeof value.prizeValue === 'number' &&
        typeof value.newBalance === 'number'
      )
    }
  }
})

// Emits
const emit = defineEmits(['close', 'spin-again'])

// Methods
const getPrizeIcon = value => {
  if (value >= 500) return '💎'
  if (value >= 200) return '🏆'
  if (value >= 100) return '🥇'
  if (value >= 50) return '🥈'
  if (value >= 25) return '🥉'
  return '🎁'
}

const handleClose = () => {
  emit('close')
}

const handleSpinAgain = () => {
  emit('spin-again')
  emit('close')
}

// Auto-close after 10 seconds
let autoCloseTimer

onMounted(() => {
  autoCloseTimer = setTimeout(() => {
    handleClose()
  }, 10000)
})

// Cleanup timer when component is unmounted
const cleanup = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
}

// Handle escape key
const handleKeydown = event => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)

  // Cleanup on unmount
  return () => {
    document.removeEventListener('keydown', handleKeydown)
    cleanup()
  }
})
</script>

<style scoped>
/* Custom animations */
@keyframes confetti {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti {
  animation: confetti 3s linear infinite;
}

/* Pulse animation for the prize icon */
@keyframes prize-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-prize-pulse {
  animation: prize-pulse 2s ease-in-out infinite;
}
</style>
