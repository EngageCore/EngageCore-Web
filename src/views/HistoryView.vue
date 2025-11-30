<template>
  <div class="content-grid">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Your Accomplishments</p>
        <h2 class="section-title">Claim History</h2>
      </div>
    </div>

    <!-- Filters -->
    <div class="section-filters-bar v2">
      <form class="form">
        <div class="form-item split medium">

          <!-- Source filter -->
          <div class="form-select">
            <label>Source</label>
            <select v-model="filterSource">
              <option value="">All</option>
              <option value="mission">Mission</option>
              <option value="tier">Tier</option>
              <option value="wheel">Wheel</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <!-- Status filter -->
          <div class="form-select">
            <label>Status</label>
            <select v-model="filterStatus">
              <option value="">All</option>
              <option value="approved">Claimed</option>
              <option value="pending">Pending</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <!-- Order filter -->
          <div class="form-select">
            <label>Order</label>
            <select v-model="filterOrder">
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <button type="button" class="button secondary" @click="applyFilters">
            Apply
          </button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <div class="table table-quests split-rows">
      <div class="table-header">
        <div class="table-header-column">
          <p class="table-header-title">Source</p>
        </div>
        <div class="table-header-column">
          <p class="table-header-title">Description</p>
        </div>
        <div class="table-header-column centered padded-big-left">
          <p class="table-header-title">Reward</p>
        </div>
        <div class="table-header-column centered padded-big-left">
          <p class="table-header-title">Status</p>
        </div>
        <div class="table-header-column padded-big-left">
          <p class="table-header-title">Date</p>
        </div>
      </div>
      <div class="table-body same-color-rows" v-if="historyList.length > 0">
        <div class="table-row small" v-for="item in historyList" :key="item.id">
          <div class="table-column">
            <p class="table-title capitalize">{{ item.source }}</p>
          </div>

          <div class="table-column">
            <p class="table-text">{{ item.description }}</p>
          </div>

          <div class="table-column centered padded-big-left">
            <p class="text-sticker void">
              <svg class="text-sticker-icon icon-plus-small">
                <use xlink:href="#svg-plus-small"></use>
              </svg>
              SGD {{ item.reward_amount }}
            </p>
          </div>

          <div class="table-column centered padded-big-left">
            <p class="table-text" v-if="item.status == 'pending'">Pending</p>
            <p class="table-text" v-else>Claimed</p>
          </div>

          <div class="table-column padded-big-left">
            <p class="table-text">{{ formatDate(item.completed_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <transition name="empty-fade">
      <div v-if="historyList.length === 0" class="empty-state">
        <div class="empty-card">
          <span>No records found.</span>
        </div>
      </div>
    </transition>

    <!-- Pagination -->
    <div class="section-pager-bar" v-if="totalPages > 1">
      <div class="section-pager">
        <a class="section-pager-item" :class="{ disabled: page === 1 }" @click.prevent="prevPage">
          <svg class="section-pager-item-icon icon-small-arrow">
            <use xlink:href="#svg-small-arrow"></use>
          </svg>
        </a>

        <a v-for="p in pagesToShow" :key="p.key" class="section-pager-item"
          :class="{ active: p.num === page, disabled: p.ellipsis }"
          @click.prevent="!p.ellipsis && goToPage(p.num)">
          <p class="section-pager-item-text">{{ p.ellipsis ? '…' : p.num }}</p>
        </a>

        <a class="section-pager-item" :class="{ disabled: page === totalPages }" @click.prevent="nextPage">
          <svg class="section-pager-item-icon icon-small-arrow" style="transform: scaleX(-1);">
            <use xlink:href="#svg-small-arrow"></use>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCallApi } from "@/hooks/useCallApi";

const { callApi } = useCallApi();

const historyList = ref([]);
const page = ref(1);
const pageSize = 10;
const total = ref(0);

// Filters
const filterSource = ref("");
const filterStatus = ref("");
const filterOrder = ref("desc");

// Fetch history
const fetchHistory = async () => {
  const params = {
    page: page.value,
    pageSize,
    order: filterOrder.value,
  };

  if (filterSource.value) params.source = filterSource.value;
  if (filterStatus.value) params.status = filterStatus.value;

  const resp = await callApi("/member/missions/history", "GET", null, params);

  historyList.value = resp.list || [];
  total.value = resp.total || 0;
};

// Pagination helpers
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize))
);

const goToPage = (p) => {
  page.value = p;
  fetchHistory();
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchHistory();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchHistory();
  }
};

const pagesToShow = computed(() => {
  const totalP = totalPages.value;
  const cur = page.value;
  const items = [];

  if (totalP <= 7) {
    for (let i = 1; i <= totalP; i++) items.push({ num: i, ellipsis: false, key: i });
    return items;
  }

  items.push({ num: 1, ellipsis: false, key: "p1" });
  if (cur > 4) items.push({ ellipsis: true, key: "l-ellipsis" });

  const start = Math.max(2, cur - 1);
  const end = Math.min(totalP - 1, cur + 1);

  for (let i = start; i <= end; i++)
    items.push({ num: i, ellipsis: false, key: `p${i}` });

  if (cur < totalP - 3) items.push({ ellipsis: true, key: "r-ellipsis" });
  items.push({ num: totalP, ellipsis: false, key: `p${totalP}` });

  return items;
});

// Reset page when filtering
const applyFilters = () => {
  page.value = 1;
  fetchHistory();
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

onMounted(fetchHistory);
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

.table-column.centered .text-sticker {
  justify-content: center !important;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.empty-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  background-color: #293249;
  border: 1px solid #2f3749;
  color: #9aa4bf;
  font-size: 0.95rem;
  font-weight: 700;
  box-shadow: 3px 5px 20px 0 rgba(0, 0, 0, .12);
  width: 100%;
}

.empty-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.empty-fade-enter-active,
.empty-fade-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}
.empty-fade-enter-from,
.empty-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media screen and (max-width: 680px) {
  .empty-state { padding: 14px 0; }
  .empty-card { padding: 10px 14px; font-size: 0.9rem; }
}
</style>
