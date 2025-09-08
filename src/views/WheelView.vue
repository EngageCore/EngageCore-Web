<template>
  <div class="content-grid">
    <div class="grid grid-9-3 small-space">
      <!-- 左边：大转盘 -->
      <div class="grid-column">
        <div class="widget-box wheel-wrapper relative">
          <LuckyWheel
            ref="myLucky"
            :width="wheelSize"
            :height="wheelSize"
            :prizes="prizes"
            :blocks="blocks"
            :buttons="buttons"
            :defaultConfig="{ speed: 20, accelerationTime: 2000, decelerationTime: 3000 }"
            @end="onEnd"
          />

          <!-- 下方 Spin 按钮 -->
          <div class="text-center mt-6">
            <button
              @click="onStart"
              :disabled="isSpinning || spinsLeft <= 0"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spin ({{ spinsLeft }})
            </button>
          </div>
        </div>
      </div>

      <!-- Right Side: Info Area -->
      <div class="grid-column">
        <!-- Daily Spin Status Card -->
        <div class="widget-box mb-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">🎰 Daily Spins</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Spins Left</span>
              <span class="font-semibold text-red-600">{{ spinsLeft }}/3</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Today's Earnings</span>
              <span class="font-semibold text-green-600">+320</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Best Prize</span>
              <span class="font-semibold text-purple-600">👑 Crown</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Lucky Streak</span>
              <span class="font-semibold text-amber-600">85%</span>
            </div>
          </div>
          
          <!-- Progress Bar: Time Until Reset -->
          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <div class="flex justify-between items-center text-sm">
              <span class="text-blue-700">Next Reset:</span>
              <span class="font-medium text-blue-800">4h 32m</span>
            </div>
            <div class="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div class="bg-blue-500 h-2 rounded-full" style="width: 65%"></div>
            </div>
          </div>
        </div>

        <!-- Prize List Card -->
        <div class="widget-box">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">🏆 Prize List</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center py-2 px-3 bg-red-50 border border-red-100 rounded-lg">
              <div class="flex items-center space-x-2">
                <span class="text-lg">💰</span>
                <span class="text-sm font-medium">Gold Coins</span>
              </div>
              <span class="text-xs text-red-600 font-medium">100-500</span>
            </div>
            <div class="flex justify-between items-center py-2 px-3 bg-purple-50 border border-purple-100 rounded-lg">
              <div class="flex items-center space-x-2">
                <span class="text-lg">👑</span>
                <span class="text-sm font-medium">Rare Reward</span>
              </div>
              <span class="text-xs text-purple-600 font-medium">1000+</span>
            </div>
            <div class="flex justify-between items-center py-2 px-3 bg-green-50 border border-green-100 rounded-lg">
              <div class="flex items-center space-x-2">
                <span class="text-lg">🎁</span>
                <span class="text-sm font-medium">Mystery Box</span>
              </div>
              <span class="text-xs text-green-600 font-medium">Random</span>
            </div>
            <div class="flex justify-between items-center py-2 px-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div class="flex items-center space-x-2">
                <span class="text-lg">⭐</span>
                <span class="text-sm font-medium">Lucky Star</span>
              </div>
              <span class="text-xs text-yellow-600 font-medium">50-200</span>
            </div>
          </div>
          
          <!-- Current Result Display -->
          <div v-if="result" class="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-dashed border-orange-300 rounded-lg text-center">
            <div class="text-lg font-bold text-orange-800">{{ result }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"

//#region 基础配置
const DESKTOP_WHEEL_SIZE = "400px"
const MOBILE_WHEEL_SIZE = "280px"
const INIT_SPINS = 3
const ICONS = ["💰","👑","🎲","🎰","🎁","⭐","🔥","🍀","🎶","⚡","🙈","🏆"]
//#endregion

//#region 状态管理
const myLucky = ref(null)
const result = ref("")
const isSpinning = ref(false)
const spinsLeft = ref(INIT_SPINS)
const windowWidth = ref(window.innerWidth)
//#endregion

//#region 响应式布局
// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// 根据屏幕大小计算转盘尺寸
const wheelSize = computed(() => {
  return windowWidth.value < 768 ? MOBILE_WHEEL_SIZE : DESKTOP_WHEEL_SIZE
})

// 生命周期管理
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
//#endregion

//#region 转盘配置
// 外圈装饰
const blocks = [
  { padding: "15px", background: "#e5e7eb", borderRadius: 20 },
  { padding: "8px", background: "#fff", borderRadius: 15 }
]

// 奖品配置（红白相间）
const prizes = computed(() => ICONS.map((icon, i) => ({
  background: i % 2 === 0 ? "#e74c3c" : "#ffffff",
  fonts: [
    {
      text: icon,
      fontColor: i % 2 === 0 ? "#fff" : "#000",
      fontSize: windowWidth.value < 768 ? "16px" : "18px"
    }
  ]
})))

// 中心圆心 + 指针
const buttons = [
  {
    radius: "10px",       // 中心圆大小
    background: "#000000",// 黑色圆心
    pointer: true,        // 保留指针
    fonts: []             // 不显示文字
  }
]
//#endregion

//#region 游戏逻辑
// 点击开始
const onStart = () => {
  if (spinsLeft.value <= 0) return
  spinsLeft.value--
  isSpinning.value = true

  myLucky.value.play()

  // 选择目标奖品
  const targetIndex = Math.floor(Math.random() * prizes.value.length)
  
  // 延长时间让摇摆效果更明显
  setTimeout(() => {
    myLucky.value.stop(targetIndex)
  }, 4000)
}

// 转盘结束
const onEnd = (prize) => {
  isSpinning.value = false
  result.value = `🎉 Congratulations! You won: ${prize.fonts[0].text}`
}
//#endregion
</script>

<style scoped>
.wheel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

/* 手机端转盘适配 */
@media (max-width: 767px) {
  .wheel-wrapper {
    padding: 10px;
  }
  
  /* 调整按钮在手机上的大小 */
  .wheel-wrapper button {
    padding: 12px 20px !important;
    font-size: 16px !important;
  }
}
</style>