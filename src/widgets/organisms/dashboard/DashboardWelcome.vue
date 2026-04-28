<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '../../../features/auth'
import { dashboardApi, type DashboardDocument } from '../../../features/dashboard/api/dashboard.api'
import { BaseButton, WaveEmoji } from '../../../shared/ui'

const authStore = useAuthStore()
const pendingCount = ref(0)
const firstPendingDocument = ref<DashboardDocument | null>(null)

const firstName = computed(() => authStore.user?.firstName || 'Kullanici')
const pendingMessage = computed(() => {
  if (pendingCount.value > 0) {
    return `Bugün ${pendingCount.value} belgeniz imzalanmayı bekliyor.`
  }

  return 'İmzalanmayı bekleyen bir belgeniz bulunmuyor. Yeni belge yükleyerek süreci başlatabilirsiniz.'
})

const loadWelcomeData = async () => {
  try {
    const [pendingResponse, recentDocuments] = await Promise.all([
      dashboardApi.getPendingSignatures(),
      dashboardApi.getRecentDocuments(),
    ])

    pendingCount.value = pendingResponse.pendingCount
    firstPendingDocument.value =
      recentDocuments.find((item) => item.action === 'uploaded' || item.action === 'pending_signature') ?? null
  } catch {
    pendingCount.value = 0
    firstPendingDocument.value = null
  }
}

const refreshDashboardData = () => {
  loadWelcomeData()
}

onMounted(async () => {
  await loadWelcomeData()
  window.addEventListener('dashboard:data:refresh', refreshDashboardData)
})

onBeforeUnmount(() => {
  window.removeEventListener('dashboard:data:refresh', refreshDashboardData)
})

const openArchive = () => {
  if (!firstPendingDocument.value?.previewUrl) return
  window.open(firstPendingDocument.value.previewUrl, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="dashboard-welcome">
    <div class="welcome-copy">
      <p class="welcome-kicker">HOŞ GELDİN</p>
      <h1 class="welcome-title">Merhaba, {{ firstName }} <WaveEmoji /></h1>
    </div>

    <div class="welcome-foot">
      <p class="sub-title">
        <template v-if="pendingCount > 0">
          Bugün <strong>{{ pendingCount }} belge</strong> imzalanmayı bekliyor. Hadi başlayalım.
        </template>
        <template v-else>
          {{ pendingMessage }}
        </template>
      </p>

      <div class="welcome-actions">
        <BaseButton variant="secondary" :disabled="!firstPendingDocument?.previewUrl" @click="openArchive">
          Arşivi Aç
        </BaseButton>
        <BaseButton>
          <span class="btn-with-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 20h4l10-10-4-4L4 16v4z"></path>
              <path d="M13.5 6.5l4 4"></path>
            </svg>
            Yeni İmza
          </span>
        </BaseButton>
      </div>
    </div>
  </section>
</template>
