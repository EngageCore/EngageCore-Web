<template>
  <div class="app-container">
  <Header />
    <!-- Main Content -->
    <div class="main">
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0 auto;
}

.main {
  flex: 1;
  overflow-y: auto;
  background: #f9f9f9;
  display: flex;
  justify-content: center;
}

.content-container {
  width: 100vw;
  max-width: 1184px;
}
</style>
