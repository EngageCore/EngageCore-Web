<template>
  <div class="content-grid">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Your Accomplishments</p>
        <h2 class="section-title">Quest History</h2>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="section-filters-bar v2">
      <form class="form">
        <div class="form-item split medium">
          <div class="form-select">
            <label for="quest-filter-show">Show</label>
            <select id="quest-filter-show" v-model="filterShow">
              <option value="all">All Quests</option>
              <option value="completed">Completed Quests</option>
              <option value="in-progress">In Progress</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <div class="form-select">
            <label for="quest-filter-criteria">Filter By</label>
            <select id="quest-filter-criteria" v-model="filterDifficulty">
              <option value="all">All Difficulties</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <div class="form-select">
            <label for="quest-filter-order">Order By</label>
            <select id="quest-filter-order" v-model="filterOrder">
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="exp-desc">EXP High → Low</option>
              <option value="exp-asc">EXP Low → High</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <button type="button" class="button secondary" @click="applyFilters">Filter Quests</button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <div class="table table-quests split-rows">
      <div class="table-header">
        <div class="table-header-column">
          <p class="table-header-title">Quest</p>
        </div>
        <div class="table-header-column">
          <p class="table-header-title">Description</p>
        </div>
        <div class="table-header-column centered padded-big-left">
          <p class="table-header-title">Experience</p>
        </div>
        <div class="table-header-column padded-big-left">
          <p class="table-header-title">Completed On</p>
        </div>
      </div>

      <div class="table-body same-color-rows">
        <div class="table-row small quest-row" v-for="quest in paginatedQuests" :key="quest.title"
          @click="openQuestModal(quest)">
          <div class="table-column">
            <div class="table-information">
              <img class="table-image" v-if="quest.difficulty === 'gold'" src="@/assets/img/quest/completedq-s.png"
                alt="gold-badge" />
              <img class="table-image" v-else src="@/assets/img/quest/openq-s.png" alt="silver-badge" />
              <p class="table-title">{{ quest.title }}</p>
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
              {{ quest.exp }} EXP
            </p>
          </div>
          <div class="table-column padded-big-left">
            <p class="table-text">{{ formatDate(quest.completedAt) }}</p>
          </div>
        </div>

        <div v-if="paginatedQuests.length === 0" class="table-row">
          <div class="table-column" style="grid-column: 1 / -1;">
            <p class="table-text">No records found.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Quest Cards (for very small screens) -->
    <div class="mobile-quest-list">
      <div class="mobile-quest-card" v-for="quest in paginatedQuests" :key="'mobile-' + quest.title"
        @click="openQuestModal(quest)">
        <div class="mobile-quest-header">
          <img class="mobile-quest-badge" v-if="quest.difficulty === 'gold'" src="@/assets/img/quest/completedq-s.png"
            alt="gold-badge" />
          <img class="mobile-quest-badge" v-else src="@/assets/img/quest/openq-s.png" alt="silver-badge" />
          <h4 class="mobile-quest-title">{{ quest.title }}</h4>
        </div>
        <p class="mobile-quest-description">{{ quest.description }}</p>
        <div class="mobile-quest-footer">
          <span class="mobile-quest-exp">+{{ quest.exp }} EXP</span>
          <span class="mobile-quest-date">{{ formatDate(quest.completedAt) }}</span>
        </div>
      </div>

      <div v-if="paginatedQuests.length === 0" class="mobile-quest-card">
        <p class="mobile-quest-description">No records found.</p>
      </div>
    </div>

    <!-- Quest Details Modal -->
    <div v-if="showQuestModal" class="modal-overlay" @click="closeQuestModal">
      <div class="popup-box small quest-details-modal" @click.stop>
        <!-- Modal Header -->
        <div class="popup-box-header">
          <button class="popup-close-button" @click="closeQuestModal">
            <svg class="popup-close-button-icon icon-cross">
              <use xlink:href="#svg-cross"></use>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="popup-box-body">
          <div class="popup-box-content">
            <!-- Quest Badge -->
            <div class="quest-modal-icon">
              <img v-if="selectedQuest?.difficulty === 'gold'" src="@/assets/img/quest/completedq-b.png"
                alt="Gold Quest Badge" class="quest-badge-icon" />
              <img v-else src="@/assets/img/quest/openq-b.png" alt="Silver Quest Badge" class="quest-badge-icon" />
            </div>

            <!-- Quest Info -->
            <div class="quest-modal-info">
              <h3 class="popup-box-title">{{ selectedQuest?.title }}</h3>
              <p class="popup-box-subtitle">
                <span class="light">{{ selectedQuest?.description }}</span>
              </p>
            </div>

            <!-- Quest Details -->
            <div class="quest-modal-details">
              <div class="detail-item">
                <span class="detail-label">Experience Earned:</span>
                <div class="reward-badge">
                  <svg class="text-sticker-icon icon-plus-small">
                    <use xlink:href="#svg-plus-small"></use>
                  </svg>
                  <span class="reward-amount">{{ selectedQuest?.exp }} EXP</span>
                </div>
              </div>

              <div class="detail-item">
                <span class="detail-label">Difficulty:</span>
                <span class="difficulty-badge" :class="selectedQuest?.difficulty">
                  {{ selectedQuest?.difficulty?.charAt(0).toUpperCase() + selectedQuest?.difficulty?.slice(1) }}
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Completed On:</span>
                <span class="completion-date">{{ formatDate(selectedQuest?.completedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="popup-box-actions">
          <button class="button primary popup-box-action" @click="closeQuestModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="section-pager-bar" v-if="totalPages > 1">
      <div class="section-pager">
        <a class="section-pager-item" :class="{ disabled: currentPage === 1 }" @click.prevent="prevPage">
          <svg class="section-pager-item-icon icon-small-arrow">
            <use xlink:href="#svg-small-arrow"></use>
          </svg>
        </a>

        <a v-for="p in pagesToShow" :key="p.key" class="section-pager-item"
          :class="{ active: p.num === currentPage, disabled: p.ellipsis }"
          @click.prevent="!p.ellipsis && goToPage(p.num)">
          <p class="section-pager-item-text">{{ p.ellipsis ? '…' : p.num }}</p>
        </a>

        <a class="section-pager-item" :class="{ disabled: currentPage === totalPages }" @click.prevent="nextPage">
          <svg class="section-pager-item-icon icon-small-arrow" style="transform: scaleX(-1);">
            <use xlink:href="#svg-small-arrow"></use>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'

// Modal state management
const showQuestModal = ref(false)
const selectedQuest = ref(null)

// Modal functions
const openQuestModal = (quest) => {
  selectedQuest.value = quest
  showQuestModal.value = true
  document.body.style.overflow = 'hidden' // Prevent background scroll
}

const closeQuestModal = () => {
  showQuestModal.value = false
  selectedQuest.value = null
  document.body.style.overflow = 'auto' // Restore scroll
}

const quests = ref([
  { title: "First Deposit", description: "Make your first deposit into your account", exp: 20, difficulty: "silver", status: "claimed", completedAt: "2025-08-12" },
  { title: "Turnover King", description: "Achieve a total turnover of $50,000", exp: 100, difficulty: "gold", status: "claimed", completedAt: "2025-08-28" },
  { title: "High Roller", description: "Deposit a total of $10,000", exp: 60, difficulty: "gold", status: "claimed", completedAt: "2025-09-03" },
  { title: "Cash Out Pro", description: "Withdraw at least $5,000 in total", exp: 60, difficulty: "silver", status: "claimed", completedAt: "2025-09-05" },
  { title: "Weekly Winner", description: "Deposit at least $2,000 in one week", exp: 50, difficulty: "silver", status: "claimed", completedAt: "2025-09-07" },
])

const filterShow = ref('all')
const filterDifficulty = ref('all')
const filterOrder = ref('date-desc')
const currentPage = ref(1)
const pageSize = 5

const filteredQuests = computed(() => {
  let list = [...quests.value]

  // 只允许 claimed 和 in-progress (只是保留结构，历史中几乎全是 claimed)
  if (filterShow.value === 'completed') list = list.filter(q => q.status === 'claimed')
  else if (filterShow.value === 'in-progress') list = list.filter(q => q.status === 'in-progress')

  if (filterDifficulty.value !== 'all')
    list = list.filter(q => q.difficulty === filterDifficulty.value)

  switch (filterOrder.value) {
    case 'date-asc': list.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt)); break
    case 'exp-desc': list.sort((a, b) => b.exp - a.exp); break
    case 'exp-asc': list.sort((a, b) => a.exp - b.exp); break
    default: list.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredQuests.value.length / pageSize)))

watchEffect(() => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

const paginatedQuests = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredQuests.value.slice(start, start + pageSize)
})

const applyFilters = () => { currentPage.value = 1 }

const goToPage = (p) => { currentPage.value = p }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const items = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) items.push({ num: i, ellipsis: false, key: i })
    return items
  }
  items.push({ num: 1, ellipsis: false, key: 'p1' })
  if (cur > 4) items.push({ ellipsis: true, key: 'l-ellipsis' })
  const start = Math.max(2, cur - 1)
  const end = Math.min(total - 1, cur + 1)
  for (let i = start; i <= end; i++) items.push({ num: i, ellipsis: false, key: `p${i}` })
  if (cur < total - 3) items.push({ ellipsis: true, key: 'r-ellipsis' })
  items.push({ num: total, ellipsis: false, key: `p${total}` })
  return items
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
/* Quest Row Hover Effect */
.quest-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quest-row:hover {
  background-color: rgba(119, 80, 248, 0.1);
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

/* Quest Details Modal */
.quest-details-modal {
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
.quest-details-modal .popup-box-content {
  text-align: center;
  padding: 20px 28px;
  width: 100%;
}

/* Quest Badge Icon */
.quest-modal-icon {
  margin-bottom: 24px;
  justify-content: center;
  display: flex;
}

.quest-badge-icon {
  width: 80px;
  height: 80px;
  animation: questBadgePulse 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(119, 80, 248, 0.3));
}

/* Quest Info */
.quest-modal-info {
  margin-bottom: 32px;
}

.quest-details-modal .popup-box-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
  padding: 0;
}

.quest-details-modal .popup-box-subtitle {
  margin-bottom: 16px;
  text-align: center;
  padding: 0;
  color: #9aa4bf;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Quest Details */
.quest-modal-details {
  margin-bottom: 24px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-label {
  color: #9aa4bf;
  font-size: 0.875rem;
  font-weight: 500;
}

.reward-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #7750f8 0%, #4cd4f7 100%);
  padding: 6px 12px;
  border-radius: 15px;
  animation: rewardPulse 2s ease-in-out infinite;
}

.reward-amount {
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
}

.difficulty-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty-badge.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #8b4513;
}

.difficulty-badge.silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
  color: #2c2c2c;
}

.completion-date {
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Modal Actions */
.quest-details-modal .popup-box-actions {
  padding: 24px 28px 32px;
  gap: 16px;
}

.quest-details-modal .popup-box-action {
  flex: 1;
  margin-right: 0;
  transition: all 0.3s ease;
}

.quest-details-modal .button.primary {
  background: linear-gradient(135deg, #7750f8 0%, #4cd4f7 100%);
  border: none;
  color: #fff;
  font-weight: 700;
}

.quest-details-modal .button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(119, 80, 248, 0.4);
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

@keyframes questBadgePulse {

  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 4px 12px rgba(119, 80, 248, 0.3));
  }

  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 6px 20px rgba(119, 80, 248, 0.5));
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



/* Mobile Quest Cards */
.mobile-quest-list {
  display: none;
}

.mobile-quest-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-quest-card:hover {
  background: rgba(119, 80, 248, 0.1);
  border-color: rgba(119, 80, 248, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(119, 80, 248, 0.2);
}

.mobile-quest-card:active {
  transform: translateY(0);
}

.mobile-quest-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.mobile-quest-badge {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.mobile-quest-title {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.mobile-quest-description {
  color: #9aa4bf;
  font-size: 0.875rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.mobile-quest-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-quest-exp {
  background: linear-gradient(135deg, #7750f8 0%, #4cd4f7 100%);
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.mobile-quest-date {
  color: #9aa4bf;
  font-size: 0.75rem;
}

/* Mobile Responsive Design */
@media screen and (max-width: 680px) {
  .quest-details-modal {
    max-width: 95%;
    margin: 20px;
  }

  .quest-details-modal .popup-box-content {
    padding: 16px 20px;
  }

  .quest-details-modal .popup-box-actions {
    padding: 20px;
  }

  .quest-details-modal .popup-box-action {
    width: 100%;
  }

  .quest-badge-icon {
    width: 60px;
    height: 60px;
  }

  .quest-details-modal .popup-box-title {
    font-size: 1.25rem;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .detail-label {
    margin-bottom: 4px;
  }
}

@media screen and (max-width: 768px) {

  /* Hide table on mobile devices and show mobile-friendly layout */
  .table {
    display: none;
  }

  /* Show mobile quest cards */
  .mobile-quest-list {
    display: block;
  }

  /* Adjust section filters for mobile */
  .section-filters-bar .form-item.split {
    flex-direction: column;
    gap: 12px;
  }

  .section-filters-bar .form-select {
    width: 100%;
  }
}

@media screen and (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }

  .quest-details-modal {
    max-width: 100%;
  }
}
</style>
