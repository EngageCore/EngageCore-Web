<template>
  <div class="content-grid">
    <div class="wheel-page">
      <!-- 大转盘 -->
      <div class="wheel-wrapper">
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
        <div class="text-center mt-8">
          <div class="spin-btn-wrapper">
            <button class="spin-btn" :disabled="isSpinning || spinsLeft <= 0" @click="onStart">
              Spin ({{ spinsLeft }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"

//#region 基础配置
const DESKTOP_WHEEL_SIZE = "500px"
const MOBILE_WHEEL_SIZE = "320px"
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
const blocks = [
  { padding: "0px", background: "transparent", imgs: [{ src: baseSvg, width: "100%", height: "100%", top: "0%", left: "0%" }] },
  { padding: "0px", background: "transparent", imgs: [{ src: segmentsSvg, width: "100%", height: "100%", top: "0%", left: "0%", rotate: true }] },
  { padding: "0px", background: "transparent", imgs: [{ src: frameSvg, width: "100%", height: "100%", top: "0%", left: "0%" }] },
]

const prizes = computed(() => ICONS.map(icon => ({
  background: "transparent",
  borderColor: "#d4af37",
  borderWidth: 2,
  borderRadius: "0px",
  radius: "60%",
  range: 30,
  fonts: [
    { 
      text: icon, 
      fontColor: "#000", 
      fontSize: windowWidth.value < 768 ? "20px" : "26px",
      top: "40%"
    }
  ]
})))

const buttons = [
  {
    radius: "25%",
    background: "transparent",
    imgs: [
      { src: pointerSvg, width: "70px", height: "120px", top: "-80px" }
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
  result.value = `🎉 You won: ${prize.fonts[0].text}`
}
//#endregion
</script>

<style scoped>
.wheel-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  background: url("@/assets/img/wheel/background.png") no-repeat center center;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.wheel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* 外层 wrapper：做呼吸 */
.spin-btn-wrapper {
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

/* 按钮本体 */
.spin-btn {
  padding: 12px 28px;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(180deg, #7a4df6 0%, #4a1f9e 100%);
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow:
    0 0 15px rgba(122, 77, 246, 0.6),
    0 6px 12px rgba(0, 0, 0, 0.25);
  transition: filter 0.2s ease, box-shadow 0.2s ease;
}

/* 悬停 */
.spin-btn:hover:not(:disabled) {
  filter: brightness(1.1);
  box-shadow:
    0 0 20px rgba(122, 77, 246, 0.8),
    0 8px 16px rgba(0, 0, 0, 0.3);
}

/* 点击 */
.spin-btn:active:not(:disabled) {
  filter: brightness(0.95);
  box-shadow:
    0 0 10px rgba(122, 77, 246, 0.7),
    0 4px 8px rgba(0, 0, 0, 0.35);
}

/* 禁用 */
.spin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  animation: none;
}

/* 呼吸动画 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

</style>
