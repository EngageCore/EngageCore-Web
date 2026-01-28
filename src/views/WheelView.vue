<template>
  <div class="wheel-view-container">
    <!-- Interactive Background -->
    <InteractiveBackground :isSpinning="isSpinning" :showCelebration="showCelebration"
      :celebrationType="celebrationType" />

    <!-- Winning Modal -->
    <WinningModal v-if="showWinModal" :prize="lastPrize" :celebrationType="celebrationType" @close="closeWinModal" />

    <div class="game-layout">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-controls">
          <button class="sound-toggle-btn" :class="{ 'muted': !soundEnabled }" @click="toggleSound"
            title="Toggle Sound">
            <span v-if="soundEnabled">🔊</span>
            <span v-else>🔇</span>
          </button>
        </div>
        <h1 class="page-title"> <svg class="menu-item-link-icon" :class="`icon-streams`">
            <use :xlink:href="`#svg-streams`"></use>
          </svg> Spin & Win</h1>
        <p class="page-description">Test your luck with our exciting wheel of fortune! Spin to win amazing prizes and
          rewards.</p>
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
                <LuckyWheel ref="myLucky" :width="wheelSize" :height="wheelSize" :prizes="prizes" :blocks="blocks"
                  :buttons="buttons" :defaultConfig="{
                    speed: 20,
                    accelerationTime: 2000,
                    decelerationTime: 3000
                  }" @end="onEnd" />
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

          <!-- Loading State -->
          <div v-if="loading && !currentWheel" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading wheel...</p>
          </div>

          <!-- Error State -->
          <div v-if="error && !currentWheel" class="error-state">
            <p>{{ error }}</p>
            <button @click="fetchActiveWheels" class="retry-btn">Retry</button>
          </div>

          <!-- Simple Spin Button -->
          <div v-if="currentWheel" class="spin-button-area">
            <button class="spin-btn" :class="{ 'spinning': isSpinning, 'disabled': spinsLeft <= 0 || !isEligible }"
              :disabled="isSpinning || spinsLeft <= 0 || !isEligible || loading" @click="onStart">
              {{ isSpinning ? 'SPINNING...' : `SPIN (${spinsLeft})` }}
            </button>

            <!-- Spin Counter -->
            <div class="spin-counter">
              <div class="counter-label">{{ spinsLeft }} spins remaining</div>
            </div>

            <!-- Eligibility Message -->
            <div v-if="eligibilityMessage" class="eligibility-message" :class="{ 'error': !isEligible }">
              <i :class="isEligible ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"></i>
              {{ eligibilityMessage }}
            </div>
          </div>
        </div>

        <!-- Winning History Panel -->
        <div class="winning-panel-container">
          <WinningHistoryPanel v-if="currentWheel" :wheelId="currentWheel.id" />
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
import { useCallApi } from '@/hooks/useCallApi'
import { useNotification } from '@/composables/useNotification'
import { computed, onMounted, onUnmounted, ref } from "vue"

//#region 基础配置
const DESKTOP_WHEEL_SIZE = "500px"
const MOBILE_WHEEL_SIZE = "320px"

// 静态资源
import segmentsSvg from '@/assets/img/wheel/wheel-8-segments.svg'
import baseSvg from '@/assets/img/wheel/wheel-base.svg'
import frameSvg from '@/assets/img/wheel/wheel-frame.svg'
import pointerSvg from '@/assets/img/wheel/wheel-pointer.svg'
//#endregion

//#region API & Notifications
const { callApi } = useCallApi()
const { showSuccess, showError } = useNotification()
//#endregion

//#region 状态管理
const myLucky = ref(null)
const isSpinning = ref(false)
const spinsLeft = ref(0)
const windowWidth = ref(window.innerWidth)
const showCelebration = ref(false)
const celebrationType = ref('default')
const showWinModal = ref(false)
const lastPrize = ref(null)
const currentWheel = ref(null)
const wheelItems = ref([])
const loading = ref(false)
const error = ref(null)
const depositInfo = ref(null)
const isEligible = ref(true)
const eligibilityMessage = ref('')

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
// Blocks: base + optional segment overlay (only when 8 segments so lines match) + frame
const blocks = computed(() => {
  const base = { padding: "0px", background: "transparent", imgs: [{ src: baseSvg, width: "100%", height: "100%", top: "0%", left: "0%" }] }
  const frame = { padding: "0px", background: "transparent", imgs: [{ src: frameSvg, width: "100%", height: "100%", top: "0%", left: "0%" }] }
  const segmentCount = wheelItems.value?.filter(item => item.active !== false).length ?? 0
  const segmentLayer = segmentCount === 8
    ? { padding: "0px", background: "transparent", imgs: [{ src: segmentsSvg, width: "100%", height: "100%", top: "0%", left: "0%", rotate: true }] }
    : null
  return segmentLayer ? [base, segmentLayer, frame] : [base, frame]
})

// Map wheel items to prizes format (matching BackOffice structure)
const prizes = computed(() => {
  if (!wheelItems.value || wheelItems.value.length === 0) {
    return []
  }
  
  // Filter only active items and sort by position (matching BackOffice behavior)
  const activeItems = wheelItems.value
    .filter(item => item.active !== false)
    .sort((a, b) => (a.position || 0) - (b.position || 0))
  
  if (activeItems.length === 0) {
    return []
  }
  
  const totalItems = activeItems.length
  const range = 360 / totalItems
  
  // Dynamic sizing based on number of segments
  // More segments = smaller fonts, less segments = larger fonts
  const getFontSize = (baseSize, isMobile = false) => {
    const multiplier = totalItems <= 4 ? 1.2 : totalItems <= 6 ? 1.0 : totalItems <= 8 ? 0.85 : 0.7
    const size = isMobile ? baseSize * 0.7 : baseSize
    return `${(size * multiplier).toFixed(0)}px`
  }
  
  // Calculate dynamic positioning based on segment count
  const getPositioning = () => {
    if (totalItems <= 4) {
      return { iconTop: '20%', nameTop: '50%', typeTop: '75%' }
    } else if (totalItems <= 6) {
      return { iconTop: '22%', nameTop: '48%', typeTop: '72%' }
    } else if (totalItems <= 8) {
      return { iconTop: '25%', nameTop: '50%', typeTop: '70%' }
    } else {
      return { iconTop: '28%', nameTop: '52%', typeTop: '68%' }
    }
  }
  
  const positions = getPositioning()
  
  return activeItems.map((item, index) => {
    // Determine display content: prefer image, then icon, then default
    const hasImage = item.image && item.image.trim() !== ''
    const displayIcon = item.icon || "🎁" // Icon is already converted to emoji in fetchWheelItems
    
    // Alternating background colors for better visibility
    const isEven = index % 2 === 0
    const backgroundColor = isEven 
      ? "rgba(122, 77, 246, 0.15)" // Light purple
      : "rgba(212, 175, 55, 0.15)" // Light gold
    
    // Build prize configuration using items from API
    const prizeConfig = {
      background: backgroundColor,
      borderColor: "#d4af37",
      borderWidth: 2,
      borderRadius: "0px",
      radius: "60%",
      range: range,
      // Store full item data for reference (using API response structure)
      itemData: {
        id: item.id,
        name: item.name,
        type: item.type || 'points',
        value: item.value || 0,
        probability: item.probability || 0, // Backend: 0-1
        prize_total_limit: item.prize_total_limit,
        prize_daily_limit: item.prize_daily_limit,
        icon: item.icon, // Already converted to emoji
        image: item.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/${item.image}` : '',
        description: item.description,
        active: item.active,
        position: item.position !== undefined ? item.position : index
      }
    }
    
    // Build fonts array to display icon, name, and type
    const fonts = []
    const isMobile = windowWidth.value < 768
    
    // If item has an image, use it; otherwise use icon/emoji
    if (hasImage) {
      // Use image if available
      prizeConfig.imgs = [{
        src: item.image,
        width: totalItems <= 4 ? "50%" : totalItems <= 6 ? "55%" : "60%",
        height: totalItems <= 4 ? "50%" : totalItems <= 6 ? "55%" : "60%",
        top: "8%",
        left: "20%"
      }]
      // Show icon at top
      if (displayIcon) {
        fonts.push({
          text: displayIcon,
          fontColor: "#FFFFFF",
          fontSize: getFontSize(isMobile ? 16 : 20, isMobile),
          fontWeight: "bold",
          top: "3%",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)"
        })
      }
      // Show name below image
      if (item.name) {
        fonts.push({
          text: item.name,
          fontColor: "#FFFFFF",
          fontSize: getFontSize(isMobile ? 12 : 16, isMobile),
          fontWeight: "bold",
          top: "68%",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(122, 77, 246, 0.6)"
        })
      }
      // Show type at bottom
      if (item.type) {
        fonts.push({
          text: item.type.toUpperCase(),
          fontColor: "#FFD700",
          fontSize: getFontSize(isMobile ? 10 : 12, isMobile),
          fontWeight: "600",
          top: "82%",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)"
        })
      }
    } else {
      // Show icon at top with enhanced visibility
      if (displayIcon) {
        fonts.push({
          text: displayIcon,
          fontColor: "#FFFFFF",
          fontSize: getFontSize(isMobile ? 28 : 36, isMobile),
          fontWeight: "bold",
          top: positions.iconTop,
          textShadow: "3px 3px 6px rgba(0, 0, 0, 0.9), 0 0 10px rgba(122, 77, 246, 0.5)"
        })
      }
      // Show name in middle with better contrast
      if (item.name) {
        fonts.push({
          text: item.name,
          fontColor: "#FFFFFF",
          fontSize: getFontSize(isMobile ? 14 : 18, isMobile),
          fontWeight: "bold",
          top: positions.nameTop,
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.9), 0 0 8px rgba(122, 77, 246, 0.6)"
        })
      }
      // Show type at bottom with gold accent
      if (item.type) {
        fonts.push({
          text: item.type.toUpperCase(),
          fontColor: "#FFD700",
          fontSize: getFontSize(isMobile ? 11 : 14, isMobile),
          fontWeight: "700",
          top: positions.typeTop,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 6px rgba(255, 215, 0, 0.4)"
        })
      }
    }
    
    // Assign fonts array if we have any
    if (fonts.length > 0) {
      prizeConfig.fonts = fonts
    }
    
    return prizeConfig
  })
})

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

//#region API Functions
// Icon mapping for string icons to emojis (used by normalizeWheelItems)
const iconMap = {
  'coin': '🪙',
  'diamond': '💎',
  'star': '⭐',
  'trophy': '🏆',
  'gift': '🎁',
  'crown': '👑',
  'money': '💰',
  'gem': '💠',
  'medal': '🥇',
  'prize': '🎁'
}

const getIconDisplay = (icon) => {
  if (!icon) return '🎁'
  if (/[\u{1F300}-\u{1F9FF}]/u.test(icon)) return icon
  return iconMap[icon.toLowerCase()] || icon || '🎁'
}

// Normalize API wheel items to wheelItems format (shared by fetchActiveWheels and fetchWheelItems)
const normalizeWheelItems = (items, defaultPositionByIndex = false) => {
  if (!items || !Array.isArray(items)) return []
  return items
    .map((item, index) => ({
      id: item.id,
      name: item.name || '',
      type: item.type || 'points',
      value: parseFloat(item.value) || 0,
      probability: parseFloat(item.probability) || 0,
      prize_total_limit: item.prize_total_limit,
      prize_daily_limit: item.prize_daily_limit,
      icon: getIconDisplay(item.icon),
      image: item.image || '',
      description: item.description || '',
      active: item.active !== false,
      position: item.position !== undefined ? item.position : (defaultPositionByIndex ? index : 0)
    }))
    .filter(item => item.active)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
}

const fetchActiveWheels = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await callApi('/member/wheels/active', 'GET')
    
    if (response && response.wheels && response.wheels.length > 0) {
      // Use the first active wheel
      currentWheel.value = response.wheels[0]
      
      // Extract deposit info and eligibility from wheel response
      if (currentWheel.value.deposit_info) {
        depositInfo.value = currentWheel.value.deposit_info
      }
      if (currentWheel.value.eligibility) {
        isEligible.value = currentWheel.value.eligibility.eligible
        eligibilityMessage.value = currentWheel.value.eligibility.reason || ''
      }
      
      // Use items from active wheel response when present (supports 4, 6, 7, 8, or any count)
      if (currentWheel.value.items && Array.isArray(currentWheel.value.items) && currentWheel.value.items.length > 0) {
        wheelItems.value = normalizeWheelItems(currentWheel.value.items, true)
      } else {
        await fetchWheelItems(currentWheel.value.id)
      }
      
      // Fetch spin count from the new endpoint
      await fetchSpinCount(currentWheel.value.id)
    } else {
      error.value = 'No active wheels available'
      showError('No Wheels Available', 'There are no active wheels at this time.')
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch active wheels'
    showError('Error', 'Failed to load wheels. Please try again later.')
  } finally {
    loading.value = false
  }
}

const checkEligibility = async (wheelId) => {
  try {
    const response = await callApi(`/member/wheels/${wheelId}/eligibility`, 'GET')
    
    if (response && response.eligibility) {
      isEligible.value = response.eligibility.eligible
      eligibilityMessage.value = response.eligibility.reason || ''
      
      // Update deposit info if available
      if (response.eligibility.deposit_info) {
        depositInfo.value = response.eligibility.deposit_info
      }
    }
  } catch (err) {
    console.warn('Failed to check eligibility:', err.message)
    // Don't block UI on eligibility check failure
  }
}

const formatCurrency = (amount) => {
  if (amount == null || amount === undefined) return '0.00'
  return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const fetchSpinCount = async (wheelId) => {
  try {
    const spinCountData = await callApi(`/member/wheels/${wheelId}/spin-count`, 'GET')
    
    if (spinCountData) {
      // Update spins left from the API response
      spinsLeft.value = spinCountData.remaining_spins || 0
      
      // Log eligibility info for debugging
      if (!spinCountData.has_eligibility) {
        console.log('No eligibility record found for this wheel')
      }
    } else {
      // Fallback: if no eligibility system, set to 0 or a default
      spinsLeft.value = 0
    }
  } catch (err) {
    console.warn('Failed to fetch spin count:', err.message)
    // On error, don't block the UI - just set to 0
    spinsLeft.value = 0
  }
}

const fetchWheelItems = async (wheelId) => {
  try {
    loading.value = true
    const response = await callApi(`/member/wheels/${wheelId}/items`, 'GET')
    
    // Support multiple API response shapes: response.wheel.items, response.message.data.wheel.items, response.data.wheel.items
    const wheelData = response?.wheel ?? response?.message?.data?.wheel ?? response?.data?.wheel
    const items = wheelData?.items
    if (items && Array.isArray(items)) {
      wheelItems.value = normalizeWheelItems(items, true)
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch wheel items'
    showError('Error', 'Failed to load wheel items. Please try again later.')
  } finally {
    loading.value = false
  }
}
//#endregion

//#region 游戏逻辑
const onStart = async () => {
  if (spinsLeft.value <= 0 || !currentWheel.value || isSpinning.value || !isEligible.value) return

  // Play button click sound
  playButtonClick()

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

  try {
    // Call spin API
    const response = await callApi(`/member/wheels/${currentWheel.value.id}/spin`, 'POST')
    
      if (response && response.winning_item) {
        const winningItem = response.winning_item
        
        // Find the index of the winning item in the prizes array
        const winningIndex = prizes.value.findIndex(
          prize => prize.itemData && prize.itemData.id === winningItem.id
        )
        
        if (winningIndex !== -1) {
          // Start the wheel animation
          myLucky.value.play()
          
          // Stop at the winning index after animation
          setTimeout(() => {
            myLucky.value.stop(winningIndex)
          }, 4000)
          
          // Optimistically decrement spins (will be updated after refetch)
          spinsLeft.value = Math.max(0, spinsLeft.value - 1)
        } else {
          // Fallback: use random index if item not found
          console.warn('Winning item not found in prizes, using random index')
          myLucky.value.play()
          const randomIndex = Math.floor(Math.random() * prizes.value.length)
          setTimeout(() => { myLucky.value.stop(randomIndex) }, 4000)
          // Optimistically decrement spins (will be updated after refetch)
          spinsLeft.value = Math.max(0, spinsLeft.value - 1)
        }
      } else {
        throw new Error('Invalid response from spin API')
      }
  } catch (err) {
    isSpinning.value = false
    stopSpinSound()
    const wheelWrapper = document.querySelector('.wheel-wrapper')
    if (wheelWrapper) {
      wheelWrapper.classList.remove('spinning')
    }
    
    // Check if it's a deposit-related error
    const errorMsg = err.message || 'Failed to spin the wheel. Please try again.'
    if (errorMsg.includes('deposit') || errorMsg.includes('Insufficient')) {
      showError('Insufficient Deposit', errorMsg)
      // Refresh eligibility to update UI
      if (currentWheel.value) {
        await checkEligibility(currentWheel.value.id)
      }
    } else {
      showError('Spin Failed', errorMsg)
    }
  }
}

const onEnd = async (prize) => {
  isSpinning.value = false
  
  // Get prize data (matching BackOffice structure)
  const prizeData = prize.itemData || {}
  const prizeIcon = prize.fonts[0]?.text || prizeData.icon || '🎁'
  const prizeName = prizeData.name || 'Prize'
  const prizeValue = prizeData.value || 0
  const prizeType = prizeData.type || 'points'
  const prizeDescription = prizeData.description || ''
  
  // Store full prize information matching BackOffice fields
  lastPrize.value = {
    id: prizeData.id,
    icon: prizeIcon,
    name: prizeName,
    type: prizeType,
    value: prizeValue,
    description: prizeDescription,
    image: prizeData.image,
    // Include all BackOffice fields for reference
    prize_total_limit: prizeData.prize_total_limit,
    prize_daily_limit: prizeData.prize_daily_limit,
    probability: prizeData.probability
  }

  // Stop spinning sound
  stopSpinSound()

  // Remove spinning class from wheel wrapper
  const wheelWrapper = document.querySelector('.wheel-wrapper')
  if (wheelWrapper) {
    wheelWrapper.classList.remove('spinning')
  }

  // Determine celebration type based on prize value or type
  if (prizeValue >= 500 || prizeIcon === '👑' || prizeIcon === '💰') {
    celebrationType.value = 'jackpot'
  } else if (prizeValue >= 100 || prizeIcon === '🎰' || prizeIcon === '⭐') {
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
  
  // Refresh spin count after spin completes
  if (currentWheel.value) {
    await fetchSpinCount(currentWheel.value.id)
  }
}

const closeWinModal = () => {
  showWinModal.value = false
}

//#endregion

//#region Lifecycle
onMounted(() => {
  fetchActiveWheels()
})
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
  font-family: Titillium Web, sans-serif;
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  >svg {
    width: 50px;
    fill: #c2acff;
    height: 50px;
  }
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
  0% {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(1800deg) scale(1.05);
  }

  100% {
    transform: rotate(3600deg) scale(1);
  }
}

@keyframes ringRotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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
  font-family: Titillium Web, sans-serif;
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

  0%,
  100% {
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes buttonGlow {
  0% {
    box-shadow: 0 0 40px rgba(255, 107, 53, 0.6);
  }

  100% {
    box-shadow: 0 0 60px rgba(255, 107, 53, 1);
  }
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

/* Deposit Info */
.deposit-info {
  margin-top: 15px;
  padding: 12px 16px;
  background: rgba(122, 77, 246, 0.1);
  border: 1px solid rgba(122, 77, 246, 0.3);
  border-radius: 8px;
  text-align: center;
  min-width: 280px;
}

.deposit-label {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.deposit-label i {
  color: #7a4df6;
}

.deposit-details {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 6px;
}

.deposit-warning {
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.4);
  border-radius: 6px;
  font-size: 12px;
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.deposit-warning i {
  font-size: 14px;
}

/* Eligibility Message */
.eligibility-message {
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.4);
  color: #4caf50;
}

.eligibility-message.error {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.4);
  color: #ff6b6b;
}

.eligibility-message i {
  font-size: 16px;
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(122, 77, 246, 0.3);
  border-top-color: rgba(122, 77, 246, 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  color: rgba(255, 107, 107, 0.9);
}

.retry-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #7a4df6 0%, #4a1f9e 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(122, 77, 246, 0.4);
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

  .corner-tl,
  .corner-tr {
    top: 15px;
  }

  .corner-bl,
  .corner-br {
    bottom: 15px;
  }

  .corner-tl,
  .corner-bl {
    left: 15px;
  }

  .corner-tr,
  .corner-br {
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

  .corner-tl,
  .corner-tr {
    top: 12px;
  }

  .corner-bl,
  .corner-br {
    bottom: 12px;
  }

  .corner-tl,
  .corner-bl {
    left: 12px;
  }

  .corner-tr,
  .corner-br {
    right: 12px;
  }

  .ring-decoration {
    border-width: 1px;
  }
}
</style>
