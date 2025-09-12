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
        <!-- Simplified Wheel Container -->
        <div class="wheel-container">
          <!-- Lucky Wheel -->
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
  max-width: 600px;
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

/* Wheel Container */
.wheel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheel-wrapper {
  position: relative;
  z-index: 3;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 30px rgba(122, 77, 246, 0.6));
}

.wheel-wrapper::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(circle, rgba(122, 77, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  animation: wheelGlow 3s ease-in-out infinite alternate;
}

.wheel-wrapper:hover {
  transform: scale(1.02);
  filter: drop-shadow(0 0 50px rgba(122, 77, 246, 0.8));
}

.wheel-wrapper.spinning {
  filter: drop-shadow(0 0 60px rgba(255, 215, 0, 0.8));
}

@keyframes wheelGlow {
  0% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.1); }
}

@keyframes wheelSpin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(1800deg) scale(1.05); }
  100% { transform: rotate(3600deg) scale(1); }
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
    padding: 60px 15px 15px 15px;
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
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .game-layout {
    padding: 50px 10px 10px 10px;
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
}
</style>
