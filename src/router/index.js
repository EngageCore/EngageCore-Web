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

  if (memberId && slug) {
    try {
      await userStore.login(memberId, slug)

      if (to.name === 'login-entry') {
        return next({ name: 'profile' })
      }

      return next()
    } catch (err) {
      return next('/404')
    }
  }

  if (to.name === 'login-entry') {
    if (userStore.isAuthenticated) {
      return next({ name: 'profile' })
    }

    return next('/404')
  }

  if (!userStore.isAuthenticated) {
    return next({ name: 'login-entry' })
  }

  return next()
})

export default router
