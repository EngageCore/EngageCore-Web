<template>
  <div class="wheel-view-container">
    <!-- Interactive Background -->
    <InteractiveBackground 
      :isSpinning="isSpinning" 
      :showCelebration="showCelebration"
      :celebrationType="celebrationType"
    />
    
    <!-- Winning Modal -->
    <WinningModal 
      v-if="showWinModal"
      :prize="lastPrize"
      :celebrationType="celebrationType"
      @close="closeWinModal"
    />
    
    <div class="game-layout">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-controls">
        <button 
          class="sound-toggle-btn" 
          :class="{ 'muted': !soundEnabled }"
          @click="toggleSound"
          title="Toggle Sound"
        >
          <span v-if="soundEnabled">🔊</span>
          <span v-else>🔇</span>
        </button>
      </div>
      <h1 class="page-title">🎰 Spin & Win</h1>
      <p class="page-description">Test your luck with our exciting wheel of fortune! Spin to win amazing prizes and rewards.</p>
    </div>
    
    <!-- Game Content Grid -->
    <div class="game-content">
      <!-- Main Game Area -->
      <div class="main-game-area">
        <!-- Enhanced Wheel Container -->
        <div class="wheel-container">
          <!-- Outer Decorative Ring -->
          <div class="wheel-outer-ring">
            <div class="ring-1 ring-decoration"></div>
            <div class="ring-2 ring-decoration"></div>
            <div class="ring-decoration ring-3"></div>
          </div>
          
          <!-- Wheel Frame Layers -->
          <div class="wheel-frame-layers">
            <div class="frame-layer frame-outer"></div>
            <div class="frame-layer frame-middle"></div>
            <div class="frame-layer frame-inner"></div>
          </div>
          
          <!-- Lucky Wheel -->
          <div class="wheel-wrapper">
            <!-- Wheel Shadow Base -->
            <div class="wheel-shadow-base"></div>
            
            <!-- Main Wheel -->
            <div class="wheel-main">
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
            </div>
            
            <!-- Wheel Highlight Overlay -->
            <div class="wheel-highlight-overlay"></div>
          </div>
          
          <!-- Corner Decorations -->
          <div class="corner-decorations">
            <div class="corner-decoration corner-tl"></div>
            <div class="corner-decoration corner-tr"></div>
            <div class="corner-decoration corner-bl"></div>
            <div class="corner-decoration corner-br"></div>
          </div>
        </div>

        <!-- Simple Spin Button -->
        <div class="spin-button-area">
          <button 
            class="spin-btn" 
            :class="{ 'spinning': isSpinning, 'disabled': spinsLeft <= 0 }"
            :disabled="isSpinning || spinsLeft <= 0" 
            @click="onStart"
          >
            {{ isSpinning ? 'SPINNING...' : `SPIN (${spinsLeft})` }}
          </button>
          
          <!-- Spin Counter -->
          <div class="spin-counter">
            <div class="counter-label">{{ spinsLeft }} spins remaining</div>
          </div>
        </div>
      </div>
      
      <!-- Winning History Panel -->
      <div class="winning-panel-container">
        <WinningHistoryPanel />
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import InteractiveBackground from '@/components/wheel/InteractiveBackground.vue'
import WinningHistoryPanel from '@/components/wheel/WinningHistoryPanel.vue'
import WinningModal from '@/components/wheel/WinningModal.vue'
import { useSoundEffects } from '@/composables/useSoundEffects'
import { computed, onMounted, onUnmounted, ref } from "vue"

//#region 基础配置
const DESKTOP_WHEEL_SIZE = "500px"
const MOBILE_WHEEL_SIZE = "320px"
const INIT_SPINS = 3
const ICONS = ["💰","👑","🎲","🎰","🎁","⭐","🔥","🍀"]

// 静态资源
import segmentsSvg from '@/assets/img/wheel/wheel-8-segments.svg'
import baseSvg from '@/assets/img/wheel/wheel-base.svg'
import frameSvg from '@/assets/img/wheel/wheel-frame.svg'
import pointerSvg from '@/assets/img/wheel/wheel-pointer.svg'
//#endregion

//#region 状态管理
const myLucky = ref(null)
const isSpinning = ref(false)
const spinsLeft = ref(INIT_SPINS)
const windowWidth = ref(window.innerWidth)
const showCelebration = ref(false)
const celebrationType = ref('default')
const showWinModal = ref(false)
const lastPrize = ref(null)

// Sound effects
const {
  playSpinSound,
  stopSpinSound,
  playButtonClick,
  playWinSound,
  playAmbientSound,
  stopAmbientSound,
  isEnabled: soundEnabled,
  toggleSound
} = useSoundEffects()

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
  
  // Play button click sound
  playButtonClick()
  
  spinsLeft.value--
  isSpinning.value = true
  showCelebration.value = false
  showWinModal.value = false

  // Add spinning class to wheel wrapper
  const wheelWrapper = document.querySelector('.wheel-wrapper')
  if (wheelWrapper) {
    wheelWrapper.classList.add('spinning')
  }

  // Start spinning sound
  playSpinSound()

  myLucky.value.play()
  const targetIndex = Math.floor(Math.random() * prizes.value.length)
  setTimeout(() => { myLucky.value.stop(targetIndex) }, 4000)
}

const onEnd = (prize) => {
  isSpinning.value = false
  const prizeIcon = prize.fonts[0].text
  lastPrize.value = prizeIcon
  
  // Stop spinning sound
  stopSpinSound()
  
  // Remove spinning class from wheel wrapper
  const wheelWrapper = document.querySelector('.wheel-wrapper')
  if (wheelWrapper) {
    wheelWrapper.classList.remove('spinning')
  }
  
  // Determine celebration type based on prize
  if (prizeIcon === '👑' || prizeIcon === '💰') {
    celebrationType.value = 'jackpot'
  } else if (prizeIcon === '🎰' || prizeIcon === '⭐') {
    celebrationType.value = 'big-win'
  } else {
    celebrationType.value = 'default'
  }
  
  // Play winning sound based on prize type
  setTimeout(() => {
    playWinSound(celebrationType.value)
  }, 200)
  
  // Show winning modal after a short delay
  setTimeout(() => {
    showWinModal.value = true
  }, 500)
  
  // Trigger background celebration
  setTimeout(() => {
    showCelebration.value = true
  }, 800)
  
  // Hide background celebration after 3 seconds
  setTimeout(() => {
    showCelebration.value = false
  }, 3800)
}

const closeWinModal = () => {
  showWinModal.value = false
}

//#endregion
</script>

<style scoped>
/* Import Gaming Fonts */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&display=swap');

/* Root Container */
.wheel-view-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Game Layout */
.game-layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  gap: 30px;
  min-height: calc(100vh - 80px);
  padding: 100px 20px 20px 20px;
  font-family: 'Orbitron', 'Exo 2', monospace;
  position: relative;
  z-index: 1;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  margin-top: 30px;
}

.header-controls {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 10px;
}

.sound-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(122, 77, 246, 0.5);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.sound-toggle-btn:hover {
  background: rgba(122, 77, 246, 0.2);
  border-color: rgba(122, 77, 246, 0.8);
  transform: scale(1.1);
}

.sound-toggle-btn.muted {
  background: rgba(255, 0, 0, 0.1);
  border-color: rgba(255, 0, 0, 0.5);
}

.sound-toggle-btn.muted:hover {
  background: rgba(255, 0, 0, 0.2);
  border-color: rgba(255, 0, 0, 0.8);
}

.page-title {
  font-size: 4rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 
    0 0 30px rgba(122, 77, 246, 1),
    0 0 15px rgba(255, 255, 255, 0.5),
    2px 2px 4px rgba(0, 0, 0, 0.8);
  margin: 0 0 15px 0;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #9d6fff, #7a4df6, #5a3bc4);
  background-size: 200% 200%;
  background-clip: text;
  position: relative;
}

.page-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  margin: 0 auto;
  max-width: 550px;
  line-height: 1.6;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}



/* Game Content Grid */
.game-content {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 30px;
  align-items: start;
}

/* Main Game Area */
.main-game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  position: relative;
}

/* Enhanced Wheel Container */
.wheel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 550px;
  height: 550px;
  margin: 0 auto;
}

/* Outer Decorative Ring */
.wheel-outer-ring {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.ring-decoration {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  animation: ringRotate 20s linear infinite;
}

.ring-1 {
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border-color: rgba(255, 215, 0, 0.4);
  border-style: dashed;
  animation-duration: 30s;
}

.ring-2 {
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border-color: rgba(122, 77, 246, 0.3);
  border-style: dotted;
  animation-duration: 25s;
  animation-direction: reverse;
}

.ring-3 {
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  border-color: rgba(255, 255, 255, 0.2);
  border-style: solid;
  animation-duration: 35s;
}

/* Wheel Frame Layers */
.wheel-frame-layers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.frame-layer {
  position: absolute;
  border-radius: 50%;
  border: 3px solid;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
}

.frame-outer {
  top: 40px;
  left: 40px;
  right: 40px;
  bottom: 40px;
  border-color: #d4af37;
  background: linear-gradient(45deg, 
    rgba(212, 175, 55, 0.1) 0%, 
    rgba(255, 215, 0, 0.05) 50%, 
    rgba(212, 175, 55, 0.1) 100%);
  box-shadow: 
    0 0 30px rgba(212, 175, 55, 0.5),
    inset 0 0 20px rgba(0, 0, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3);
}

.frame-middle {
  top: 50px;
  left: 50px;
  right: 50px;
  bottom: 50px;
  border-color: #7a4df6;
  background: linear-gradient(135deg, 
    rgba(122, 77, 246, 0.1) 0%, 
    rgba(157, 111, 255, 0.05) 50%, 
    rgba(122, 77, 246, 0.1) 100%);
  box-shadow: 
    0 0 20px rgba(122, 77, 246, 0.4),
    inset 0 0 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.frame-inner {
  top: 60px;
  left: 60px;
  right: 60px;
  bottom: 60px;
  border-color: rgba(255, 255, 255, 0.6);
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.05) 100%);
  box-shadow: 
    0 0 15px rgba(255, 255, 255, 0.3),
    inset 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Enhanced Wheel Wrapper */
.wheel-wrapper {
  position: relative;
  z-index: 5;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 40px rgba(122, 77, 246, 0.7));
}

.wheel-wrapper::before {
  content: '';
  position: absolute;
  top: -30px;
  left: -30px;
  right: -30px;
  bottom: -30px;
  background: radial-gradient(circle, 
    rgba(122, 77, 246, 0.4) 0%, 
    rgba(255, 215, 0, 0.2) 30%,
    rgba(122, 77, 246, 0.1) 60%,
    transparent 80%);
  border-radius: 50%;
  z-index: -1;
  animation: wheelGlow 3s ease-in-out infinite alternate;
}

/* Wheel Shadow Base */
.wheel-shadow-base {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: radial-gradient(circle, 
    rgba(0, 0, 0, 0.4) 0%, 
    rgba(0, 0, 0, 0.2) 50%, 
    transparent 80%);
  border-radius: 50%;
  z-index: 1;
  filter: blur(8px);
}

/* Main Wheel */
.wheel-main {
  position: relative;
  z-index: 3;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 
    0 0 50px rgba(122, 77, 246, 0.6),
    0 10px 30px rgba(0, 0, 0, 0.4),
    inset 0 0 0 3px rgba(255, 255, 255, 0.1),
    inset 0 0 0 6px rgba(212, 175, 55, 0.3);
}

/* Wheel Highlight Overlay */
.wheel-highlight-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    transparent 30%, 
    transparent 70%, 
    rgba(255, 255, 255, 0.1) 100%);
  border-radius: 50%;
  z-index: 4;
  pointer-events: none;
  opacity: 0.8;
}

/* Corner Decorations */
.corner-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 6;
  pointer-events: none;
}

.corner-decoration {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #d4af37;
  background: linear-gradient(45deg, 
    rgba(212, 175, 55, 0.3) 0%, 
    rgba(255, 215, 0, 0.2) 100%);
  box-shadow: 
    0 0 15px rgba(212, 175, 55, 0.5),
    inset 0 0 10px rgba(255, 255, 255, 0.2);
}

.corner-tl {
  top: 20px;
  left: 20px;
  border-radius: 0 0 20px 0;
  transform: rotate(-45deg);
}

.corner-tr {
  top: 20px;
  right: 20px;
  border-radius: 0 0 0 20px;
  transform: rotate(45deg);
}

.corner-bl {
  bottom: 20px;
  left: 20px;
  border-radius: 0 20px 0 0;
  transform: rotate(45deg);
}

.corner-br {
  bottom: 20px;
  right: 20px;
  border-radius: 20px 0 0 0;
  transform: rotate(-45deg);
}

/* Enhanced Hover and Spinning Effects */
.wheel-wrapper:hover {
  transform: scale(1.03);
  filter: drop-shadow(0 0 60px rgba(122, 77, 246, 0.9));
}

.wheel-wrapper:hover .wheel-main {
  box-shadow: 
    0 0 70px rgba(122, 77, 246, 0.8),
    0 15px 40px rgba(0, 0, 0, 0.5),
    inset 0 0 0 3px rgba(255, 255, 255, 0.2),
    inset 0 0 0 6px rgba(212, 175, 55, 0.4);
}

.wheel-wrapper.spinning {
  filter: drop-shadow(0 0 80px rgba(255, 215, 0, 0.9));
}

.wheel-wrapper.spinning .wheel-main {
  box-shadow: 
    0 0 100px rgba(255, 215, 0, 0.8),
    0 20px 50px rgba(0, 0, 0, 0.6),
    inset 0 0 0 3px rgba(255, 255, 255, 0.3),
    inset 0 0 0 6px rgba(255, 215, 0, 0.5);
}

.wheel-wrapper.spinning .wheel-highlight-overlay {
  animation: highlightSpin 1s ease-in-out infinite;
}

.wheel-wrapper.spinning .corner-decoration {
  animation: cornerPulse 0.5s ease-in-out infinite alternate;
}

@keyframes wheelGlow {
  0% { 
    opacity: 0.6; 
    transform: scale(1);
    filter: hue-rotate(0deg);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
    filter: hue-rotate(180deg);
  }
  100% { 
    opacity: 1; 
    transform: scale(1.1);
    filter: hue-rotate(360deg);
  }
}

@keyframes wheelSpin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(1800deg) scale(1.05); }
  100% { transform: rotate(3600deg) scale(1); }
}

@keyframes ringRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes highlightSpin {
  0% { 
    transform: rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: rotate(180deg);
    opacity: 1;
  }
  100% { 
    transform: rotate(360deg);
    opacity: 0.8;
  }
}

@keyframes cornerPulse {
  0% { 
    transform: scale(1) rotate(-45deg);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
  }
  100% { 
    transform: scale(1.2) rotate(-45deg);
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.8);
  }
}

@keyframes frameGlow {
  0% {
    box-shadow: 
      0 0 30px rgba(212, 175, 55, 0.5),
      inset 0 0 20px rgba(0, 0, 0, 0.3);
  }
  100% {
    box-shadow: 
      0 0 50px rgba(212, 175, 55, 0.8),
      inset 0 0 30px rgba(0, 0, 0, 0.4);
  }
}

/* Simple Spin Button */
.spin-button-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spin-btn {
  padding: 16px 32px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #7a4df6 0%, #4a1f9e 100%);
  color: #fff;
  font-family: 'Orbitron', 'Exo 2', monospace;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 20px rgba(122, 77, 246, 0.6),
    0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  animation: buttonPulse 2s ease-in-out infinite;
}

.spin-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.spin-btn:hover::before {
  left: 100%;
}

.spin-btn:hover:not(.disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 0 30px rgba(122, 77, 246, 0.8),
    0 8px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation: none;
  background: linear-gradient(135deg, #8a5df6 0%, #5a2fae 100%);
}

.spin-btn:active:not(.disabled) {
  transform: translateY(-1px) scale(1.02);
}

.spin-btn.spinning {
  pointer-events: none;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  box-shadow: 
    0 0 40px rgba(255, 107, 53, 0.8),
    0 6px 20px rgba(0, 0, 0, 0.4);
}

.spin-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  animation: none;
  transform: none !important;
  background: linear-gradient(135deg, #666 0%, #444 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@keyframes buttonPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 20px rgba(122, 77, 246, 0.6),
      0 4px 15px rgba(0, 0, 0, 0.3);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 
      0 0 25px rgba(122, 77, 246, 0.8),
      0 6px 18px rgba(0, 0, 0, 0.4);
  }
}

@keyframes buttonSpinning {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes buttonGlow {
  0% { box-shadow: 0 0 40px rgba(255, 107, 53, 0.6); }
  100% { box-shadow: 0 0 60px rgba(255, 107, 53, 1); }
}

/* Spin Counter */
.spin-counter {
  text-align: center;
}

.counter-label {
  font-size: 14px;
  color: #888;
  font-weight: 500;
}

/* Winning Panel */
.winning-panel-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
}

/* Mobile Responsiveness */
@media (max-width: 1400px) {
  .game-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 25px;
  }
  
  .game-layout {
    padding: 80px 15px 15px 15px;
  }
  
  .page-title {
    font-size: 3rem;
  }
  
  .page-description {
    font-size: 1.2rem;
  }
  
  .winning-panel-container {
    order: 2;
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  .main-game-area {
    order: 1;
  }
  
  .wheel-container {
    width: 500px;
    height: 500px;
  }
  
  .corner-decoration {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 1200px) {
  .game-layout {
    padding: 80px 15px 15px 15px;
  }
  
  .page-title {
    font-size: 3rem;
  }
  
  .page-description {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .game-layout {
    padding: 90px 20px 10px 20px;
    gap: 20px;
  }
  
  .page-title {
    font-size: 2.5rem;
    letter-spacing: 1px;
  }
  
  .page-description {
    font-size: 1rem;
    max-width: 90%;
  }
  
  .header-controls {
    top: -10px;
    right: -5px;
  }
  
  .sound-toggle-btn {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .spin-btn {
    padding: 16px 32px;
    font-size: 16px;
    min-height: 56px;
    min-width: 160px;
  }
  
  .wheel-container {
    width: 400px;
    height: 400px;
    margin-bottom: 20px;
  }
  
  .frame-outer {
    top: 30px;
    left: 30px;
    right: 30px;
    bottom: 30px;
  }
  
  .frame-middle {
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
  }
  
  .frame-inner {
    top: 50px;
    left: 50px;
    right: 50px;
    bottom: 50px;
  }
  
  .corner-decoration {
    width: 30px;
    height: 30px;
  }
  
  .ring-1 {
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
  }
  
  .ring-2 {
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
  }
  
  .ring-3 {
    top: 22px;
    left: 22px;
    right: 22px;
    bottom: 22px;
  }
}

@media (max-width: 480px) {
  .game-layout {
    padding: 90px 20px 10px 20px;
    gap: 15px;
  }
  
  .page-title {
    font-size: 2rem;
    letter-spacing: 0.5px;
  }
  
  .page-description {
    font-size: 0.9rem;
    max-width: 95%;
    line-height: 1.5;
  }
  
  .header-controls {
    top: -15px;
    right: -10px;
  }
  
  .sound-toggle-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .spin-btn {
    padding: 14px 28px;
    font-size: 15px;
    min-height: 52px;
    min-width: 140px;
  }
  
  .main-game-area {
    gap: 20px;
  }
  
  .counter-label {
    font-size: 13px;
  }
  
  .wheel-container {
    width: 350px;
    height: 350px;
  }
  
  .frame-outer {
    top: 25px;
    left: 25px;
    right: 25px;
    bottom: 25px;
    border-width: 2px;
  }
  
  .frame-middle {
    top: 35px;
    left: 35px;
    right: 35px;
    bottom: 35px;
    border-width: 2px;
  }
  
  .frame-inner {
    top: 45px;
    left: 45px;
    right: 45px;
    bottom: 45px;
    border-width: 1px;
  }
  
  .corner-decoration {
    width: 25px;
    height: 25px;
    border-width: 1px;
  }
  
  .corner-tl, .corner-tr {
    top: 15px;
  }
  
  .corner-bl, .corner-br {
    bottom: 15px;
  }
  
  .corner-tl, .corner-bl {
    left: 15px;
  }
  
  .corner-tr, .corner-br {
    right: 15px;
  }
}

@media (max-width: 360px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .page-description {
    font-size: 0.85rem;
  }
  
  .spin-btn {
    padding: 12px 24px;
    font-size: 14px;
    min-height: 48px;
    min-width: 120px;
  }
  
  .wheel-container {
    width: 300px;
    height: 300px;
  }
  
  .frame-outer {
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
  
  .frame-middle {
    top: 30px;
    left: 30px;
    right: 30px;
    bottom: 30px;
  }
  
  .frame-inner {
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
  }
  
  .corner-decoration {
    width: 20px;
    height: 20px;
  }
  
  .corner-tl, .corner-tr {
    top: 12px;
  }
  
  .corner-bl, .corner-br {
    bottom: 12px;
  }
  
  .corner-tl, .corner-bl {
    left: 12px;
  }
  
  .corner-tr, .corner-br {
    right: 12px;
  }
  
  .ring-decoration {
    border-width: 1px;
  }
}
</style>
