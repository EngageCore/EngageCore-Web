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
        <div class="table-header-column"><p class="table-header-title">Quest</p></div>
        <div class="table-header-column"><p class="table-header-title">Description</p></div>
        <div class="table-header-column centered padded-big-left"><p class="table-header-title">Experience</p></div>
        <div class="table-header-column padded-big-left"><p class="table-header-title">Completed On</p></div>
      </div>

      <div class="table-body same-color-rows">
        <div class="table-row small" v-for="quest in paginatedQuests" :key="quest.title">
          <div class="table-column">
            <div class="table-information">
              <img class="table-image"
                   v-if="quest.difficulty === 'gold'"
                   src="@/assets/img/quest/completedq-s.png"
                   alt="gold-badge" />
              <img class="table-image"
                   v-else
                   src="@/assets/img/quest/openq-s.png"
                   alt="silver-badge" />
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

    <!-- Pagination -->
    <div class="section-pager-bar" v-if="totalPages > 1">
      <div class="section-pager">
        <a class="section-pager-item"
           :class="{ disabled: currentPage === 1 }"
           @click.prevent="prevPage">
          <svg class="section-pager-item-icon icon-small-arrow">
            <use xlink:href="#svg-small-arrow"></use>
          </svg>
        </a>

        <a v-for="p in pagesToShow"
           :key="p.key"
           class="section-pager-item"
           :class="{ active: p.num === currentPage, disabled: p.ellipsis }"
           @click.prevent="!p.ellipsis && goToPage(p.num)">
          <p class="section-pager-item-text">{{ p.ellipsis ? '…' : p.num }}</p>
        </a>

        <a class="section-pager-item"
           :class="{ disabled: currentPage === totalPages }"
           @click.prevent="nextPage">
          <svg class="section-pager-item-icon icon-small-arrow" style="transform: scaleX(-1);">
            <use xlink:href="#svg-small-arrow"></use>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

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
