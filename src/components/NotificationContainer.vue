<template>
  <Teleport to="body">
    <div class="notification-container" v-if="notifications.length > 0">
      <TransitionGroup name="notification-list" tag="div" class="notification-list">
        <Notification v-for="notification in notifications" :key="notification.id" :id="notification.id"
          :type="notification.type" :title="notification.title" :message="notification.message"
          :duration="notification.duration" :show-progress="notification.showProgress"
          :on-confirm="notification.onConfirm" :on-cancel="notification.onCancel" :on-close="handleNotificationClose" />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { inject } from 'vue'
import Notification from './Notification.vue'

// Inject notifications from the global notification store
const notifications = inject('notifications', [])
const removeNotification = inject('removeNotification', () => { })

const handleNotificationClose = (id) => {
  removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
  max-height: calc(100vh - 40px);
  overflow: hidden;
}

.notification-list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
}

.notification-list>* {
  pointer-events: auto;
}

/* Transition animations for notification list */
.notification-list-enter-active {
  transition: all 0.3s ease-out;
}

.notification-list-leave-active {
  transition: all 0.3s ease-in;
}

.notification-list-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-list-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-list-move {
  transition: transform 0.3s ease;
}

/* Responsive positioning */
@media screen and (max-width: 768px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-height: calc(100vh - 20px);
  }

  .notification-list {
    align-items: stretch;
  }
}

@media screen and (max-width: 480px) {
  .notification-container {
    top: 5px;
    right: 5px;
    left: 5px;
  }
}

/* Ensure notifications stack properly */
.notification-container .notification-list> :nth-child(1) {
  z-index: 100;
}

.notification-container .notification-list> :nth-child(2) {
  z-index: 99;
}

.notification-container .notification-list> :nth-child(3) {
  z-index: 98;
}

.notification-container .notification-list> :nth-child(4) {
  z-index: 97;
}

.notification-container .notification-list> :nth-child(5) {
  z-index: 96;
}

/* Limit visible notifications and add scroll if needed */
@media screen and (min-height: 600px) {
  .notification-container {
    max-height: 80vh;
    overflow-y: auto;
  }
}

/* Custom scrollbar for notification container */
.notification-container::-webkit-scrollbar {
  width: 4px;
}

.notification-container::-webkit-scrollbar-track {
  background: transparent;
}

.notification-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.notification-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>