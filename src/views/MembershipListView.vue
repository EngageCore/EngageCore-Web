<template>
  <div class="content-grid">
    <!-- Banner -->
    <div class="section-banner">
      <img
        class="section-banner-icon"
        src="@/assets/img/banner/memberships-icon.png"
        alt="memberships-icon"
      />
      <p class="section-banner-title">Membership Levels</p>
      <p class="section-banner-text">
        Unlock exclusive benefits and rewards as you level up your membership!
      </p>
    </div>

    <!-- Header -->
    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Enjoy exclusive rewards!</p>
        <h2 class="section-title">Membership Benefits</h2>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-3-3-3-3 top-space centered">
      <div class="badge-item-stat" v-for="membership in membershipList" :key="membership.id">
        <img class="badge-item-stat-image" :src="getBadgeSrc(membership.key)" :alt="`badge-${membership.key}-b`" />

        <p class="badge-item-stat-title">{{ membership.name }}</p>

        <p class="badge-item-stat-text">{{ membership.benefits }}</p>

        <div class="progress-stat">
          <div class="progress-stat-bar">
            <div class="progress" :style="{ '--percent': (membership.currentExp / membership.requiredExp) * 100 + '%' }"></div>
          </div>

          <div class="bar-progress-wrap">
            <p class="bar-progress-info negative center">
              <span class="bar-progress-text no-space">
                {{ membership.currentExp >= membership.requiredExp ? 'Achieved' : membership.currentExp + ' / ' + membership.requiredExp }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

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
</script>
