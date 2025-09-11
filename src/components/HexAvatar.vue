<template>
  <div class="hex-avatar">
    <!-- 白色背景六边形 -->
    <svg viewBox="0 0 120 132" class="hex-bg">
      <polygon
        points="60,2 116,33 116,99 60,130 4,99 4,33"
        fill="#ffffff"
        stroke="#ffffff"
        stroke-width="4"
        stroke-linejoin="round"
      />
    </svg>

    <!-- 外圈进度条六边形 -->
    <svg viewBox="0 0 100 110" class="hex-border">
      <!-- 灰底 -->
      <polygon
        :points="hexPoints"
        fill="none"
        stroke="#e5e7eb"
        stroke-width="6"
        stroke-linejoin="round"
      />
      <!-- 彩色进度 -->
      <polygon
        :points="hexPoints"
        fill="none"
        stroke="url(#grad)"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-dasharray="perimeter"
        :stroke-dashoffset="perimeter - (perimeter * currentProgress / 100)"
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#41efff" />
          <stop offset="100%" stop-color="#615dfa" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 六边形头像 -->
    <svg viewBox="0 0 82 90" class="hex-image">
      <defs>
        <clipPath id="hexClip">
          <polygon 
            :points="hexClipPoints" 
            stroke-linejoin="round"
          />
        </clipPath>
      </defs>
      <image :href="avatar" width="82" height="90" clip-path="url(#hexClip)" />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  avatar: String,
  progress: Number
})

const currentProgress = ref(0)
const hexPoints = '50,2 96,27 96,83 50,108 4,83 4,27'
const hexClipPoints = '41,2 78,23 78,67 41,88 4,67 4,23'
const perimeter = 300 // 六边形周长近似值

// 动画从 0 → 目标进度
onMounted(() => {
  const step = () => {
    if (currentProgress.value < props.progress) {
      currentProgress.value += 1
      requestAnimationFrame(step)
    }
  }
  step()
})
</script>

<style scoped>
.hex-avatar {
  position: relative;
  width: 124px;
  height: 136px;
  margin: 0 auto;
}

/* 白色底六边形 */
.hex-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 132px;
  z-index: 1;
}

/* 外圈六边形经验条 */
.hex-border {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 100px;
  height: 110px;
  z-index: 2;
}

/* 六边形头像 */
.hex-image {
  position: absolute;
  top: 20px;
  left: 19px;
  width: 82px;
  height: 90px;
  z-index: 3;
}
</style>