<template>
  <div class="winning-history-panel">
    <!-- Panel Header -->
    <div class="panel-header">
      <h3 class="panel-title">🏆 Recent Winners</h3>
    </div>

    <!-- Tab Buttons -->
    <div class="tab-buttons">
      <button class="tab-btn" :class="{ active: activeTab === 'recent' }" @click="activeTab = 'recent'">
        Recent Wins
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'top' }" @click="activeTab = 'top'">
        Top Winners
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <p>Loading history...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-state">
      <p>{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && displayedWins.length === 0" class="empty-state">
      <p>No spin history available yet.</p>
    </div>

      <!-- Winning History List -->
    <div v-if="!loading && !error" class="history-list">
      <div v-for="(win, index) in displayedWins" :key="win.id || index" class="history-item" :class="{ 'big-win': win.isBigWin }">
        <div class="win-date">{{ formatDate(win.spun_at || win.created_at) }}</div>
        <div class="win-details">
          <div class="player-info">
            <span class="player-name">{{ win.member_name || win.playerName || 'Player' }}</span>
            <div class="win-amount">
              <span class="prize-icon">{{ win.winning_item?.icon || win.item_icon || win.prize || '🎁' }}</span>
              <div class="prize-info">
                <span class="prize-name-text">{{ win.winning_item?.name || win.item_name || 'Prize' }}</span>
                <span v-if="win.winning_item?.value || win.item_value" class="points">
                  {{ win.winning_item?.value || win.item_value || 0 }} 
                  {{ getPrizeTypeLabel(win.winning_item?.type || win.item_type) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useCallApi } from '@/hooks/useCallApi'

const props = defineProps({
  wheelId: {
    type: String,
    required: true
  }
})

const { callApi } = useCallApi()
const activeTab = ref('recent')
const loading = ref(false)
const error = ref(null)

// Spin history data
const recentWins = ref([])
const topWins = ref([])

// Fetch spin history
const fetchSpinHistory = async () => {
  if (!props.wheelId) return
  
  try {
    loading.value = true
    error.value = null
    
    const response = await callApi(`/member/wheels/${props.wheelId}/history`, 'GET', null, {
      page: 1,
      limit: 20,
      order: 'desc'
    })
    
    if (response && response.spins) {
      // Process recent wins (matching BackOffice structure)
      recentWins.value = response.spins.map(spin => {
        // Get winning item data (matching BackOffice fields)
        const winningItem = spin.winning_item || {
          id: spin.winning_item_id,
          name: spin.item_name || spin.winning_item?.name,
          type: spin.item_type || spin.winning_item?.type || 'points',
          value: parseFloat(spin.item_value || spin.winning_item?.value || 0),
          icon: spin.item_icon || spin.winning_item?.icon || '🎁',
          image: spin.winning_item?.image,
          description: spin.winning_item?.description,
          probability: spin.winning_item?.probability
        }
        
        return {
          id: spin.id,
          spun_at: spin.spun_at || spin.created_at,
          member_name: spin.member_name || spin.member_id,
          winning_item: winningItem,
          // Keep legacy fields for backward compatibility
          item_icon: winningItem.icon,
          item_value: winningItem.value,
          item_name: winningItem.name,
          item_type: winningItem.type,
          // Determine if it's a big win (matching BackOffice logic)
          isBigWin: winningItem.value >= 100 || winningItem.type === 'voucher' || winningItem.type === 'item'
        }
      })
      
      // For top wins, sort by value and take top 10
      topWins.value = [...recentWins.value]
        .sort((a, b) => (b.winning_item?.value || b.item_value || 0) - (a.winning_item?.value || a.item_value || 0))
        .slice(0, 10)
    }
  } catch (err) {
    error.value = err.message || 'Failed to load spin history'
    console.error('Error fetching spin history:', err)
  } finally {
    loading.value = false
  }
}

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get prize type label (matching BackOffice structure)
const getPrizeTypeLabel = (type) => {
  if (!type) return 'Points'
  if (type === 'points') return 'Points'
  if (type === 'voucher') return 'Voucher'
  if (type === 'item') return 'Item'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const displayedWins = computed(() => {
  return activeTab.value === 'recent' ? recentWins.value : topWins.value
})

// Watch for wheelId changes
watch(() => props.wheelId, (newId) => {
  if (newId) {
    fetchSpinHistory()
  }
})

onMounted(() => {
  if (props.wheelId) {
    fetchSpinHistory()
  }
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
  0% {
    box-shadow: 0 0 15px rgba(122, 77, 246, 0.4);
  }

  100% {
    box-shadow: 0 0 25px rgba(122, 77, 246, 0.6);
  }
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
  flex-direction: row;
}

.prize-icon {
  font-size: 18px;
  filter: drop-shadow(0 0 5px rgba(122, 77, 246, 0.6));
}

.prize-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.prize-name-text {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 12px;
}

.points {
  color: rgba(122, 77, 246, 0.9);
  font-weight: 600;
  font-size: 13px;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.error-state {
  color: rgba(255, 107, 107, 0.9);
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