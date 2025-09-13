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

    <div class="grid grid-3-3-3-3 centered">
      <div :class="['quest-item', { completed: quest.completed }]" v-for="(quest, index) in topQuests" :key="quest.title">
        <div class="quest-item-cover" :class="`cover-0${index + 1}`"></div>

        <p class="text-sticker small-text">
          <svg class="text-sticker-icon icon-plus-small">
            <use xlink:href="#svg-plus-small"></use>
          </svg>
          {{ quest.exp }} EXP
        </p>

        <div class="quest-item-info">
          <div class="quest-item-badge">
            <img v-if="quest.difficulty === 'gold'" src="@/assets/img/quest/completedq-b.png" alt="gold-badge">
            <img v-else src="@/assets/img/quest/openq-b.png" alt="silver-badge">
          </div>

          <p class="quest-item-title">{{ quest.title }}</p>
          <p class="quest-item-text">{{ quest.description }}</p>

          <div class="progress-stat">
            <div class="progress-stat-bar">
              <div class="progress" :style="{ '--percent': quest.percent + '%' }"></div>
            </div>

            <div class="bar-progress-wrap small">
              <p class="bar-progress-info negative start">
                <span class="bar-progress-text no-space">
                  <template v-if="quest.type === 'count'">
                    {{ quest.progress }}/{{ quest.goal }}
                  </template>
                  <template v-else>
                    {{ quest.percent }}%
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
            <select id="quest-filter-show" name="quest_filter_show">
              <option value="0">All Quests</option>
              <option value="1">Completed Quests</option>
              <option value="2">Open Quests</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <div class="form-select">
            <label for="quest-filter-criteria">Filter By</label>
            <select id="quest-filter-criteria" name="quest_filter_criteria">
              <option value="0">Quest Progress</option>
              <option value="1">Quest EXP</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>

          <div class="form-select">
            <label for="quest-filter-order">Order By</label>
            <select id="quest-filter-order" name="quest_filter_order">
              <option value="0">Descending</option>
              <option value="1">Ascending</option>
            </select>
            <svg class="form-select-icon icon-small-arrow">
              <use xlink:href="#svg-small-arrow"></use>
            </svg>
          </div>
      
          <button type="button" class="button secondary">Filter Quests</button>
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
          <p class="table-header-title">Experience</p>
        </div>
  
        <div class="table-header-column padded-big-left">
          <p class="table-header-title">Progress</p>
        </div>
      </div>
  
      <div class="table-body same-color-rows">
        <div class="table-row small" v-for="quest in sortedQuests">
          <div class="table-column">
            <div class="table-information">
              <img class="table-image" v-if="quest.difficulty === 'gold'" src="@/assets/img/quest/completedq-s.png" alt="gold-badge" />
              <img class="table-image" v-else-if="quest.difficulty === 'silver'" src="@/assets/img/quest/openq-s.png" alt="silver-badge" />   
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
            <div class="progress-container" v-if="quest.status === 'in-progress'">
              <div class="progress-wrapper">
                <div class="progress" :style="{ '--percent': quest.percent + '%' }"></div>
              </div>
              <p class="text-sticker void progress-text">
                <template v-if="quest.type === 'count'">
                  {{ quest.progress }}/{{ quest.goal }}
                </template>
                <template v-else>
                  {{ quest.percent }}%
                </template>
              </p>
            </div>
            <button v-else-if="quest.status === 'completed-unclaimed'" class="button secondary">Claim Reward</button>
            <button v-else class="button disabled" disabled>Claimed</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const quests = ref([
  {
    title: "First Deposit",
    description: "Make your first deposit into your account",
    exp: 20,
    progress: 1,
    goal: 1,
    percent: 100,
    type: "count",
    difficulty: "silver",
    status: "claimed"
  },
  {
    title: "Deposit Master",
    description: "Complete 20 deposits in total",
    exp: 40,
    progress: 12,
    goal: 20,
    percent: Math.round((12 / 20) * 100),
    type: "count",
    difficulty: "silver",
    status: "in-progress"
  },
  {
    title: "High Roller",
    description: "Deposit a total of $10,000",
    exp: 60,
    progress: 10000,
    goal: 10000,
    percent: 100,
    type: "amount",
    difficulty: "gold",
    status: "completed-unclaimed"
  },
  {
    title: "Turnover King",
    description: "Achieve a total turnover of $50,000",
    exp: 100,
    progress: 50000,
    goal: 50000,
    percent: 100,
    type: "amount",
    difficulty: "gold",
    status: "claimed"
  },
  {
    title: "Withdrawal Expert",
    description: "Complete 5 withdrawals",
    exp: 40,
    progress: 3,
    goal: 5,
    percent: Math.round((3 / 5) * 100),
    type: "count",
    difficulty: "silver",
    status: "in-progress"
  },
  {
    title: "Cash Out Pro",
    description: "Withdraw at least $5,000 in total",
    exp: 60,
    progress: 2800,
    goal: 5000,
    percent: Math.round((2800 / 5000) * 100),
    type: "amount",
    difficulty: "silver",
    status: "in-progress"
  },
  {
    title: "Lucky Bets",
    description: "Place 100 bets in the slots games",
    exp: 40,
    progress: 67,
    goal: 100,
    percent: Math.round((67 / 100) * 100),
    type: "count",
    difficulty: "silver",
    status: "in-progress"
  },
  {
    title: "VIP Challenger",
    description: "Reach $100,000 total turnover",
    exp: 150,
    progress: 45000,
    goal: 100000,
    percent: Math.round((45000 / 100000) * 100),
    type: "amount",
    difficulty: "gold",
    status: "in-progress"
  },
  {
    title: "Weekly Winner",
    description: "Deposit at least $2,000 in one week",
    exp: 50,
    progress: 1200,
    goal: 2000,
    percent: Math.round((1200 / 2000) * 100),
    type: "amount",
    difficulty: "silver",
    status: "in-progress"
  }
])

const topQuests = computed(() =>
  quests.value
    .filter(q => q.status === "in-progress")
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4)
)

const sortedQuests = computed(() =>
  [...quests.value].sort((a, b) => {
    const order = { "completed-unclaimed": 0, "in-progress": 1, "claimed": 2 }
    if (order[a.status] === order[b.status]) {
      return b.percent - a.percent
    }
    return order[a.status] - order[b.status]
  })
)
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
</style>