<template>
  <div class="winning-history-panel">
    <!-- Panel Header -->
    <div class="panel-header">
      <h3 class="panel-title">🏆 Recent Winners</h3>
    </div>

    <!-- Tab Buttons -->
    <div class="tab-buttons">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'recent' }"
        @click="activeTab = 'recent'"
      >
        Recent Wins
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'top' }"
        @click="activeTab = 'top'"
      >
        Top Winners
      </button>
    </div>

    <!-- Winning History List -->
    <div class="history-list">
      <div 
        v-for="(win, index) in displayedWins" 
        :key="index" 
        class="history-item"
        :class="{ 'big-win': win.isBigWin }"
      >
        <div class="win-date">{{ win.date }}</div>
        <div class="win-details">
          <div class="player-info">
            <span class="player-name">{{ win.playerName }}</span>
            <div class="win-amount">
              <span class="prize-icon">{{ win.prize }}</span>
              <span class="points">{{ win.points }} Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('recent')

// Mock data for winning history
const recentWins = ref([
  { date: '2025-09-12', playerName: 'MYR 8.78', prize: '💰', points: 250, isBigWin: true },
  { date: '2025-09-12', playerName: 'j*****', prize: '👑', points: 250, isBigWin: true },
  { date: '2025-09-12', playerName: 'j*****', prize: '🎰', points: 250, isBigWin: false },
  { date: '2025-09-12', playerName: 'j*****', prize: '🎁', points: 250, isBigWin: false },
  { date: '2025-09-12', playerName: 'j*****', prize: '⭐', points: 250, isBigWin: false },
  { date: '2025-09-12', playerName: 'j*****', prize: '🔥', points: 250, isBigWin: false },
  { date: '2025-09-12', playerName: 'j*****', prize: '🍀', points: 250, isBigWin: false }
])

const topWins = ref([
  { date: '2025-09-10', playerName: 'Player1', prize: '👑', points: 500, isBigWin: true },
  { date: '2025-09-11', playerName: 'Player2', prize: '💰', points: 450, isBigWin: true },
  { date: '2025-09-12', playerName: 'Player3', prize: '🎰', points: 400, isBigWin: true }
])

const displayedWins = computed(() => {
  return activeTab.value === 'recent' ? recentWins.value : topWins.value
})
</script>

<style scoped>
/* Import Gaming Fonts */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&display=swap');
.winning-history-panel {
  width: 450px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(122, 77, 246, 0.3);
  border-radius: 20px;
  padding: 24px;
  font-family: 'Orbitron', 'Exo 2', monospace;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(122, 77, 246, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.winning-history-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(122, 77, 246, 0.1) 0%, 
    rgba(74, 31, 158, 0.1) 100%);
  pointer-events: none;
}

.panel-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 10px rgba(122, 77, 246, 0.8);
  margin: 0;
  letter-spacing: 1px;
}

.tab-buttons {
  display: flex;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(122, 77, 246, 0.3);
  background: rgba(0, 0, 0, 0.2);
}

.tab-btn {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  font-family: 'Orbitron', 'Exo 2', monospace;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn:hover {
  color: #fff;
  background: rgba(122, 77, 246, 0.2);
}

.tab-btn.active {
  background: linear-gradient(135deg, #7a4df6, #4a1f9e);
  color: #fff;
  box-shadow: 0 2px 8px rgba(122, 77, 246, 0.4);
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(122, 77, 246, 0.6);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: rgba(122, 77, 246, 0.8);
}

.history-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(122, 77, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.history-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(122, 77, 246, 0.1), 
    transparent);
  transition: left 0.5s ease;
}

.history-item:hover::before {
  left: 100%;
}

.history-item:hover {
  border-color: rgba(122, 77, 246, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(122, 77, 246, 0.2);
}

.history-item.big-win {
  border-color: rgba(122, 77, 246, 0.6);
  background: rgba(122, 77, 246, 0.1);
  animation: bigWinGlow 2s ease-in-out infinite alternate;
}

@keyframes bigWinGlow {
  0% { box-shadow: 0 0 15px rgba(122, 77, 246, 0.4); }
  100% { box-shadow: 0 0 25px rgba(122, 77, 246, 0.6); }
}

.win-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
}

.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-name {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.win-amount {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prize-icon {
  font-size: 18px;
  filter: drop-shadow(0 0 5px rgba(122, 77, 246, 0.6));
}

.points {
  color: rgba(122, 77, 246, 0.9);
  font-weight: 600;
  font-size: 13px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .winning-history-panel {
    width: 100%;
    max-width: 450px;
    padding: 20px;
  }
  
  .panel-title {
    font-size: 1.3rem;
  }
  
  .history-list {
    max-height: 300px;
  }
  
  .history-item {
    padding: 14px;
  }
}
</style>