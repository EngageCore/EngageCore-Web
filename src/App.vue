<template>
  <!-- Page Loader -->
  <PageLoader :is-visible="isLoading" />
  
  <!-- Main App Content -->
  <router-view />
  
  <!-- Global Notification Container -->
  <NotificationContainer />
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import PageLoader from './components/PageLoader.vue'
import NotificationContainer from './components/NotificationContainer.vue'
import { usePageLoader } from './composables/usePageLoader'
import { provideNotifications } from './composables/useNotification'

// Provide notifications globally
provideNotifications()

const route = useRoute()
const { isLoading, showLoader, hideLoader } = usePageLoader()

// Show loader on route changes
watch(
  () => route.path,
  () => {
    showLoader(300) // Show for minimum 300ms
    
    // Hide loader after a short delay to simulate loading
    setTimeout(() => {
      hideLoader()
    }, 800)
  },
  { immediate: false }
)
</script>
