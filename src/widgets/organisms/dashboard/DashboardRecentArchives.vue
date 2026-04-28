<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { dashboardApi, type DashboardDocument } from '../../../features/dashboard'

const documents = ref<DashboardDocument[]>([])
const openMenuId = ref<number | null>(null)
const menuRootRef = ref<HTMLElement | null>(null)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

const toAbsolutePreviewUrl = (rawUrl?: string) => {
  if (!rawUrl) return ''
  if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('blob:')) return rawUrl
  if (rawUrl.startsWith('/')) return `${apiBaseUrl}${rawUrl}`
  return `${apiBaseUrl}/${rawUrl}`
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const actionLabel = (action: string) => {
  if (action === 'timestamped') return 'Zaman Damgası'
  if (action === 'signed') return 'İmzalandı'
  if (action === 'shared') return 'Paylaşıldı'
  return 'Yüklendi'
}

const actionTone = (action: string) => {
  if (action === 'timestamped') return 'stamp'
  if (action === 'signed') return 'signed'
  if (action === 'shared') return 'shared'
  return 'upload'
}

const canPreviewInApp = (document: DashboardDocument) =>
  Boolean(document.previewUrl) && /\.pdf($|[?#])/i.test(document.previewUrl ?? '')

const listedDocuments = computed(() =>
  documents.value.filter((document) => canPreviewInApp(document)).slice(0, 5),
)

const loadDocuments = async () => {
  try {
    documents.value = await dashboardApi.getRecentDocuments()
  } catch {
    documents.value = []
  }
}

const handleView = (document: DashboardDocument) => {
  const previewUrl = toAbsolutePreviewUrl(document.previewUrl)
  if (!previewUrl) return
  window.open(previewUrl, '_blank', 'noopener,noreferrer')
}

const handleDownload = (doc: DashboardDocument) => {
  const previewUrl = toAbsolutePreviewUrl(doc.previewUrl)
  if (!previewUrl) return
  const link = window.document.createElement('a')
  link.href = previewUrl
  link.download = doc.name
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.click()
}

const handleEmailSend = (document: DashboardDocument) => {
  const previewUrl = toAbsolutePreviewUrl(document.previewUrl)
  const subject = encodeURIComponent(`Belge paylasimi: ${document.name}`)
  const body = encodeURIComponent(`Merhaba,\n\nBelgeyi buradan goruntuleyebilirsiniz:\n${previewUrl}`)
  window.location.href = `mailto:?subject=${subject}&body=${body}`
  openMenuId.value = null
}

const handleDelete = async (document: DashboardDocument) => {
  try {
    await dashboardApi.deleteDocument(document.id)
    await loadDocuments()
    window.dispatchEvent(new Event('dashboard:data:refresh'))
  } finally {
    openMenuId.value = null
  }
}

const toggleMenu = (documentId: number) => {
  openMenuId.value = openMenuId.value === documentId ? null : documentId
}

const onWindowClick = (event: MouseEvent) => {
  const target = event.target as Node
  if (!menuRootRef.value?.contains(target)) {
    openMenuId.value = null
  }
}

onMounted(() => {
  loadDocuments()
  window.addEventListener('dashboard:data:refresh', loadDocuments)
  window.addEventListener('click', onWindowClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('dashboard:data:refresh', loadDocuments)
  window.removeEventListener('click', onWindowClick)
})
</script>

<template>
  <section class="card archive-table-card">
    <div class="archive-head">
      <div>
        <h2 class="card-title">Son Arşivlenen Belgeler</h2>
        <p class="card-sub">Zaman damgası ya da imza eklenmiş dosyalar</p>
      </div>
      <button class="link-btn" type="button">
        Tümünü Gör
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
          <path d="M5 12h14M13 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <div class="archive-table-wrap" ref="menuRootRef">
      <table class="archive-table">
        <thead>
          <tr>
            <th>Dosya</th>
            <th>Tarih</th>
            <th>İşlem</th>
            <th class="archive-actions-col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="document in listedDocuments" :key="document.id">
            <td>
              <div class="archive-file-cell">
                <span class="archive-file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
                    <path d="M7 3h7l5 5v13H7z"></path>
                    <path d="M14 3v5h5"></path>
                  </svg>
                </span>
                <div class="archive-file-meta">
                  <strong>{{ document.name }}</strong>
                  <small>{{ document.sizeMb }} MB</small>
                </div>
              </div>
            </td>
            <td class="archive-muted">{{ formatDate(document.createdAt) }}</td>
            <td>
              <span class="archive-badge" :data-tone="actionTone(document.action)">
                {{ actionLabel(document.action) }}
              </span>
            </td>
            <td>
              <div class="archive-actions">
                <button type="button" class="archive-icon-btn" @click="handleView(document)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"></path>
                    <circle cx="12" cy="12" r="2.5"></circle>
                  </svg>
                </button>
                <button type="button" class="archive-icon-btn" @click="handleDownload(document)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <path d="M12 3v12"></path>
                    <path d="M7 10l5 5 5-5"></path>
                    <path d="M4 21h16"></path>
                  </svg>
                </button>
                <div class="archive-menu-wrap">
                  <button type="button" class="archive-icon-btn" @click.stop="toggleMenu(document.id)">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <circle cx="6" cy="12" r="1.8"></circle>
                      <circle cx="12" cy="12" r="1.8"></circle>
                      <circle cx="18" cy="12" r="1.8"></circle>
                    </svg>
                  </button>

                  <div v-if="openMenuId === document.id" class="archive-menu">
                    <button type="button" @click="handleEmailSend(document)">E-posta ile gönder</button>
                    <button type="button" class="danger" @click="handleDelete(document)">Sil</button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
