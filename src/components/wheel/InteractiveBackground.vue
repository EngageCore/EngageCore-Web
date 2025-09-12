<template>
  <div class="interactive-background" :class="{ 'spinning': isSpinning, 'celebrating': showCelebration }">
    <!-- Dynamic Background -->
    <div class="bg-gradient" :class="{ 'spinning': isSpinning }"></div>
    
    <!-- Floating Orbs -->
    <div class="floating-orbs">
      <div v-for="n in 6" :key="n" class="orb" :style="getOrbStyle(n)"></div>
    </div>
    
    <!-- Enhanced Particles -->
    <div class="particles">
      <div v-for="n in 15" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>
    
    <!-- Energy Rings -->
    <div class="energy-rings" :class="{ 'active': isSpinning }">
      <div v-for="n in 3" :key="n" class="energy-ring" :style="getRingStyle(n)"></div>
    </div>
    
    <!-- Modern Gamified Celebration Effects -->
    <div v-if="showCelebration" class="celebration" :class="celebrationType">

      
    
      <!-- Screen Effects -->
      <div class="screen-effects">
        <div class="screen-flash"></div>
        <div class="screen-zoom"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isSpinning: {
    type: Boolean,
    default: false
  },
  showCelebration: {
    type: Boolean,
    default: false
  },
  celebrationType: {
    type: String,
    default: 'default'
  }
})

const getParticleStyle = (n) => {
  const delay = n * 0.3
  const duration = 6 + Math.random() * 4
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 1 + Math.random() * 2
  
  return {
    left: x + '%',
    top: y + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    animationDuration: duration + 's'
  }
}

const getOrbStyle = (n) => {
  const angle = (n * 60) * (Math.PI / 180)
  const radius = 40 + Math.random() * 20
  const x = 50 + Math.cos(angle) * radius
  const y = 50 + Math.sin(angle) * radius
  const delay = n * 0.8
  const duration = 8 + Math.random() * 4
  const size = 20 + Math.random() * 30
  
  return {
    left: x + '%',
    top: y + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    animationDuration: duration + 's'
  }
}

const getRingStyle = (n) => {
  const delay = n * 0.5
  const size = 200 + n * 100
  
  return {
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's'
  }
}

// Modern Gamified Particle System Functions
const getEnergyWaveStyle = (n) => {
  const delay = n * 0.2
  const size = 150 + n * 80
  const rotation = n * 45
  
  return {
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    transform: `rotate(${rotation}deg)`
  }
}

const getHexPulseStyle = (n) => {
  const delay = n * 0.3
  const size = 100 + n * 50
  const rotation = n * 60
  
  return {
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    transform: `rotate(${rotation}deg)`
  }
}

const getStarParticleStyle = (n) => {
  const angle = (n * 45) * (Math.PI / 180)
  const radius = 60 + Math.random() * 120
  const x = 50 + Math.cos(angle) * (radius / 100)
  const y = 50 + Math.sin(angle) * (radius / 100)
  const delay = n * 0.15
  const size = 12 + Math.random() * 8
  const rotation = Math.random() * 360
  
  return {
    left: x + '%',
    top: y + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    transform: `rotate(${rotation}deg)`
  }
}

const getDiamondParticleStyle = (n) => {
  const angle = (n * 60) * (Math.PI / 180)
  const radius = 80 + Math.random() * 100
  const x = 50 + Math.cos(angle) * (radius / 100)
  const y = 50 + Math.sin(angle) * (radius / 100)
  const delay = n * 0.2
  const size = 10 + Math.random() * 6
  
  return {
    left: x + '%',
    top: y + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's'
  }
}

const getOrbParticleStyle = (n) => {
  const angle = (n * 36) * (Math.PI / 180)
  const radius = 40 + Math.random() * 140
  const x = 50 + Math.cos(angle) * (radius / 100)
  const y = 50 + Math.sin(angle) * (radius / 100)
  const delay = n * 0.1
  const size = 6 + Math.random() * 10
  const colors = ['#FFD700', '#FF6B35', '#7a4df6', '#32CD32', '#FF1493', '#00CED1', '#FFA500', '#9370DB']
  const color = colors[n % colors.length]
  
  return {
    left: x + '%',
    top: y + '%',
    width: size + 'px',
    height: size + 'px',
    backgroundColor: color,
    animationDelay: delay + 's'
  }
}

const getTrailParticleStyle = (n) => {
  const angle = (n * 72) * (Math.PI / 180)
  const radius = 30 + Math.random() * 80
  const x = 50 + Math.cos(angle) * (radius / 100)
  const y = 50 + Math.sin(angle) * (radius / 100)
  const delay = n * 0.25
  const width = 3 + Math.random() * 4
  const height = 20 + Math.random() * 30
  
  return {
    left: x + '%',
    top: y + '%',
    width: width + 'px',
    height: height + 'px',
    animationDelay: delay + 's',
    transform: `rotate(${angle * (180 / Math.PI)}deg)`
  }
}
</script>

<style scoped>
.interactive-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    #1a1a2e 0%, 
    #16213e 50%, 
    #0f3460 100%);
  transition: all 0.5s ease;
}

.bg-gradient.spinning {
  background: linear-gradient(135deg, 
    #2a1a3e 0%, 
    #26214e 50%, 
    #1f3470 100%);
  animation: backgroundPulse 2s ease-in-out infinite alternate;
}

@keyframes backgroundPulse {
  0% { filter: brightness(1); }
  100% { filter: brightness(1.2); }
}

/* Floating Orbs */
.floating-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.orb {
  position: absolute;
  background: radial-gradient(circle, rgba(122, 77, 246, 0.4) 0%, rgba(122, 77, 246, 0.1) 70%, transparent 100%);
  border-radius: 50%;
  animation: orbFloat linear infinite;
  filter: blur(1px);
}

@keyframes orbFloat {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-20px) rotate(360deg);
    opacity: 0.3;
  }
}

/* Enhanced Particles */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: particleFloat linear infinite;
  box-shadow: 0 0 6px rgba(122, 77, 246, 0.6);
}

/* Energy Rings */
.energy-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.energy-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(122, 77, 246, 0.3);
  border-radius: 50%;
  opacity: 0;
}

.energy-rings.active .energy-ring {
  animation: energyRingPulse 2s ease-out infinite;
}

@keyframes energyRingPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}

/* Modern Gamified Celebration Effects */
.celebration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 15;
  animation: celebrationScreenShake 0.5s ease-out;
}

/* Multi-layered Burst Effects */
.celebration-burst-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.celebration-burst-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 1) 0%,
    rgba(122, 77, 246, 0.9) 30%, 
    rgba(122, 77, 246, 0.6) 60%,
    transparent 100%);
  border-radius: 50%;
  animation: burstCore 1.5s ease-out;
  box-shadow: 
    0 0 40px rgba(122, 77, 246, 0.8),
    0 0 80px rgba(122, 77, 246, 0.6),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
}

.celebration-burst-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  border: 4px solid rgba(122, 77, 246, 0.8);
  border-radius: 50%;
  animation: burstRing 2s ease-out;
  box-shadow: 
    0 0 30px rgba(122, 77, 246, 0.6),
    inset 0 0 30px rgba(122, 77, 246, 0.4);
}

.celebration-burst-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    rgba(122, 77, 246, 0.4) 0deg,
    rgba(255, 107, 53, 0.4) 60deg,
    rgba(255, 215, 0, 0.4) 120deg,
    rgba(50, 205, 50, 0.4) 180deg,
    rgba(255, 20, 147, 0.4) 240deg,
    rgba(0, 206, 209, 0.4) 300deg,
    rgba(122, 77, 246, 0.4) 360deg
  );
  border-radius: 50%;
  animation: burstOuter 2.5s ease-out;
  filter: blur(2px);
}

/* Geometric Energy Waves */
.energy-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.energy-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, 
    rgba(122, 77, 246, 0.6), 
    rgba(255, 107, 53, 0.6), 
    rgba(255, 215, 0, 0.6)
  ) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: subtract;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: subtract;
  animation: energyWavePulse 2s ease-out infinite;
}

/* Hexagonal Pulse Effects */
.hex-pulses {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hex-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(45deg, 
    rgba(122, 77, 246, 0.3), 
    rgba(255, 107, 53, 0.3)
  );
  clip-path: polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%);
  animation: hexPulse 1.8s ease-out;
  filter: drop-shadow(0 0 20px rgba(122, 77, 246, 0.6));
}

/* Advanced Particle System */
.celebration-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle-star {
  position: absolute;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: starParticleExplode 2.5s ease-out;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
}

.particle-diamond {
  position: absolute;
  background: linear-gradient(45deg, #7a4df6, #9370DB);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: diamondParticleExplode 2.2s ease-out;
  filter: drop-shadow(0 0 6px rgba(122, 77, 246, 0.8));
}

.particle-orb {
  position: absolute;
  border-radius: 50%;
  animation: orbParticleExplode 3s ease-out;
  box-shadow: 
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 30px currentColor;
}

.particle-trail {
  position: absolute;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.9) 0%,
    rgba(122, 77, 246, 0.7) 50%,
    transparent 100%
  );
  border-radius: 50px;
  animation: trailParticleExplode 2s ease-out;
  filter: blur(1px);
}

/* Screen Effects */
.screen-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.screen-flash {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 0.3) 0%,
    rgba(122, 77, 246, 0.2) 50%,
    transparent 100%
  );
  animation: screenFlash 0.8s ease-out;
}

.screen-zoom {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: screenZoom 1.5s ease-out;
}

/* Modern Gamified Animation Keyframes */
@keyframes celebrationScreenShake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-2px); }
  20% { transform: translateX(2px); }
  30% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  50% { transform: translateX(-1px); }
  60% { transform: translateX(1px); }
  70% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
  90% { transform: translateX(-1px); }
}

@keyframes burstCore {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
    filter: brightness(2) hue-rotate(0deg);
  }
  30% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
    filter: brightness(3) hue-rotate(90deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
    filter: brightness(1) hue-rotate(180deg);
  }
}

@keyframes burstRing {
  0% {
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
    opacity: 1;
    border-width: 8px;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
    opacity: 0.8;
    border-width: 4px;
  }
  100% {
    transform: translate(-50%, -50%) scale(3) rotate(360deg);
    opacity: 0;
    border-width: 1px;
  }
}

@keyframes burstOuter {
  0% {
    transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
    opacity: 0.8;
    filter: blur(0px) brightness(1.5);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
    opacity: 0.6;
    filter: blur(1px) brightness(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5) rotate(360deg);
    opacity: 0;
    filter: blur(3px) brightness(1);
  }
}

@keyframes energyWavePulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes hexPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
    opacity: 1;
    filter: brightness(1.5);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
    opacity: 0.7;
    filter: brightness(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(2) rotate(360deg);
    opacity: 0;
    filter: brightness(1);
  }
}

@keyframes starParticleExplode {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
    filter: brightness(2);
  }
  20% {
    transform: scale(1.2) rotate(72deg);
    opacity: 1;
    filter: brightness(1.5);
  }
  100% {
    transform: scale(0.3) rotate(360deg) translate(150px, -200px);
    opacity: 0;
    filter: brightness(1);
  }
}

@keyframes diamondParticleExplode {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
    filter: brightness(1.8);
  }
  25% {
    transform: scale(1.1) rotate(90deg);
    opacity: 1;
    filter: brightness(1.4);
  }
  100% {
    transform: scale(0.2) rotate(360deg) translate(-120px, -180px);
    opacity: 0;
    filter: brightness(1);
  }
}

@keyframes orbParticleExplode {
  0% {
    transform: scale(0);
    opacity: 1;
    filter: brightness(2);
  }
  30% {
    transform: scale(1.3);
    opacity: 1;
    filter: brightness(1.6);
  }
  100% {
    transform: scale(0.1) translateY(-250px);
    opacity: 0;
    filter: brightness(1);
  }
}

@keyframes trailParticleExplode {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
    filter: brightness(1.5);
  }
  40% {
    transform: scale(1) rotate(180deg);
    opacity: 0.8;
    filter: brightness(1.2);
  }
  100% {
    transform: scale(0.3) rotate(360deg) translate(100px, -300px);
    opacity: 0;
    filter: brightness(1);
  }
}

@keyframes screenFlash {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

@keyframes screenZoom {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  20% {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

/* Enhanced Celebration Types */
.celebration.jackpot .celebration-burst-core {
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 215, 0, 0.95) 20%,
    rgba(255, 165, 0, 0.8) 50%,
    rgba(255, 215, 0, 0.6) 80%,
    transparent 100%);
  animation: burstCore 1.5s ease-out, jackpotGlow 2s ease-in-out infinite alternate;
  box-shadow: 
    0 0 60px rgba(255, 215, 0, 1),
    0 0 120px rgba(255, 215, 0, 0.8),
    inset 0 0 30px rgba(255, 255, 255, 0.5);
}

.celebration.jackpot .celebration-burst-ring {
  border-color: rgba(255, 215, 0, 0.9);
  box-shadow: 
    0 0 50px rgba(255, 215, 0, 0.8),
    inset 0 0 50px rgba(255, 215, 0, 0.6);
}

.celebration.jackpot .celebration-burst-outer {
  background: conic-gradient(
    from 0deg,
    rgba(255, 215, 0, 0.6) 0deg,
    rgba(255, 165, 0, 0.6) 60deg,
    rgba(255, 255, 0, 0.6) 120deg,
    rgba(255, 215, 0, 0.6) 180deg,
    rgba(255, 140, 0, 0.6) 240deg,
    rgba(255, 255, 0, 0.6) 300deg,
    rgba(255, 215, 0, 0.6) 360deg
  );
  filter: blur(2px) brightness(1.3);
}

.celebration.big-win .celebration-burst-core {
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 1) 0%,
    rgba(138, 43, 226, 0.95) 25%,
    rgba(147, 112, 219, 0.8) 55%,
    rgba(138, 43, 226, 0.6) 85%,
    transparent 100%);
  animation: burstCore 1.5s ease-out, bigWinPulse 1.5s ease-in-out infinite;
  box-shadow: 
    0 0 50px rgba(138, 43, 226, 0.9),
    0 0 100px rgba(138, 43, 226, 0.7),
    inset 0 0 25px rgba(255, 255, 255, 0.4);
}

.celebration.big-win .celebration-burst-ring {
  border-color: rgba(138, 43, 226, 0.8);
  box-shadow: 
    0 0 40px rgba(138, 43, 226, 0.7),
    inset 0 0 40px rgba(138, 43, 226, 0.5);
}

.celebration.big-win .celebration-burst-outer {
  background: conic-gradient(
    from 0deg,
    rgba(138, 43, 226, 0.5) 0deg,
    rgba(147, 112, 219, 0.5) 60deg,
    rgba(186, 85, 211, 0.5) 120deg,
    rgba(138, 43, 226, 0.5) 180deg,
    rgba(123, 104, 238, 0.5) 240deg,
    rgba(147, 112, 219, 0.5) 300deg,
    rgba(138, 43, 226, 0.5) 360deg
  );
  filter: blur(2px) brightness(1.2);
}

@keyframes jackpotGlow {
  0% { 
    filter: brightness(1.2) hue-rotate(0deg) saturate(1.2);
    transform: translate(-50%, -50%) scale(1);
  }
  100% { 
    filter: brightness(1.8) hue-rotate(15deg) saturate(1.5);
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@keyframes bigWinPulse {
  0%, 100% { 
    filter: brightness(1) saturate(1);
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    filter: brightness(1.4) saturate(1.3);
    transform: translate(-50%, -50%) scale(1.03);
  }
}
</style>