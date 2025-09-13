<template>
  <!-- 显式指定 enter/leave 的类名：
       - leave 使用 prev 状态的类名（确保先把“当前版本”正确收回）
       - enter 使用 next 状态的类名（再让“目标版本”从左边顺滑弹出） -->
  <Transition
    mode="out-in"
    :enter-active-class="`${enterName}-enter-active`"
    :enter-from-class="`${enterName}-enter-from`"
    :enter-to-class="`${enterName}-enter-to`"
    :leave-active-class="`${leaveName}-leave-active`"
    :leave-from-class="`${leaveName}-leave-from`"
    :leave-to-class="`${leaveName}-leave-to`"
    @after-leave="handleAfterLeave"
  >
    <!-- 展开版 -->
    <nav
      v-if="sidebar.isOpen"
      key="expanded"
      id="navigation-widget"
      class="navigation-widget navigation-widget-desktop sidebar left"
    >
      <figure class="navigation-widget-cover liquid">
        <img src="@/assets/img/cover/01.jpg" alt="cover-01" />
      </figure>

      <div class="user-short-description">
        <RouterLink class="user-short-description-avatar" to="/profile">
          <HexAvatar :avatar="avatarSrc" :progress="80" />
        </RouterLink>
        <p class="user-short-description-title">
          <RouterLink to="/profile">Marina Valentine</RouterLink>
        </p>
        <p class="user-short-description-text">
          <a href="#">www.gamehuntress.com</a>
        </p>
      </div>

      <ul class="menu">
        <li
          v-for="item in menuItems"
          :key="item.title"
          class="menu-item"
          :class="{ active: route.path === item.path }"
        >
          <RouterLink class="menu-item-link" :to="item.path">
            <svg class="menu-item-link-icon" :class="`icon-${item.icon}`">
              <use :xlink:href="`#svg-${item.icon}`"></use>
            </svg>
            {{ item.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- 收起版 / mini -->
    <nav
      v-else
      key="mini"
      id="navigation-widget-small"
      class="navigation-widget navigation-widget-desktop closed sidebar left delayed"
    >
      <RouterLink class="user-avatar small no-outline online" to="/profile">
        <HexAvatar class="hex-avatar-sm" :avatar="avatarSrc" :progress="80" />
      </RouterLink>

      <ul class="menu small">
        <li
          v-for="item in menuItems"
          :key="item.title"
          class="menu-item"
          :class="{ active: route.path === item.path }"
        >
          <RouterLink class="menu-item-link text-tooltip-tfr" :to="item.path" :data-title="item.title">
            <svg class="menu-item-link-icon" :class="`icon-${item.icon}`">
              <use :xlink:href="`#svg-${item.icon}`"></use>
            </svg>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </Transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import HexAvatar from '@/components/HexAvatar.vue'
const avatarSrc = new URL('@/assets/img/avatar/29.jpg', import.meta.url).href

const route = useRoute()
const sidebar = useSidebarStore()

// 跟踪上一次的展开状态：用于决定离场动画的类名
const prevIsOpen = ref(sidebar.isOpen)
const enterName = computed(() => (sidebar.isOpen ? 'expand' : 'mini'))
const leaveName = computed(() => (prevIsOpen.value ? 'expand' : 'mini'))
function handleAfterLeave() {
  // 离场动画结束后再同步 prev 状态，确保 leave 使用的是“旧版”类名
  prevIsOpen.value = sidebar.isOpen
}

const menuItems = [
  { title: 'Wheel', path: '/wheel', icon: 'newsfeed' },
  { title: 'Profile', path: '/profile', icon: 'overview' },
  { title: 'Missions', path: '/missions', icon: 'quests' },
  { title: 'History', path: '/history', icon: 'events' },
]
</script>

<style scoped>
:deep(.menu-item.active) .menu-item-link {
  color: var(--color-primary, #4f46e5);
}

/* 提前告诉浏览器将要做的变化，减少抖动 */
.navigation-widget {
  will-change: transform, opacity;
}

/* expand：用于展开版的进/出场（避免 mini 突然放大） */
.expand-enter-active {
  transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease-out;
}
.expand-enter-from {
  opacity: 0;
  transform: translateX(-16px); /* 不放大，仅从左入场 */
}
.expand-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.expand-leave-active {
  /* 与 aside 宽度过渡时长对齐，确保先完全“收进去” */
  transition: transform 360ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms ease;
}
.expand-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
.expand-leave-to {
  opacity: 0;
  transform: translateX(-16px) scale(0.96); /* 轻微缩回到左侧 */
}

/* mini：用于 mini 版的进/出场（进入时不再 scale 放大） */
.mini-enter-active {
  transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease-out;
}
.mini-enter-from {
  opacity: 0;
  transform: translateX(-16px); /* 从左滑入，无 scale */
}
.mini-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.mini-leave-active {
  /* 与 aside 宽度过渡时长对齐，确保先完全“收进去” */
  transition: transform 360ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease;
}
.mini-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.mini-leave-to {
  opacity: 0;
  transform: translateX(-14px) scale(0.98); /* 轻微收回 */
}

/* 缩小版头像用于收起侧栏 */
.hex-avatar-sm {
  transform: scale(0.38);
  transform-origin: top left;
  width: 124px; /* 保持尺寸基准，缩放后约 47px 宽 */
  height: 136px; /* 缩放后约 52px 高 */
}

/* 降低动画偏好时，缩短或移除动画 */
@media (prefers-reduced-motion: reduce) {
  .expand-enter-active,
  .expand-leave-active,
  .mini-enter-active,
  .mini-leave-active {
    transition-duration: 1ms !important;
  }
}
</style>
