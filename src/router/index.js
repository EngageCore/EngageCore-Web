import { createRouter, createWebHistory } from 'vue-router'
import BodyView from '@/layout/BodyView.vue'

// Lazy load components for better performance
const WheelView = () => import('@/views/WheelView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const MissionsView = () => import('@/views/MissionsView.vue')
const HistoryView = () => import('@/views/HistoryView.vue')

// 定义路由配置
const routes = [
  {
    path: '/',
    redirect: '/profile'
  },
  {
    path: '/',
    component: BodyView,
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView
      },
      {
        path: '/wheel',
        name: 'wheel',
        component: WheelView
      },
      {
        path: '/missions',
        name: 'missions',
        component: MissionsView
      },
      {
        path: '/history',
        name: 'history',
        component: HistoryView
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/profile'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// No authentication guards needed

export default router
