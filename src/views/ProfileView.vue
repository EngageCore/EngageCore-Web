<template>
  <div class="content-grid">

    <!-- Profile -->
    <div class="profile-header">
      <div class="profile-header-cover"></div>
      <div class="profile-header-info">
        <div class="user-short-description big">
          <div class="user-avatar big user-short-description-avatar">
            <HexAvatar :avatar="avatarSrc" :progress="userStore.userInfo.percentage_to_next_tier ?? 0" />
          </div>

          <div class="user-short-description-title">
            {{ userStore.userInfo.first_name }} {{ userStore.userInfo.last_name }}
          </div>

          <div class="user-short-description-text" @click="redirect('missions')">
            Go to Missions
          </div>
        </div>

        <div class="user-stats">
          <div class="user-stat big">
            <p class="user-stat-title">{{ userStore.userInfo.spin_count }}</p>
            <p class="user-stat-text">Spin</p>
          </div>

          <div class="user-stat big">
            <p class="user-stat-title">{{ userStore.userInfo.active_missions }}</p>
            <p class="user-stat-text">Mission</p>
          </div>

          <div class="user-stat big">
            <p class="user-stat-title">{{ userStore.userInfo.completed_missions }}</p>
            <p class="user-stat-text">Completed</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section header -->
    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Enjoy exclusive rewards!</p>
        <h2 class="section-title">Membership Benefits</h2>
      </div>
    </div>

    <!-- Membership Tier Cards -->
    <div class="grid grid-3-3-3-3 top-space centered">
      
      <div
        v-for="(tier, index) in formattedTierList"
        :key="tier.id"
        class="badge-item-stat"
        :class="{
          locked: index > currentTierIdIndex,
          achieved: index < currentTierIdIndex,
          current: index === currentTierIdIndex
        }"
      >
        <div class="badge-overlay" v-if="index > currentTierIdIndex"></div>

        <img :src="tier.imgSrc" class="badge-item-stat-image" />

        <p class="badge-item-stat-title">{{ tier.name }}</p>

        <p class="badge-item-stat-text">{{ tier.luckyText }}</p>
        <p class="badge-item-stat-text">{{ tier.rewardText }}</p>

        <div class="progress-stat">
          <div class="progress-stat-bar">
            <div
              class="progress"
              :style="{ '--percent': (tier.currentExp / tier.requiredExp) * 100 + '%' }"
            ></div>
          </div>

          <div class="bar-progress-wrap">
            <p class="bar-progress-info center">
              <span class="bar-progress-text no-space">

                <template v-if="index < currentTierIdIndex">
                  {{ tier.requiredExp }} / {{ tier.requiredExp }}
                </template>

                <template v-else-if="index === currentTierIdIndex">
                  {{ tier.currentExp }} / {{ tier.requiredExp }}
                </template>

                <template v-else>
                  Locked
                </template>

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
import { reactive, ref, computed, onMounted } from "vue";
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { useCallApi } from '@/hooks/useCallApi';
import { useNotification } from '@/composables/useNotification';

const { callApi } = useCallApi();
const router = useRouter();
const { showSuccess, showError, showWarning, showConfirmation } = useNotification();

// Avatar
const avatarSrc = new URL('@/assets/img/avatar/29.jpg', import.meta.url).href;

// User store
const userStore = useUserStore();

// =====================================
const getProfile = async () => {
  try {
    const resp = await callApi("/member/profile-detail", "GET");

    if(resp) {
      userStore.setUserInfo(resp);
    }
  } catch (error) {
    showError('Error', 'An unexpected error occurred while fetching profile.')
  }
};

// =====================================
// 2. Fetch Tier List
// =====================================
const tierList = ref([]);

const getTierList = async () => {
  try {
    const resp = await callApi("/member/tiers", "GET");

    if(resp) {
      tierList.value = resp.tiers || [];
    }
  } catch (error) {
    showError('Error', 'An unexpected error occurred while fetching tiers.')
  }
};

// =====================================
// 3. Current Tier Index
// =====================================
const currentTierIdIndex = computed(() => {
  if (!tierList.value.length || !userStore.userInfo.current_membership_tier_id) return -1;
  return tierList.value.findIndex(t => t.id === userStore.userInfo.current_membership_tier_id);
});

// =====================================
// 4. Player total accumulated amount
// =====================================
const playerTotalAcc = computed(() => {
  const idx = currentTierIdIndex.value;
  if (idx < 0) return 0;

  const currentPoints = Number(userStore.userInfo.current_points || 0);

  // Level 1 → 直接显示 current_points
  if (idx === 0) return currentPoints;

  // 其他等级 → 前一级满额 + 当前进度
  const prevTier = tierList.value[idx - 1];
  const prevTarget = Number(prevTier.accumulative_deposit_target_amount || 0);

  return prevTarget + currentPoints;
});

// =====================================
// 5. Format tiers for UI
// =====================================
const formattedTierList = computed(() => {
  if (!tierList.value.length) return [];

  return tierList.value.map((tier, index) => {
    const required = Number(tier.accumulative_deposit_target_amount || 0);
    let current;

    if (index < currentTierIdIndex.value) {
      current = required; // achieved
    } else if (index === currentTierIdIndex.value) {
      current = playerTotalAcc.value; // current progress
    } else {
      current = 0; // locked
    }

    const imgSrc = `${import.meta.env.VITE_API_URL}${tier.image}`;

    return {
      ...tier,
      requiredExp: required,
      currentExp: current,
      imgSrc,
      luckyText: `Lucky Wheel ×${tier.lucky_wheel_multiplier}`,
      rewardText: `Reward SGD ${tier.reward_amount}`
    };
  });
});

// =====================================
// Navigation
// =====================================
const redirect = (path) => router.push({ name: path });

// =====================================
// Init
// =====================================
onMounted(async () => {
  await Promise.all([getTierList(), getProfile()]);
});
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

.user-short-description-title {
  color: #fff;
}

</style>
