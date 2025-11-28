<template>
  <div class="content-grid">
    <div class="section-banner">
      <img class="section-banner-icon" src="@/assets/img/banner/quests-icon.png" alt="quests-icon">
      <p class="section-banner-title">Quests</p>
      <p class="section-banner-text">Complete quests to gain experience and level up!</p>
    </div>

    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Get an early lead!</p>
        <h2 class="section-title">Featured Quests</h2>
      </div>
    </div>

    <div class="grid grid-3-3-3-3" :class="{'centered': questList.length > 3 }">
      <div :class="['quest-item', { completed: quest.completed }]" v-for="(quest, index) in questList" :key="quest.id">
        <div class="quest-item-cover" :class="`cover-0${index + 1}`"></div>

        <p class="text-sticker small-text">
          <svg class="text-sticker-icon icon-plus-small">
            <use xlink:href="#svg-plus-small"></use>
          </svg>
          SGD {{ quest.reward_amount }} 
        </p>

        <div class="quest-item-info">
          <div class="quest-item-badge">
            <img v-if="quest.type === 'accumulate_deposit'" src="@/assets/img/quest/completedq-b.png" alt="gold-badge">
            <img v-else src="@/assets/img/quest/openq-b.png" alt="silver-badge">
          </div>

          <p class="quest-item-title">{{ quest.name }}</p>
          <p class="quest-item-text">{{ quest.description }}</p>

          <div class="progress-stat">
            <div class="progress-stat-bar">
              <div class="progress" :style="{ '--percent': quest.target ? ((quest.current / quest.target) * 100).toFixed(2) + '%' : '0%' }"></div>
            </div>

            <div class="bar-progress-wrap small">
              <p class="bar-progress-info negative start">
                <span class="bar-progress-text no-space">
                  <template v-if="quest.type === 'accumulate_deposit' && !quest.completed">
                    {{ quest.target ? ((quest.current / quest.target) * 100).toFixed(2) : 0 }}%
                  </template>

                  <template v-else-if="quest.type === 'deposit' && !quest.completed">
                    {{ quest.current }} / {{ quest.target }}
                  </template>
                </span>completed
              </p>
            </div>
          </div>

          <div class="quest-item-meta"></div>
        </div>
      </div>
    </div>

    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Gain EXP and level up!</p>
        <h2 class="section-title">Browse All Quests</h2>
      </div>
    </div>

    <div class="section-filters-bar v2">
      <form class="form">
        <div class="form-item split medium">
          <div class="form-select">
            <label for="quest-filter-show">Show</label>
            <select id="quest-filter-show" name="quest_filter_show" v-model="status">
              <option value="">All Quests</option>
              <option value="claimed">Completed Quests</option>
              <option value="active">Open Quests</option>
              <option value="pending">Pending Quests</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <div class="form-select">
            <label for="quest-filter-criteria">Filter By</label>
            <select id="quest-filter-criteria" name="quest_filter_criteria" v-model="type">
              <option value="">All</option>
              <option value="accumulate_deposit">Quest Progress</option>
              <option value="deposit">Quest Times</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <div class="form-select">
            <label for="quest-filter-order">Order By</label>
            <select id="quest-filter-order" name="quest_filter_order" v-model="order">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <button type="button" class="button secondary" @click="getQuest">Filter Quests</button>
        </div>
      </form>
    </div>

    <div class="table table-quests split-rows">
      <div class="table-header">
        <div class="table-header-column">
          <p class="table-header-title">Quest</p>
        </div>

        <div class="table-header-column">
          <p class="table-header-title">Description</p>
        </div>

        <div class="table-header-column centered padded-big-left">
          <p class="table-header-title">Reward</p>
        </div>

        <div class="table-header-column centered">
          <p class="table-header-title">Progress</p>
        </div>
      </div>

      <div class="table-body same-color-rows">
        <div class="table-row small" v-for="quest in questList" :key="quest.id">
          <div class="table-column">
            <div class="table-information">
              <img class="table-image" v-if="quest.type === 'accumulate_deposit'" src="@/assets/img/quest/completedq-s.png" alt="gold-badge" />
              <img class="table-image" v-else-if="quest.type === 'deposit'" src="@/assets/img/quest/openq-s.png" alt="silver-badge" />
              <p class="table-title">{{ quest.name }}</p>
            </div>
          </div>
          <div class="table-column">
            <p class="table-text">{{ quest.description }}</p>
          </div>
          <div class="table-column centered padded-big-left">
            <p class="text-sticker void">
              <svg class="text-sticker-icon icon-plus-small">
                <use xlink:href="#svg-plus-small"></use>
              </svg>
              SGD {{ quest.reward_amount }}
            </p>
          </div>
          <div class="table-column padded-big-left">
            <div class="progress-container" v-if="!quest.completed">
              <div class="progress-wrapper">
                <div class="progress" :style="{ '--percent': quest.target ? ((quest.current / quest.target) * 100).toFixed(2) + '%' : '0%' }"></div>
              </div>
              <p class="text-sticker void progress-text">
                <template v-if="quest.type === 'accumulate_deposit' && !quest.completed">
                  {{ quest.target ? ((quest.current / quest.target) * 100).toFixed(2) : 0 }}%
                </template>
                <template v-else-if="quest.type === 'deposit' && !quest.completed">
                  {{ quest.current }} / {{ quest.target }}
                </template>
              </p>
            </div>
            <button v-else-if="quest.completed && quest.status === 'active'" @click="openClaimModal(quest)" class="button secondary">Claim Reward</button>
            <button v-else class="button disabled" disabled>Claimed</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Claim Reward Modal -->
    <div v-if="showClaimModal" class="modal-overlay" @click="closeClaimModal">
      <div class="popup-box small claim-modal" @click.stop>
        <!-- Modal Header -->
        <div class="popup-box-header">
          <button class="popup-close-button" @click="closeClaimModal">
            <svg class="popup-close-button-icon icon-cross">
              <use xlink:href="#svg-cross"></use>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="popup-box-body">
          <div class="popup-box-content">
            <!-- Trophy Icon -->
            <div class="claim-modal-icon">
              <img src="@/assets/img/icons/trophy-reward.svg" alt="Trophy" class="trophy-icon" />
            </div>

            <!-- Quest Info -->
            <div class="claim-modal-info">
              <h3 class="popup-box-title">Quest Completed!</h3>
              <p class="popup-box-subtitle">
                <span class="light">You have successfully completed:</span>
              </p>
              <p class="quest-completed-title">{{ selectedQuest?.title }}</p>
            </div>

            <!-- Reward Info -->
            <div class="claim-modal-reward">
              <div class="reward-badge">
                <svg class="text-sticker-icon icon-plus-small">
                  <use xlink:href="#svg-plus-small"></use>
                </svg>
                <span class="reward-amount">{{ selectedQuest?.exp }} EXP</span>
              </div>
              <p class="reward-text">Experience points have been added to your account!</p>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="popup-box-actions">
          <button class="button secondary popup-box-action" @click="closeClaimModal">Close</button>
          <button class="button primary popup-box-action" @click="claimReward">Claim Reward</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'
import { computed, ref, onMounted } from 'vue'
import { useCallApi } from '@/hooks/useCallApi'

const { callApi } = useCallApi()
// Notification system
const { showSuccess, showError, showWarning, showConfirmation } = useNotification()

// Modal state management
const showClaimModal = ref(false)
const selectedQuest = ref(null)
const questList = ref([]);

// Modal functions
const openClaimModal = (quest) => {
  selectedQuest.value = quest
  showClaimModal.value = true
  document.body.style.overflow = 'hidden' // Prevent background scroll
}

const closeClaimModal = () => {
  showClaimModal.value = false
  selectedQuest.value = null
  document.body.style.overflow = 'auto' // Restore scroll
}

const claimReward = async () => {
  if (selectedQuest.value) {
    try {
      // Close modal first
      closeClaimModal()

      // Show processing notification
      const loadingId = showWarning('Processing...', 'Claiming your reward, please wait.')

      // Simulate API call delay
      setTimeout(() => {
        // Update quest status to claimed
        // const questIndex = quests.value.findIndex(q => q.title === selectedQuest.value.title)
        // if (questIndex !== -1) {
        //   quests.value[questIndex].status = 'claimed'

          // Show success notification
          showSuccess(
            'Reward Claimed!',
            `You've earned ${selectedQuest.value.exp} EXP for completing "${selectedQuest.value.title}"`
          )
        // } else {
          // showError('Error', 'Failed to claim reward. Please try again.')
        // }
      }, 1500)
    } catch (error) {
      showError('Error', 'An unexpected error occurred while claiming your reward.')
      closeClaimModal()
    }
  }
};

const type = ref('');
const status = ref('');
const order = ref('desc');
const getQuest = async () => {
  try {
    const params = {
      order: order.value,
    }

    if(type.value) {
      params.type = type.value
    }

    if(status.value) {
      params.status = status.value
    }
    
    const resp = await callApi("/member/missions", "GET", null, params);
    
    questList.value = resp;
  } catch (error) {
    showError('Error', 'An unexpected error occurred while fetching quests.')
  }
}

onMounted(() => {
  getQuest()
})
</script>

<style scoped>
.cover-01 {
  background: url('@/assets/img/quest/cover/01.png') no-repeat center/cover;
}

.cover-02 {
  background: url('@/assets/img/quest/cover/02.png') no-repeat center/cover;
}

.cover-03 {
  background: url('@/assets/img/quest/cover/03.png') no-repeat center/cover;
}

.cover-04 {
  background: url('@/assets/img/quest/cover/04.png') no-repeat center/cover;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

/* Claim Modal */
.claim-modal {
  opacity: 1 !important;
  visibility: visible !important;
  transform: scale(1);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 480px;
  width: 90%;
  background: linear-gradient(135deg, #1d2333 0%, #252b3d 100%);
  border: 1px solid #3f485f;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Modal Header */
.popup-box-header {
  position: relative;
  padding: 20px 28px 0;
  display: flex;
  justify-content: flex-end;
}

.popup-close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.popup-close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.popup-close-button-icon {
  width: 16px;
  height: 16px;
  fill: #9aa4bf;
  transition: fill 0.2s ease;
}

.popup-close-button:hover .popup-close-button-icon {
  fill: #fff;
}

/* Modal Content */
.claim-modal .popup-box-content {
  text-align: center;
  padding: 20px 28px;
  width: 100%;
}

/* Trophy Icon */
.claim-modal-icon {
  margin-bottom: 24px;
  justify-content: center;
  display: flex;
}

.trophy-icon {
  width: 80px;
  height: 80px;
  animation: trophyBounce 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(255, 215, 0, 0.3));
}

/* Quest Info */
.claim-modal-info {
  margin-bottom: 32px;
}

.claim-modal .popup-box-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
  padding: 0;
}

.claim-modal .popup-box-subtitle {
  margin-bottom: 16px;
  text-align: center;
  padding: 0;
}

.quest-completed-title {
  color: #7750f8;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

/* Reward Info */
.claim-modal-reward {
  margin-bottom: 24px;
}

.reward-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #7750f8 0%, #4cd4f7 100%);
  padding: 12px 24px;
  border-radius: 25px;
  margin-bottom: 16px;
  animation: rewardPulse 2s ease-in-out infinite;
}

.reward-amount {
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
}

.reward-text {
  color: #9aa4bf;
  font-size: 0.875rem;
  margin: 0;
}

/* Modal Actions */
.claim-modal .popup-box-actions {
  padding: 24px 28px 32px;
  gap: 16px;
}

.claim-modal .popup-box-action {
  flex: 1;
  margin-right: 0;
  transition: all 0.3s ease;
}

.claim-modal .button.primary {
  background: linear-gradient(135deg, #7750f8 0%, #4cd4f7 100%);
  border: none;
  color: #fff;
  font-weight: 700;
}

.claim-modal .button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(119, 80, 248, 0.4);
}

.claim-modal .button.secondary:hover {
  transform: translateY(-2px);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes trophyBounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  40% {
    transform: translateY(-10px) rotate(5deg);
  }

  60% {
    transform: translateY(-5px) rotate(-3deg);
  }
}

@keyframes rewardPulse {

  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(119, 80, 248, 0.3);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(119, 80, 248, 0.5);
  }
}

/* Responsive Design */
@media screen and (max-width: 680px) {
  .claim-modal {
    max-width: 95%;
    margin: 20px;
  }

  .claim-modal .popup-box-content {
    padding: 16px 20px;
  }

  .claim-modal .popup-box-actions {
    padding: 20px;
    flex-direction: column;
  }

  .claim-modal .popup-box-action {
    width: 100%;
    margin-bottom: 12px;
  }

  .claim-modal .popup-box-action:last-child {
    margin-bottom: 0;
  }

  .trophy-icon {
    width: 60px;
    height: 60px;
  }

  .claim-modal .popup-box-title {
    font-size: 1.25rem;
  }
}

@media screen and (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }

  .claim-modal {
    max-width: 100%;
  }
}

.table-column.centered .text-sticker {
  justify-content: center !important;
}
</style>