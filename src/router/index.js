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

  const memberId = to.query.memberId
  const slug = to.query.slug

  // 1. 完全放行 404，避免无限循环
  if (to.name === 'not-found') {
    return next()
  }

  // 2. 有 memberId + slug → 执行 login
  if (memberId && slug) {
    try {
      await userStore.login(memberId, slug)
      return next({ name: 'profile' })
    } catch (err) {
      return next('/404')
    }
  }

  // 3. 没有登陆 → 第一次进入 → 跳 404（这是你想要的行为）
  if (!userStore.isAuthenticated) {
    return next('/404')
  }

  // 4. 已登陆访问 login-entry → 跳 profile
  if (to.name === 'login-entry') {
    return next({ name: 'profile' })
  }

  return next()
})

export default router
