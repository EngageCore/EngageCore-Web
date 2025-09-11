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
          <div class="user-short-description-text" @click="redirect('membership-list')">View Details</div>
        </div>
        <div class="social-links">
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/bronzec-s.png"></img>
          </div>
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/silverc-s.png"></img>
          </div>
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/goldc-s.png"></img>
          </div>
          <div href="#!" class="social-link">
            <img src="@/assets/img/rank/platinumc-s.png"></img>
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
  </div>
</template>

<script setup>
import HexAvatar from '@/components/HexAvatar.vue'
import { useRouter } from 'vue-router'

const coverSrc = new URL('@/assets/img/cover/01.jpg', import.meta.url).href
const avatarSrc = new URL('@/assets/img/avatar/29.jpg', import.meta.url).href
const router = useRouter()

const redirect = (path) => {
  router.push({ name: path })
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
