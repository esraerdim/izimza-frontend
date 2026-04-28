import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../../features/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../../pages/auth/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: () => import('../../widgets/templates/AppShellTemplate.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../../pages/dashboard/DashboardPage.vue'),
      },
      {
        path: 'sign',
        name: 'sign',
        component: () => import('../../pages/sign/SignPage.vue'),
      },
      {
        path: 'timestamp',
        name: 'timestamp',
        component: () => import('../../pages/timestamp/TimestampPage.vue'),
      },
      {
        path: 'archive',
        name: 'archive',
        component: () => import('../../pages/archive/ArchivePage.vue'),
      },
      {
        path: 'settings/profile',
        name: 'profile',
        component: () => import('../../pages/profile/ProfilePage.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.fetchMe()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})
