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

let hasCheckedSession = false

router.beforeEach(async (to) => {
  const { isAuthenticated, refreshProfile } = useAuth()

  // On the very first navigation after a page load/refresh, validate any
  // persisted token against the backend rather than trusting localStorage
  // indefinitely — catches expired tokens or users deleted server-side.
  if (!hasCheckedSession) {
    hasCheckedSession = true
    if (isAuthenticated.value) {
      await refreshProfile()
    }
  }

  if (!to.meta.public && !isAuthenticated.value) {
    return { name: 'login' }
  }
  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'dashboard' }
  }
  return true
})

export default router
