<template>
  <!-- 舞台容器：控制宽度 & 裁剪 & 提供相对定位 -->
  <div class="sidebar-stage" :style="stageStyle" aria-hidden="false">
    <Transition
      :enter-active-class="`${enterName}-enter-active`"
      :enter-from-class="`${enterName}-enter-from`"
      :enter-to-class="`${enterName}-enter-to`"
      :leave-active-class="`${leaveName}-leave-active`"
      :leave-from-class="`${leaveName}-leave-from`"
      :leave-to-class="`${leaveName}-leave-to`"
      @after-leave="prevIsOpen = sidebar.isOpen"
    >
      <!-- 桌面展开 -->
      <nav
        v-if="!isMobile && sidebar.isOpen"
        key="desktop"
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

      <!-- 桌面迷你 -->
      <nav
        v-else-if="!isMobile && !sidebar.isOpen"
        key="mini"
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

      <!-- 手机版（添加了用户信息） -->
      <nav
        v-else
        key="mobile"
        class="navigation-widget navigation-widget-mobile sidebar left"
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
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import HexAvatar from '@/components/HexAvatar.vue'

const avatarSrc = new URL('@/assets/img/avatar/29.jpg', import.meta.url).href
const route = useRoute()
const sidebar = useSidebarStore()

// —— 尺寸（可按你的实际样式微调）——
const W_DESKTOP = 300  // 展开宽度（px）
const W_MINI    = 92   // 迷你宽度（px）
const W_MOBILE  = 280  // 手机版抽屉宽度（px）

// 判定手机版
const isMobile = ref(window.innerWidth < 768)
const onResize = () => (isMobile.value = window.innerWidth < 768)
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

// 舞台容器宽度（保证"从旁边来/收进去"的观感 & 避免内容跳动）
const stageStyle = computed(() => {
  const w = isMobile.value ? W_MOBILE : (sidebar.isOpen ? W_DESKTOP : W_MINI)
  return { '--stage-w': `${w}px`, width: `${w}px` }
})

// 动画类名（用于决定走 expand 还是 mini 的轨道）
const prevIsOpen = ref(sidebar.isOpen)
const enterName = computed(() => (sidebar.isOpen ? 'expand' : 'mini'))
const leaveName = computed(() => (prevIsOpen.value ? 'expand' : 'mini'))

const menuItems = [
  { title: 'Wheel', path: '/wheel', icon: 'newsfeed' },
  { title: 'Profile', path: '/profile', icon: 'overview' },
  { title: 'Missions', path: '/missions', icon: 'quests' },
  { title: 'History', path: '/history', icon: 'events' },
]
</script>

<style scoped>
/* 选中态保持你的主题色 */
:deep(.menu-item.active) .menu-item-link {
  color: var(--color-primary, #4f46e5);
}

/* 舞台容器：关键！提供裁剪&定位&宽度过渡，从而"从侧边推入/收回" */
.sidebar-stage{
  position: relative;
  overflow: hidden;
  width: var(--stage-w, 300px);
  transition: width 300ms cubic-bezier(0.22, 1, 0.36, 1);
  /* 可选：锁高以避免布局抖动（如果你的父级不是全高，可以删掉） */
  min-height: 100%;
}

/* 让侧栏宽度贴合舞台，避免外部样式影响 */
.navigation-widget{
  will-change: transform;
}

/* ========= 核心动画：交叠滑动（修复全屏问题） ========= */
/* 进入/离开期间设为绝对定位，但限制在舞台容器内 */
.expand-enter-active,
.expand-leave-active,
.mini-enter-active,
.mini-leave-active{
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 进场：从左侧舞台外进入（-100%） */
.expand-enter-from,
.mini-enter-from{
  transform: translateX(-100%);
}
.expand-enter-to,
.mini-enter-to{
  transform: translateX(0);
}

/* 离场：向左滑出舞台（-100%） */
.expand-leave-from,
.mini-leave-from{
  transform: translateX(0);
}
.expand-leave-to,
.mini-leave-to{
  transform: translateX(-100%);
}

/* 缩小头像维持你的比例 */
.hex-avatar-sm {
  transform: scale(0.38);
  transform-origin: top left;
  width: 124px;
  height: 136px;
}

/* 降低动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .sidebar-stage{ transition-duration: 1ms !important; }
  .expand-enter-active,
  .expand-leave-active,
  .mini-enter-active,
  .mini-leave-active{
    transition-duration: 1ms !important;
  }
}
</style>