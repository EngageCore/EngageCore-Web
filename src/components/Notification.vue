<template>
  <div 
    :class="[
      'notification',
      `notification-${type}`,
      { 'notification-entering': isEntering, 'notification-leaving': isLeaving }
    ]"
    @click="handleClick"
  >
    <!-- Icon -->
    <div class="notification-icon">
      <svg class="notification-icon-svg" v-if="type === 'success'">
        <use xlink:href="#svg-check"></use>
      </svg>
      <svg class="notification-icon-svg" v-else-if="type === 'error'">
        <use xlink:href="#svg-cross"></use>
      </svg>
      <svg class="notification-icon-svg" v-else-if="type === 'warning'">
        <use xlink:href="#svg-info"></use>
      </svg>
      <svg class="notification-icon-svg" v-else-if="type === 'confirmation'">
        <use xlink:href="#svg-info"></use>
      </svg>
    </div>

    <!-- Content -->
    <div class="notification-content">
      <h4 class="notification-title">{{ title }}</h4>
      <p class="notification-message" v-if="message">{{ message }}</p>
    </div>

    <!-- Actions for confirmation type -->
    <div class="notification-actions" v-if="type === 'confirmation'">
      <button class="notification-btn notification-btn-confirm" @click.stop="handleConfirm">
        Confirm
      </button>
      <button class="notification-btn notification-btn-cancel" @click.stop="handleCancel">
        Cancel
      </button>
    </div>

    <!-- Close button -->
    <button class="notification-close" @click.stop="handleClose" v-if="type !== 'confirmation'">
      <svg class="notification-close-icon">
        <use xlink:href="#svg-cross-thin"></use>
      </svg>
    </button>

    <!-- Progress bar -->
    <div class="notification-progress" v-if="showProgress && type !== 'confirmation'">
      <div 
        class="notification-progress-bar" 
        :style="{ width: progressWidth + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['success', 'error', 'warning', 'confirmation'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  onConfirm: {
    type: Function,
    default: null
  },
  onCancel: {
    type: Function,
    default: null
  },
  onClose: {
    type: Function,
    default: null
  }
})

const isEntering = ref(false)
const isLeaving = ref(false)
const progressWidth = ref(100)
let progressTimer = null
let autoCloseTimer = null

const handleClick = () => {
  if (props.type === 'confirmation') return
  // Pause auto-close on click for non-confirmation notifications
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    clearInterval(progressTimer)
  }
}

const handleClose = () => {
  if (props.onClose) {
    props.onClose(props.id)
  }
}

const handleConfirm = () => {
  if (props.onConfirm) {
    props.onConfirm()
  }
  handleClose()
}

const handleCancel = () => {
  if (props.onCancel) {
    props.onCancel()
  }
  handleClose()
}

const startProgress = () => {
  if (props.type === 'confirmation' || !props.showProgress) return
  
  const interval = 50
  const decrement = (100 / props.duration) * interval
  
  progressTimer = setInterval(() => {
    progressWidth.value -= decrement
    if (progressWidth.value <= 0) {
      clearInterval(progressTimer)
    }
  }, interval)
}

const startAutoClose = () => {
  if (props.type === 'confirmation') return
  
  autoCloseTimer = setTimeout(() => {
    handleClose()
  }, props.duration)
}

onMounted(() => {
  // Trigger enter animation
  setTimeout(() => {
    isEntering.value = true
  }, 10)
  
  // Start progress and auto-close
  startProgress()
  startAutoClose()
})

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer)
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
})
</script>

<style scoped>
.notification {
  position: relative;
  width: 100%;
  max-width: 400px;
  background-color: #1d2333;
  border: 1px solid #2f3749;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.notification-entering {
  transform: translateX(0);
  opacity: 1;
}

.notification-leaving {
  transform: translateX(100%);
  opacity: 0;
}

/* Notification types */
.notification-success {
  border-left: 4px solid #4cd4f7;
}

.notification-error {
  border-left: 4px solid #ff4757;
}

.notification-warning {
  border-left: 4px solid #ffa726;
}

.notification-confirmation {
  border-left: 4px solid #6a5af9;
}

/* Icon styles */
.notification-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.notification-success .notification-icon {
  background: linear-gradient(135deg, #4cd4f7 0%, #6a5af9 100%);
}

.notification-error .notification-icon {
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
}

.notification-warning .notification-icon {
  background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
}

.notification-confirmation .notification-icon {
  background: linear-gradient(135deg, #6a5af9 0%, #4cd4f7 100%);
}

.notification-icon-svg {
  width: 12px;
  height: 12px;
  fill: #fff;
}

/* Content styles */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.notification-message {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9aa4bf;
  margin: 0;
  line-height: 1.4;
}

/* Actions for confirmation */
.notification-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.notification-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.notification-btn-confirm {
  background: linear-gradient(135deg, #6a5af9 0%, #4cd4f7 100%);
  color: #fff;
}

.notification-btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(106, 90, 249, 0.3);
}

.notification-btn-cancel {
  background: transparent;
  color: #9aa4bf;
  border: 1px solid #3f485f;
}

.notification-btn-cancel:hover {
  background-color: #2f3749;
  color: #fff;
}

/* Close button */
.notification-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
}

.notification-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.notification-close-icon {
  width: 10px;
  height: 10px;
  fill: #9aa4bf;
  transition: fill 0.2s ease-in-out;
}

.notification-close:hover .notification-close-icon {
  fill: #fff;
}

/* Progress bar */
.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  overflow: hidden;
}

.notification-progress-bar {
  height: 100%;
  transition: width 0.1s linear;
}

.notification-success .notification-progress-bar {
  background: linear-gradient(90deg, #4cd4f7 0%, #6a5af9 100%);
}

.notification-error .notification-progress-bar {
  background: linear-gradient(90deg, #ff4757 0%, #ff3742 100%);
}

.notification-warning .notification-progress-bar {
  background: linear-gradient(90deg, #ffa726 0%, #ff9800 100%);
}

/* Hover effects */
.notification:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.notification-entering:hover {
  transform: translateX(-4px);
}

/* Responsive design */
@media screen and (max-width: 480px) {
  .notification {
    max-width: calc(100vw - 32px);
    margin-left: 16px;
    margin-right: 16px;
  }
  
  .notification-title {
    font-size: 0.8125rem;
  }
  
  .notification-message {
    font-size: 0.6875rem;
  }
}
</style>