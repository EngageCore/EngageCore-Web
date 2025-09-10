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
            :defaultConfig="{ 
              speed: 20, 
              accelerationTime: 2000, 
              decelerationTime: 3000
            }"
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

      <!-- 右边信息区 -->
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
          </div>

          <!-- 当前结果显示 -->
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
const ICONS = ["💰","👑","🎲","🎰","🎁","⭐","🔥","🍀"]

// 静态资源
import frameSvg from '@/assets/img/wheel/wheel-frame.svg'
import baseSvg from '@/assets/img/wheel/wheel-base.svg'
import pointerSvg from '@/assets/img/wheel/wheel-pointer.svg'
import segmentsSvg from '@/assets/img/wheel/wheel-8-segments.svg'
//#endregion

//#region 状态管理
const myLucky = ref(null)
const result = ref("")
const isSpinning = ref(false)
const spinsLeft = ref(INIT_SPINS)
const windowWidth = ref(window.innerWidth)
//#endregion

//#region 响应式布局
const handleResize = () => { windowWidth.value = window.innerWidth }
const wheelSize = computed(() => (windowWidth.value < 768 ? MOBILE_WHEEL_SIZE : DESKTOP_WHEEL_SIZE))
onMounted(() => window.addEventListener("resize", handleResize))
onUnmounted(() => window.removeEventListener("resize", handleResize))
//#endregion

//#region 转盘配置
// blocks：叠底盘 + 外框
const blocks = [
  {
    padding: "0px",
    background: "transparent",
    imgs: [{ src: baseSvg, width: "100%", height: "100%", top: "0%", left: "0%" }]
  },
  {
    padding: "0px",
    background: "transparent",
    imgs: [{ src: segmentsSvg, width: "100%", height: "100%", top: "0%", left: "0%", rotate: true }]
  },
  {
    padding: "0px", 
    background: "transparent",
    imgs: [{ src: frameSvg, width: "100%", height: "100%", top: "0%", left: "0%" }]
  },
]

// prizes：调整奖品位置，让它们更靠近轮盘内侧
const prizes = computed(() => ICONS.map(icon => ({
  background: "transparent",
  // 使用内置分割线功能
  borderColor: "#d4af37",      // 金色分割线
  borderWidth: 2,              // 分割线宽度
  borderRadius: "0px",         // 分割线样式
  // 关键调整：设置内外半径，让奖品显示在合适的位置
  radius: "60%",  // 奖品区域的外半径
  range: 30,      // 奖品区域的径向范围（从60%向内30%）
  fonts: [
    { 
      text: icon, 
      fontColor: "#000", 
      fontSize: windowWidth.value < 768 ? "20px" : "24px",
      // 调整文字位置到40%
      top: "40%"
    }
  ]
})))

// 中心按钮 + 指针 - 调整指针大小
const buttons = [
  {
    radius: "25%",  // 减小中心按钮区域
    background: "transparent",
    imgs: [
      {
        src: pointerSvg,
        width: "60px",   // 稍微缩小指针
        height: "105px",
        top: "-73px"
      }
    ]
  }
]
//#endregion

//#region 游戏逻辑
const onStart = () => {
  if (spinsLeft.value <= 0) return
  spinsLeft.value--
  isSpinning.value = true

  myLucky.value.play()
  const targetIndex = Math.floor(Math.random() * prizes.value.length)
  setTimeout(() => { myLucky.value.stop(targetIndex) }, 4000)
}
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
@media (max-width: 767px) {
  .wheel-wrapper { padding: 10px; }
  .wheel-wrapper button { padding: 12px 20px !important; font-size: 16px !important; }
}
</style>