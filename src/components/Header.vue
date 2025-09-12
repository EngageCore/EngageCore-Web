<template>
  <header class="header">
    <div class="header-actions">
      <div class="header-brand">
        <div class="logo">
          <svg class="icon-logo-vikinger small">
            <use xlink:href="#svg-logo-vikinger"></use>
          </svg>
        </div>

        <h1 class="header-brand-text">Engage Core</h1>
      </div>
    </div>

    <div class="header-actions">
      <div class="mobilemenu-trigger navigation-widget-mobile-trigger">
        <div class="burger-icon inverted">
          <div class="burger-icon-bar"></div>
          <div class="burger-icon-bar"></div>
          <div class="burger-icon-bar"></div>
        </div>
      </div>

      <nav class="navigation">
        <ul class="menu-main">
          <li class="menu-main-item" v-for="item in menuItem" :key="item.path">
            <a class="menu-main-item-link" href="#" @click.prevent="redirect(item.path)">{{ item.name }}</a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="header-actions">
      <div class="action-item dark"></div>
      <div class="action-item dark">
        <div class="form-switch" @click="isDark = !isDark" :class="{ active: isDark }">
          <div class="form-switch-button"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isDark = ref(false)
const menuItem = ref([
  { name: 'Wheel', path: 'wheel' },
  { name: 'Profile', path: 'profile' },
  { name: 'Missions', path: 'missions' },
  { name: 'History', path: 'history' },
])

const router = useRouter()
const redirect = (name) => {
  router.push({ name })
}
</script>
