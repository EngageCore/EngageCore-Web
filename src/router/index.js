import { createRouter, createWebHistory } from 'vue-router'
import BodyView from '@/layout/BodyView.vue'
import { useUserStore } from '@/stores/user'

// Lazy load components for better performance
const WheelView = () => import('@/views/WheelView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const MissionsView = () => import('@/views/MissionsView.vue')
const HistoryView = () => import('@/views/HistoryView.vue')

const routes = [
  {
    path: '/',
    name: 'login-entry',
    component: { template: '<div></div>' } // 空页面
  },
  {
    path: '/',
    component: BodyView,
    children: [
      { path: 'profile', name: 'profile', component: ProfileView },
      { path: 'wheel', name: 'wheel', component: WheelView },
      { path: 'missions', name: 'missions', component: MissionsView },
      { path: 'history', name: 'history', component: HistoryView }
    ]
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // ================================
  // CASE 1: 入口 /
  // ================================
  if (to.name === 'login-entry') {
    // ✅ 已经登录：不管有没有 query，直接进 profile
    if (userStore.isAuthenticated) {
      return next({ name: 'profile' })
    }

    // ❌ 未登录：必须带 memberId + slug
    const memberId = to.query.memberId
    const slug = to.query.slug

    if (!memberId || !slug) {
      return next('/404')
    }

    try {
      await userStore.login(memberId, slug)
      return next({ name: 'profile' })
    } catch (err) {
      return next('/404')
    }
  } else if (to.name === 'not-found') {
    return next()
  }

  // ================================
  // CASE 2: 内部页面必须已登录
  // ================================
  if (!userStore.isAuthenticated) {
    // 没登录，统一丢回 /
    return next({ name: 'login-entry' })
  }

  return next()
})

export default router
