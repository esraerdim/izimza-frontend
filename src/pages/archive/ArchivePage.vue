<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { dashboardApi, type DashboardDocument } from '../../features/dashboard'

type ArchiveFilter = 'all' | 'signed' | 'timestamped' | 'shared'

const documents = ref<DashboardDocument[]>([])
const activeFilter = ref<ArchiveFilter>('all')
const search = ref('')
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

const filteredDocuments = computed(() => {
  const byFilter =
    activeFilter.value === 'all'
      ? documents.value
      : documents.value.filter((item) => item.action === activeFilter.value)

  const query = search.value.trim().toLowerCase()
  const bySearch = query
    ? byFilter.filter((item) => item.name.toLowerCase().includes(query))
    : byFilter

  return [...bySearch].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const usedMb = computed(() =>
  filteredDocuments.value.reduce((total, item) => total + Number(item.sizeMb || 0), 0).toFixed(0),
)

const totalCounts = computed(() => ({
  all: documents.value.length,
  signed: documents.value.filter((item) => item.action === 'signed').length,
  timestamped: documents.value.filter((item) => item.action === 'timestamped').length,
  shared: documents.value.filter((item) => item.action === 'shared').length,
}))

const loadDocuments = async () => {
  try {
    documents.value = await dashboardApi.getAllDocuments()
  } catch {
    documents.value = []
  }
}

const handleView = (document: DashboardDocument) => {
  const previewUrl = toAbsolutePreviewUrl(document.previewUrl)
  if (!previewUrl) return
  window.open(previewUrl, '_blank', 'noopener,noreferrer')
}

const handleDownload = (document: DashboardDocument) => {
  const previewUrl = toAbsolutePreviewUrl(document.previewUrl)
  if (!previewUrl) return
  const link = window.document.createElement('a')
  link.href = previewUrl
  link.download = document.name
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.click()
}

const handleExport = () => {
  const lines = filteredDocuments.value.map(
    (item) => `${item.name},${item.sizeMb} MB,${actionLabel(item.action)},${formatDate(item.createdAt)}`,
  )
  const csv = ['Dosya,Boyut,İşlem,Tarih', ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = 'arsiv.csv'
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(loadDocuments)
</script>

<template>
  <section class="page archive-page">
    <div class="archive-page-head">
      <div>
        <p class="eyebrow">BÜTÜN BELGELER TEK YERDE</p>
        <h1 class="archive-page-title">Arşiv</h1>
        <p class="archive-page-sub">{{ filteredDocuments.length }} belge · {{ usedMb }} MB kullanıldı</p>
      </div>
      <button class="archive-export-btn" type="button" @click="handleExport">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
          <path d="M12 3v12"></path>
          <path d="M7 10l5 5 5-5"></path>
          <path d="M4 21h16"></path>
        </svg>
        Dışa Aktar
      </button>
    </div>

    <section class="card archive-table-card archive-page-table">
      <div class="archive-toolbar">
        <div class="archive-filters">
          <button type="button" class="archive-filter-btn" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
            Tümü
            <span>{{ totalCounts.all }}</span>
          </button>
          <button type="button" class="archive-filter-btn" :class="{ active: activeFilter === 'signed' }" @click="activeFilter = 'signed'">
            İmzalanan
          </button>
          <button type="button" class="archive-filter-btn" :class="{ active: activeFilter === 'timestamped' }" @click="activeFilter = 'timestamped'">
            Damgalanan
          </button>
          <button type="button" class="archive-filter-btn" :class="{ active: activeFilter === 'shared' }" @click="activeFilter = 'shared'">
            Paylaşılan
          </button>
        </div>

        <label class="archive-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
            <circle cx="11" cy="11" r="6.8"></circle>
            <path d="M16.1 16.1L20 20"></path>
          </svg>
          <input v-model="search" type="text" placeholder="Dosya ara..." />
        </label>
      </div>

      <div class="archive-table-wrap">
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
            <tr v-for="document in filteredDocuments" :key="document.id">
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
                  <button type="button" class="archive-icon-btn" aria-label="Diğer işlemler">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <circle cx="6" cy="12" r="1.8"></circle>
                      <circle cx="12" cy="12" r="1.8"></circle>
                      <circle cx="18" cy="12" r="1.8"></circle>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
