<template>
  <div class="content-grid">
    <div class="profile-header">
      <div class="profile-header-cover"></div>
      <div class="profile-header-info">
        <div class="user-short-description big">
          <div class="user-avatar big user-short-description-avatar">
            <HexAvatar :avatar="avatarSrc" :progress="80" />
          </div> <!-- Profile Image -->
          <div class="user-short-description-title">Marina Valentine</div>
          <div class="user-short-description-text" @click="redirect('missions')">Go to Missions</div>
        </div>
        <div class="social-links">
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/bronzec-s.png" />
          </div>
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/silverc-s.png" />
          </div>
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/goldc-s.png" />
          </div>
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/platinumc-s.png" />
          </div>
        </div>
        <div class="user-stats">
          <div class="user-stat big">
            <p class="user-stat-title">25</p>
            <p class="user-stat-text">Spin</p>
          </div>
          <div class="user-stat big">
            <p class="user-stat-title">15</p>
            <p class="user-stat-text">Mission</p>
          </div>
          <div class="user-stat big">
            <p class="user-stat-title">7</p>
            <p class="user-stat-text">Completed</p>
          </div>
        </div>
      </div>
    </div>

    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Enjoy exclusive rewards!</p>
        <h2 class="section-title">Membership Benefits</h2>
      </div>
    </div>

    <div class="grid grid-3-3-3-3 top-space centered">
      <div class="badge-item-stat" v-for="(membership, idx) in membershipList" :key="membership.id"
        :class="[{ locked: isLocked(idx), current: isCurrent(idx), achieved: isAchieved(idx) }, tierClass(membership.key)]">
        <!-- Gray overlay when locked -->
        <div class="badge-overlay" v-if="isLocked(idx)"></div>

        <img class="badge-item-stat-image" :src="getBadgeSrc(membership.key)" :alt="`badge-${membership.key}-b`" />

        <p class="badge-item-stat-title">{{ membership.name }}</p>

        <p class="badge-item-stat-text">{{ membership.benefits }}</p>

        <div class="progress-stat">
          <div class="progress-stat-bar">
            <div class="progress"
              :style="{ '--percent': (membership.currentExp / membership.requiredExp) * 100 + '%' }"></div>
          </div>

          <div class="bar-progress-wrap">
            <p class="bar-progress-info negative center">
              <span class="bar-progress-text no-space">
                {{ membership.currentExp >= membership.requiredExp ? 'Achieved' : membership.currentExp + ' / ' +
                  membership.requiredExp }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HexAvatar from '@/components/HexAvatar.vue';
import { computed, ref } from "vue";
import { useRouter } from 'vue-router';

const coverSrc = new URL('@/assets/img/cover/01.jpg', import.meta.url).href
const avatarSrc = new URL('@/assets/img/avatar/29.jpg', import.meta.url).href
const router = useRouter()

const redirect = (path) => {
  router.push({ name: path })
}

const membershipList = ref([
  {
    id: "1",
    key: "bronzec",
    name: "Bronze-1",
    requiredExp: 100,
    currentExp: 100,
    benefits:
      "Daily Free Spin ×1 · 2% Shopping Rebate · Lucky Draw Entry ×1 · Basic Support",
  },
  {
    id: "2",
    key: "bronzec",
    name: "Bronze-2",
    requiredExp: 100,
    currentExp: 100,
    benefits:
      "Daily Free Spin ×1 · 2% Shopping Rebate · Lucky Draw Entry ×1 · Basic Support",
  },
  {
    id: "3",
    key: "silverc",
    name: "Silver-1",
    requiredExp: 500,
    currentExp: 500,
    benefits:
      "Daily Free Spin ×2 · 5% Shopping Rebate · Lucky Draw Entry ×2 · Priority Support",
  },
  {
    id: "4",
    key: "silverc",
    name: "Silver-2",
    requiredExp: 500,
    currentExp: 500,
    benefits:
      "Daily Free Spin ×2 · 5% Shopping Rebate · Lucky Draw Entry ×2 · Priority Support",
  },
  {
    id: "5",
    key: "goldc",
    name: "Gold",
    requiredExp: 1000,
    currentExp: 853,
    benefits:
      "Daily Free Spin ×3 · 10% Shopping Rebate · VIP Chatroom · Personal Manager",
  },
  {
    id: "6",
    key: "platinumc",
    name: "Platinum",
    requiredExp: 1500,
    currentExp: 853,
    benefits:
      "Daily Free Spin ×5 · 15% Shopping Rebate · VIP Event Access · 1-on-1 Host Manager",
  },
]);

const getBadgeSrc = (key) => {
  return new URL(`../assets/img/rank/${key}-b.png`, import.meta.url).href;
};

// Index of first not-full level as current; if all full -> -1
const currentIndex = computed(() => membershipList.value.findIndex(m => m.currentExp < m.requiredExp))

const isCurrent = (idx) => currentIndex.value !== -1 && idx === currentIndex.value
const isLocked = (idx) => currentIndex.value !== -1 && idx > currentIndex.value
const isAchieved = (idx) => currentIndex.value === -1 ? true : idx < currentIndex.value

// Tier class helper
const tierClass = (key) => {
  if (key.startsWith('bronze')) return 'tier-bronze'
  if (key.startsWith('silver')) return 'tier-silver'
  if (key.startsWith('gold')) return 'tier-gold'
  if (key.startsWith('platinum')) return 'tier-platinum'
  return ''
}
</script>

<style scoped>
.profile-header .profile-header-cover {
  background: url('@/assets/img/cover/01.jpg') no-repeat center/cover;
}

.profile-header .profile-header-info .social-links {
  position: absolute;
  top: 54px;
  right: 10%;
}

.user-avatar {
  margin-top: 40px;
}

.user-short-description-text {
  cursor: pointer;
  margin-top: 0;
}

/* Gamified hover and locked/current/achieved states */
.badge-item-stat {
  position: relative;
  overflow: hidden;
  transform-origin: center;
  transition: transform .2s ease, box-shadow .25s ease, filter .25s ease;
  /* add transform for scale */
  cursor: pointer;
  will-change: transform, box-shadow;
  /* prepare for transform and shadow */
  border-radius: 16px;
}

/* Hover: only box-shadow + scale (no border ring) */
.badge-item-stat:hover {
  transform: scale(1.03);
  box-shadow: 0 14px 38px rgba(94, 92, 154, 0.20);
}

/* Remove image transform on hover */
.badge-item-stat .badge-item-stat-image {
  transition: none;
}

/* Remove shining effects: ring and shimmer */
/* delete hover ::before ring by not defining it */
/* delete shimmer sweep */
.badge-item-stat::after {
  content: none !important;
}

/* Locked: gray overlay + grayscale + lock icon (top-right) */
.badge-item-stat.locked {
  filter: grayscale(100%);
}

.badge-item-stat .badge-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  border-radius: inherit;
  z-index: 3;
  pointer-events: none;
}

.badge-item-stat.locked::before {
  content: '🔒';
  position: absolute;
  z-index: 4;
  top: 10px;
  right: 10px;
  font-size: 18px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, .4));
  pointer-events: none;
}

/* Do not change overlay on hover; only box-shadow */
/* Ensure locked regains color on hover */
.badge-item-stat.locked:hover {
  filter: grayscale(0%);
}

/* Current: no static border/shadow */
.badge-item-stat.current {
  box-shadow: none;
}

.badge-item-stat.current::before {
  content: 'CURRENT';
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #615dfa;
  padding: 2px 6px;
  border-radius: 10px;
  letter-spacing: .02em;
}

/* Achieved: no static border/shadow */
.badge-item-stat.achieved {
  box-shadow: none;
}

/* No special hover, rely on common hover only-box-shadow rule */
/* Removed achieved:hover override to keep a single hover style */

/* Remove unused keyframes */
/* ringSpin and hoverPop removed */


/* Tablet and below */
@media screen and (max-width: 960px) {
  .profile-header .profile-header-info .social-links {
    position: static;
    margin-top: 16px;
    justify-content: center;
  }
}

/* Mobile */
@media screen and (max-width: 480px) {

  /* Ensure cover remains visible and compact on mobile */
  .profile-header .profile-header-cover {
    background-size: cover;
  }

  /* Keep avatar visible on mobile (override global hide) */
  .profile-header .profile-header-info .user-short-description .user-short-description-avatar {
    display: block;
  }

  /* Center social badges and reduce size spacing */
  .profile-header .profile-header-info .social-links {
    position: static;
    margin-top: 12px;
    justify-content: center;
    gap: 8px;
  }

  .profile-header .profile-header-info .social-links .social-link img {
    width: 28px;
    height: 28px;
  }

  /* Tighter stats spacing on mobile */
  .user-stat,
  .user-stat.big {
    padding: 0 12px;
  }

  .user-avatar {
    margin-top: 60px;
    scale: .8;
  }
}
</style>
