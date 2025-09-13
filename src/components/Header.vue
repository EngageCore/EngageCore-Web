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

      <div class="sidemenu-trigger navigation-widget-trigger" @click="sidebar.toggle()">
        <!-- ICON GRID -->
        <svg class="icon-grid">
          <use xlink:href="#svg-grid"></use>
        </svg>
        <!-- /ICON GRID -->
      </div>
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
import { useSidebarStore } from '@/stores/sidebar'

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

const sidebar = useSidebarStore()
</script>

<style scoped>
.sidebar-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.06);
  cursor: pointer;
  margin-right: 12px;
}

.sidebar-toggle-btn:hover {
  background: rgba(255,255,255,0.12);
}

.sidebar-toggle-btn .burger-icon {
  display: inline-grid;
  gap: 4px;
}
.sidebar-toggle-btn .burger-icon span {
  display: block;
  width: 18px;
  height: 2px;
  background: currentColor;
}
</style>
