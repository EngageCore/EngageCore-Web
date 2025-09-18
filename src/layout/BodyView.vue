<template>
  <div class="app-container">
    <!-- Top header -->
    <Header />

    <!-- Mobile Sidebar Overlay -->
    <div class="mobile-sidebar" :class="{ open: sidebar.isOpen }">
      <div class="mobile-backdrop" @click="sidebar.close()" />
      <aside class="mobile-drawer">
        <Sidebar />
      </aside>
    </div>

    <!-- Horizontal layout: Sidebar + Content -->
    <div class="layout-row">
      <!-- Always render sidebar slot; width switches between expanded (300) and mini (80) -->
      <aside class="sidebar-slot" :class="{ mini: !sidebar.isOpen }">
        <Sidebar />
      </aside>

      <!-- Main Content -->
      <main class="main">
        <div class="content-container">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebar = useSidebarStore()
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Row: sidebar + content */
.layout-row {
  display: flex;
  flex: 1;
  min-height: 0; /* allow children to flex and scroll */
}

/* Space reserved for desktop sidebar (expanded ~300px; mini ~80px) */
.sidebar-slot {
  flex: 0 0 300px;
  width: 300px;
  transition: width 360ms cubic-bezier(0.4, 0, 0.2, 1), flex-basis 360ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width, flex-basis;
}
.sidebar-slot.mini {
  flex-basis: 80px;
  width: 80px;
}

/* Main area takes the remaining width */
.main {
  flex: 1 1 auto;
  min-width: 0;
  overflow-y: auto;
  display: block;
}

/* Center inner content using the template's max-width behavior */
.content-container {
  width: 100%;
  max-width: 1184px;
  margin: 0 auto;
  display: block;
}

/* Mobile Sidebar (overlay drawer) */
.mobile-sidebar {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  display: none; /* enabled by media query below */
}
.mobile-sidebar .mobile-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  transition: background 220ms ease;
}
.mobile-sidebar .mobile-drawer {
  margin-top: 60px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 86vw;
  max-width: 320px;
  background: var(--color-surface, #0b1020);
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  transform: translateX(-100%);
  transition: transform 360ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.mobile-sidebar.open {
  pointer-events: auto;
}
.mobile-sidebar.open .mobile-backdrop {
  background: rgba(0,0,0,0.4);
}
.mobile-sidebar.open .mobile-drawer {
  transform: translateX(0);
}

/* Mobile: overlay visible; desktop: hidden */
@media screen and (max-width: 680px) {
  .mobile-sidebar { display: block; }
  .layout-row { /* allow content behind overlay */ }
  .sidebar-slot { display: none; }
  .main { flex-basis: 100%; width: 100%; }
}
</style>
