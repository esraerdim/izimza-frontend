import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import './app/styles/global.css'
import AppRoot from './app/AppRoot.vue'
import { i18n, router, registerGlobalErrorHandler } from './app/providers'
import { setUnauthorizedHandler } from '@/shared/api'
import { useAuthStore } from '@/features/auth'
import { useActivitiesStore } from '@/entities/activity'
import { useDocumentsStore } from '@/entities/document'
import { useDashboardStore } from '@/features/dashboard'

const app = createApp(AppRoot)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

registerGlobalErrorHandler(app)

const authStore = useAuthStore()
const documentsStore = useDocumentsStore()
const activitiesStore = useActivitiesStore()
const dashboardStore = useDashboardStore()

const fireAndForget = (task: Promise<unknown>, context: string) => {
  void task.catch((error) => {
    console.error(`[main] ${context}`, error)
  })
}

authStore.$onAction(({ name, after }) => {
  if (name !== 'logout') return
  after(() => {
    documentsStore.reset()
    activitiesStore.reset()
    dashboardStore.reset()
  })
})

documentsStore.$onAction(({ name, after }) => {
  if (name !== 'upload' && name !== 'markTimestamped' && name !== 'remove') return
  after(() => {
    fireAndForget(activitiesStore.invalidate(), 'activities invalidate failed')
    fireAndForget(dashboardStore.invalidate(), 'dashboard invalidate failed')
  })
})

setUnauthorizedHandler(async () => {
  if (!authStore.isAuthenticated) return
  await authStore.logout()
  if (router.currentRoute.value.name !== 'login') {
    await router.push({ name: 'login' })
  }
})

watch(
  i18n.global.locale,
  (next) => {
    document.documentElement.lang = String(next)
  },
  { immediate: true },
)

app.mount('#app')
