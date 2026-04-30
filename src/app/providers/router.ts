import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth'
import { i18n } from './i18n'


const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { guestOnly: true, titleKey: 'pageTitles.login' },
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('@/pages/auth/OAuthCallbackPage.vue'),
    meta: { guestOnly: true, titleKey: 'pageTitles.authCallback' },
  },
  {
    path: '/',
    component: () => import('@/widgets/templates/AppShellTemplate.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
        meta: { titleKey: 'pageTitles.dashboard' },
      },
      {
        path: 'sign',
        name: 'sign',
        component: () => import('@/pages/sign/SignPage.vue'),
        meta: { titleKey: 'pageTitles.sign' },
      },
      {
        path: 'timestamp',
        name: 'timestamp',
        component: () => import('@/pages/timestamp/TimestampPage.vue'),
        meta: { titleKey: 'pageTitles.timestamp' },
      },
      {
        path: 'archive',
        name: 'archive',
        component: () => import('@/pages/archive/ArchivePage.vue'),
        meta: { titleKey: 'pageTitles.archive' },
      },
      {
        path: 'settings/profile',
        name: 'profile',
        component: () => import('@/pages/profile/ProfilePage.vue'),
        meta: { titleKey: 'pageTitles.profile' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'dashboard' },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

router.afterEach((to) => {
  const titleKey = (to.meta?.titleKey as string | undefined) ?? ''
  const appName = i18n.global.t('appName')
  if (!titleKey) {
    document.title = appName
    return
  }
  const pageTitle = i18n.global.t(titleKey)
  document.title = pageTitle && pageTitle !== titleKey ? `${pageTitle} · ${appName}` : appName
})
