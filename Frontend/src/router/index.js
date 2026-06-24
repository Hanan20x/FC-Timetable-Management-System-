import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('../layouts/DashboardLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('../pages/Dashboard.vue') },
      { path: 'timetable', name: 'timetable', component: () => import('../pages/Timetable.vue') },
      { path: 'rooms', name: 'rooms', component: () => import('../pages/RoomManagement.vue') },
      { path: 'analytics', name: 'analytics', component: () => import('../pages/Analytics.vue') },
      { path: 'profile', name: 'profile', component: () => import('../pages/Profile.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  if (!to.meta.public && !isAuthenticated.value) {
    return { name: 'login' }
  }
  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'dashboard' }
  }
  return true
})

export default router
