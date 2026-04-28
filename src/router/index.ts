import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'timestamp',
        name: 'timestamp',
        component: () => import('../views/TimestampView.vue'),
      },
      {
        path: 'archive',
        name: 'archive',
        component: () => import('../views/ArchiveView.vue'),
      },
      {
        path: 'settings/profile',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const accessToken = localStorage.getItem('izimza_access_token')
  const isAuthenticated = Boolean(accessToken)

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})
