<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Close Button -->
      <button class="close-btn" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Prize Display -->
      <div class="prize-section">
        <div class="celebration-icon">🎉</div>
        <h2 class="win-title">Congratulations!</h2>
        <div class="prize-display">
          <div class="prize-icon">{{ prize }}</div>
          <p class="prize-text">You won: <span class="prize-name">{{ getPrizeName(prize) }}</span></p>
        </div>
      </div>

      <!-- Celebration Effects -->
      <div class="celebration-effects">
        <div v-for="n in 8" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
      </div>

      <!-- Action Button -->
      <button class="claim-btn" @click="closeModal">
        Awesome!
      </button>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  prize: {
    type: String,
    required: true
  },
  celebrationType: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const getPrizeName = (prizeIcon) => {
  const prizeNames = {
    '💰': 'Gold Coins',
    '👑': 'Royal Crown',
    '🎲': 'Lucky Dice',
    '🎰': 'Jackpot',
    '🎁': 'Mystery Gift',
    '⭐': 'Star Prize',
    '🔥': 'Fire Bonus',
    '🍀': 'Lucky Clover'
  }
  return prizeNames[prizeIcon] || 'Special Prize'
}

const getConfettiStyle = (n) => {
  const colors = ['#FFD700', '#FF6B35', '#7a4df6', '#32CD32', '#FF1493', '#00CED1']
  const angle = (n * 45) * (Math.PI / 180)
  const radius = 80 + Math.random() * 40
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const delay = n * 0.1
  const color = colors[n % colors.length]

  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    backgroundColor: color,
    animationDelay: delay + 's'
  }
}
</script>

<style scoped>
/* Import Gaming Fonts */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&display=swap');

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 2px solid #7a4df6;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow:
    0 0 30px rgba(122, 77, 246, 0.5),
    0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.4s ease-out;
  font-family: Titillium Web, sans-serif;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
  width: 50px;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.prize-section {
  margin-bottom: 30px;
}

.celebration-icon {
  font-size: 48px;
  margin-bottom: 15px;
  animation: bounce 1s ease-in-out infinite;
}

.win-title {
  font-size: 32px;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.prize-display {
  margin-bottom: 20px;
}

.prize-icon {
  font-size: 64px;
  margin-bottom: 15px;
  animation: prizeGlow 2s ease-in-out infinite;
}

.prize-text {
  font-size: 18px;
  color: #ccc;
  margin: 0;
}

.prize-name {
  color: #7a4df6;
  font-weight: bold;
  font-size: 20px;
}

.celebration-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  border-radius: 20px;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: confettiFall 3s ease-out infinite;
}

.claim-btn {
  background: linear-gradient(135deg, #7a4df6 0%, #4a1f9e 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 15px 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: Titillium Web, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(122, 77, 246, 0.3);
}

.claim-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(122, 77, 246, 0.4);
}

.claim-btn:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  0% {
    transform: scale(0.7) translateY(-50px);
    opacity: 0;
  }

  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes prizeGlow {

  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(122, 77, 246, 0.5));
  }

  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px rgba(122, 77, 246, 0.8));
  }
}

@keyframes confettiFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(200px) rotate(360deg);
    opacity: 0;
  }
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
  .modal-content {
    padding: 30px 20px;
    margin: 20px;
  }

  .win-title {
    font-size: 28px;
  }

  .prize-icon {
    font-size: 48px;
  }

  .claim-btn {
    padding: 12px 30px;
    font-size: 16px;
  }
}
</style>