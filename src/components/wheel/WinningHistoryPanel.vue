<template>
  <div class="winning-history-panel">
    <!-- Panel Header -->
    <div class="panel-header">
      <div class="header-content">
        <i class="ri-history-line header-icon"></i>
        <h3 class="panel-title">Spin History</h3>
      </div>
      <button class="refresh-btn" @click="fetchSpinHistory" :disabled="loading" title="Refresh history">
        <i class="ri-refresh-line" :class="{ 'spinning': loading }"></i>
      </button>
    </div>

    <!-- Tab Buttons -->
    <div class="tab-buttons">
      <button class="tab-btn" :class="{ active: activeTab === 'recent' }" @click="activeTab = 'recent'">
        <i class="ri-time-line"></i>
        <span>Recent</span>
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'top' }" @click="activeTab = 'top'">
        <i class="ri-trophy-line"></i>
        <span>Best Wins</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading history...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-state">
      <i class="ri-error-warning-line"></i>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchSpinHistory">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && displayedWins.length === 0" class="empty-state">
      <i class="ri-inbox-line"></i>
      <p>No spin history available yet.</p>
    </div>

    <!-- Winning History List -->
    <div v-if="!loading && !error && displayedWins.length > 0" class="history-list">
      <div v-for="(win, index) in displayedWins" :key="win.id || index" class="history-item" :class="{ 'big-win': win.isBigWin }">
        <div class="item-header">
          <div class="item-date">
            <i class="ri-calendar-line"></i>
            <span>{{ formatDate(win.spun_at || win.created_at) }}</span>
          </div>
          <div v-if="win.isBigWin" class="big-win-badge">
            <i class="ri-star-fill"></i>
            <span>Big Win</span>
          </div>
        </div>
        <div class="item-content">
          <div class="prize-display">
            <div class="prize-icon-wrapper" :class="getPrizeTypeClass(win.winning_item?.type || win.item_type)">
              <i :class="getPrizeIcon(win.winning_item?.type || win.item_type)"></i>
            </div>
            <div class="prize-details">
              <span class="prize-name">{{ win.winning_item?.name || win.item_name || 'Prize' }}</span>
              <span v-if="win.winning_item?.value || win.item_value" class="prize-value">
                {{ formatValue(win.winning_item?.value || win.item_value) }} 
                {{ getPrizeTypeLabel(win.winning_item?.type || win.item_type) }}
              </span>
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
          icon: spin.item_icon || spin.winning_item?.icon,
          image: spin.winning_item?.image,
          description: spin.winning_item?.description,
          probability: spin.winning_item?.probability
        }
        
        return {
          id: spin.id,
          spun_at: spin.spun_at || spin.created_at,
          member_name: spin.member_name || spin.member_user_id,
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

// Get prize icon based on type
const getPrizeIcon = (type) => {
  if (!type || type === 'points') return 'ri-coins-line'
  if (type === 'voucher') return 'ri-coupon-line'
  if (type === 'item') return 'ri-gift-line'
  return 'ri-star-line'
}

// Get prize type class for styling
const getPrizeTypeClass = (type) => {
  if (!type || type === 'points') return 'type-points'
  if (type === 'voucher') return 'type-voucher'
  if (type === 'item') return 'type-item'
  return 'type-default'
}

// Format value with commas
const formatValue = (value) => {
  if (!value) return '0'
  return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
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
/* Import RemixIcon */
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

.winning-history-panel {
  width: 450px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(122, 77, 246, 0.3);
  border-radius: 20px;
  padding: 24px;
  font-family: Titillium Web, sans-serif;
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
  z-index: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: rgba(122, 77, 246, 0.9);
  filter: drop-shadow(0 0 8px rgba(122, 77, 246, 0.6));
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 10px rgba(122, 77, 246, 0.8);
  margin: 0;
  letter-spacing: 1px;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(122, 77, 246, 0.5);
  border-radius: 50%;
  padding: 0;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(10px);
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(122, 77, 246, 0.2);
  border-color: rgba(122, 77, 246, 0.8);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(122, 77, 246, 0.4);
}

.refresh-btn:active:not(:disabled) {
  transform: scale(1.05);
}

.refresh-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.refresh-btn i.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.tab-buttons {
  display: flex;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(122, 77, 246, 0.3);
  background: rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.tab-btn {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  font-family: Titillium Web, sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab-btn i {
  font-size: 16px;
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
  position: relative;
  z-index: 1;
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
  border-color: rgba(212, 175, 55, 0.4);
  background: rgba(212, 175, 55, 0.1);
  animation: bigWinGlow 2s ease-in-out infinite alternate;
}

@keyframes bigWinGlow {
  0% {
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
  }
  100% {
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.6);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.item-date i {
  font-size: 14px;
  color: rgba(122, 77, 246, 0.7);
}

.big-win-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.big-win-badge i {
  font-size: 12px;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6));
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prize-display {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.prize-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  border: 2px solid;
}

.prize-icon-wrapper i {
  font-size: 24px;
  display: inline-block;
  font-style: normal;
  font-family: 'remixicon' !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure all RemixIcon classes work */
[class^="ri-"],
[class*=" ri-"] {
  font-family: 'remixicon' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
}

.prize-icon-wrapper.type-points {
  background: linear-gradient(135deg, rgba(122, 77, 246, 0.15), rgba(74, 31, 158, 0.15));
  color: #9d6fff;
  border-color: rgba(122, 77, 246, 0.4);
  box-shadow: 0 0 10px rgba(122, 77, 246, 0.3);
}

.prize-icon-wrapper.type-voucher {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.15));
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

.prize-icon-wrapper.type-item {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(255, 215, 0, 0.1));
  color: #ffd700;
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.prize-icon-wrapper.type-default {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.2);
}

.prize-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.prize-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.prize-value {
  color: rgba(122, 77, 246, 0.9);
  font-weight: 600;
  font-size: 13px;
  text-shadow: 0 0 8px rgba(122, 77, 246, 0.5);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  position: relative;
  z-index: 1;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(122, 77, 246, 0.3);
  border-top-color: rgba(122, 77, 246, 1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.error-state {
  color: rgba(255, 107, 107, 0.9);
}

.error-state i {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.8;
  filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.5));
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #7a4df6 0%, #4a1f9e 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(122, 77, 246, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(122, 77, 246, 0.4);
  background: linear-gradient(135deg, #8a5df6 0%, #5a2fae 100%);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
  color: rgba(122, 77, 246, 0.5);
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