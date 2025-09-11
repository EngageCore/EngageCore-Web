import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import BodyView from '@/layout/BodyView.vue'

// Lazy load components for better performance
const WheelView = () => import('@/views/WheelView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const MissionsView = () => import('@/views/MissionsView.vue')
const HistoryView = () => import('@/views/HistoryView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const MembershipListView = () => import('@/views/MembershipListView.vue')

// 定义路由配置
const routes = [
  {
    path: '/',
    redirect: '/wheel'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: BodyView,
    children: [
      {
        path: '/wheel',
        name: 'wheel',
        component: WheelView,
        meta: { requiresAuth: true }
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true }
      },
      {
        path: '/missions',
        name: 'missions',
        component: MissionsView,
        meta: { requiresAuth: true }
      },
      {
        path: '/history',
        name: 'history',
        component: HistoryView,
        meta: { requiresAuth: true }
      },
      {
        path: '/membership-list',
        name: 'membership-list',
        component: MembershipListView,
        meta: { requiresAuth: true }
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/wheel'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { checkAuthStatus } = useAuth()
  const isAuthenticated = await checkAuthStatus()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/wheel')
    return
  }

  next()
})

export default router
