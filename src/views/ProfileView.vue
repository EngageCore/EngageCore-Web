<template>
  <div class="content-grid">
    <div class="section-banner">
      <img class="section-banner-icon" src="@/assets/img/banner/memberships-icon.png" alt="quests-icon" />
      <p class="section-banner-title">Membership Levels</p>
      <p class="section-banner-text">Unlock exclusive benefits and rewards as you level up your membership!</p>
    </div>

    <!-- 标题 + 控制按钮 -->
    <div class="section-header">
      <div class="section-header-info">
        <p class="section-pretitle">Enjoy exclusive rewards!</p>
        <h2 class="section-title">Membership Benefits</h2>
      </div>

      <!-- 正确结构：外层必须有 section-header-actions -->
      <div class="section-header-actions">
        <div class="slider-controls">
          <div class="slider-control left">
            <svg class="slider-control-icon icon-big-arrow">
              <use xlink:href="#svg-big-arrow"></use>
            </svg>
          </div>
          <div class="slider-control right">
            <svg class="slider-control-icon icon-big-arrow">
              <use xlink:href="#svg-big-arrow"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Slider -->
    <div id="slider" class="section-slider">
      <div class="sections-slider-item" v-for="(m, index) in membershipList" :key="m.level">
        <div class="user-preview">
          <div class="user-preview-cover liquid" :style="{ background: `url(${m.bg}) no-repeat center center`, backgroundSize: 'cover' }"></div>

          <div class="user-preview-info">
            <div class="user-short-description">
              <a class="user-short-description-avatar user-avatar medium" href="#">
                <div class="hexagon">
                  <img :src="m.icon" :alt="m.level" />
                </div>
              </a>
              <p class="user-short-description-title"><a href="#">{{ m.level }}</a></p>
              <p class="user-short-description-text"><a href="#">{{ m.tagline }}</a></p>
            </div>

            <div class="user-preview-stats-slides">
              <div class="user-preview-stats-slide">
                <div class="user-stats">
                  <div class="user-stat" v-for="(b, i) in m.benefits" :key="i">
                    <p class="user-stat-title">{{ b.value }}</p>
                    <p class="user-stat-text">{{ b.label }}</p>
                  </div>
                </div>
              </div>
              <div class="user-preview-stats-slide">
                <p class="user-preview-text">{{ m.description }}</p>
              </div>
            </div>

            <div class="user-preview-actions">
              <p class="button secondary">More Info</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { tns } from "tiny-slider/src/tiny-slider";
import "tiny-slider/dist/tiny-slider.css";

// Rank 图标
const bronzeIcon = new URL("@/assets/img/rank/bronzec-b.png", import.meta.url).href;
const silverIcon = new URL("@/assets/img/rank/silverc-b.png", import.meta.url).href;
const goldIcon = new URL("@/assets/img/rank/goldc-b.png", import.meta.url).href;
const platinumIcon = new URL("@/assets/img/rank/platinumc-b.png", import.meta.url).href;

// 背景图（和等级一一对应）
const bronzeBg = new URL("@/assets/img/quest/cover/01.png", import.meta.url).href;
const silverBg = new URL("@/assets/img/quest/cover/02.png", import.meta.url).href;
const goldBg = new URL("@/assets/img/quest/cover/03.png", import.meta.url).href;
const platinumBg = new URL("@/assets/img/quest/cover/04.png", import.meta.url).href;

const membershipList = ref([
  {
    level: "Bronze",
    icon: bronzeIcon,
    bg: bronzeBg,
    tagline: "Kickstart your journey with entry-level perks",
    description: "Enjoy basic rewards and start unlocking exciting gaming experiences.",
    benefits: [
      { value: "🎁", label: "Bonus" },
      { value: "2%", label: "Rebate" },
      { value: "5", label: "Spins" }
    ]
  },
  {
    level: "Silver",
    icon: silverIcon,
    bg: silverBg,
    tagline: "Step up with improved rewards",
    description: "Unlock better bonuses and enjoy more spins and cashback on your play.",
    benefits: [
      { value: "🎁", label: "Bonus" },
      { value: "5%", label: "Rebate" },
      { value: "15", label: "Spins" }
    ]
  },
  {
    level: "Gold",
    icon: goldIcon,
    bg: goldBg,
    tagline: "Premium perks and VIP treatment",
    description: "Get premium access with higher cashback, more spins, and exclusive deals.",
    benefits: [
      { value: "💰", label: "Bonus" },
      { value: "8%", label: "Rebate" },
      { value: "30", label: "Spins" }
    ]
  },
  {
    level: "Platinum",
    icon: platinumIcon,
    bg: platinumBg,
    tagline: "Elite status with ultimate benefits",
    description: "Enjoy top-tier perks, VIP support, and the best reward rates available.",
    benefits: [
      { value: "👑", label: "Bonus" },
      { value: "12%", label: "Rebate" },
      { value: "VIP", label: "Events" }
    ]
  }
]);

onMounted(() => {
  tns({
    container: "#slider",
    items: 3,
    slideBy: 1,
    mouseDrag: false,
    autoplay: false,
    gutter: 24,
    nav: false,
    controls: true,
    controlsContainer: ".slider-controls",
    prevButton: ".slider-control.left",
    nextButton: ".slider-control.right",
    loop: false,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 3 }
    }
  });
});
</script>

<style scoped>
.user-short-description-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hexagon {
  width: 90px;
  height: 100px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-clip-path: path("M45 0 C50 0, 85 20, 90 25 C95 30, 95 70, 90 75 C85 80, 50 100, 45 100 C40 100, 5 80, 0 75 C-5 70, -5 30, 0 25 C5 20, 40 0, 45 0 Z");
  clip-path: path("M45 0 C50 0, 85 20, 90 25 C95 30, 95 70, 90 75 C85 80, 50 100, 45 100 C40 100, 5 80, 0 75 C-5 70, -5 30, 0 25 C5 20, 40 0, 45 0 Z");
}

.hexagon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.user-stats {
  display: flex;
  justify-content: center;
  text-align: center;
}

.user-stat {
  margin-bottom: 60px;
}
</style>
