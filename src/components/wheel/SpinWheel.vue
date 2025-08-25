<template>
  <div class="relative">
    <!-- Wheel Container -->
    <div class="relative w-80 h-80 mx-auto">
      <!-- Wheel -->
      <div
        class="w-full h-full rounded-full border-8 border-gray-300 relative overflow-hidden transition-transform duration-[3000ms] ease-out"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <!-- Prize Segments -->
        <div
          v-for="(prize, index) in prizes"
          :key="prize.id"
          class="absolute w-full h-full"
          :style="{
            transform: `rotate(${(360 / prizes.length) * index}deg)`,
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((360 / prizes.length) * Math.PI) / 180)}% ${50 - 50 * Math.sin(((360 / prizes.length) * Math.PI) / 180)}%)`
          }"
        >
          <div
            class="w-full h-full flex items-center justify-center text-white font-bold text-sm"
            :style="{ backgroundColor: prize.color }"
          >
            <div
              class="transform -rotate-90 text-center"
              :style="{
                transform: `rotate(${-(360 / prizes.length) * index + 360 / prizes.length / 2}deg)`
              }"
            >
              <div class="text-xs">{{ prize.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center Circle -->
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center z-10"
      >
        <div class="text-2xl">🎰</div>
      </div>

      <!-- Pointer -->
      <div
        class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-20"
      >
        <div
          class="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"
        ></div>
      </div>
    </div>

    <!-- Spin Button -->
    <div class="text-center mt-8">
      <button
        @click="handleSpin"
        :disabled="isSpinning"
        class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {{ isSpinning ? 'Spinning...' : 'SPIN!' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  prizes: {
    type: Array,
    required: true,
    default: () => []
  },
  isSpinning: {
    type: Boolean,
    default: false
  },
  rotation: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['spin'])

// Methods
const handleSpin = () => {
  if (!props.isSpinning) {
    emit('spin')
  }
}
</script>

<style scoped>
/* Custom styles for the wheel segments */
.wheel-segment {
  clip-path: polygon(50% 50%, 50% 0%, 100% 50%);
}
</style>
