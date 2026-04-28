<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { DashboardDocument } from '../../../features/dashboard/api/dashboard.api'

const props = defineProps<{
  documents: DashboardDocument[]
  formatDate: (value: string) => string
  actionLabel: (action: string) => string
  actionTone: (action: string) => string
  canOpenDocument?: (document: DashboardDocument) => boolean
}>()

const emit = defineEmits<{
  (event: 'view', document: DashboardDocument): void
  (event: 'download', document: DashboardDocument): void
  (event: 'email', document: DashboardDocument): void
  (event: 'delete', document: DashboardDocument): void
}>()

const openMenuId = ref<number | null>(null)
const tableRootRef = ref<HTMLElement | null>(null)

const canOpen = (document: DashboardDocument) => props.canOpenDocument?.(document) ?? true

const toggleMenu = (documentId: number) => {
  openMenuId.value = openMenuId.value === documentId ? null : documentId
}

const onWindowClick = (event: MouseEvent) => {
  const target = event.target as Node
  if (!tableRootRef.value?.contains(target)) {
    openMenuId.value = null
  }
}

const handleMenuAction = (action: 'email' | 'delete', document: DashboardDocument) => {
  if (action === 'email') {
    emit('email', document)
  } else {
    emit('delete', document)
  }
  openMenuId.value = null
}

onMounted(() => window.addEventListener('click', onWindowClick))
onBeforeUnmount(() => window.removeEventListener('click', onWindowClick))
</script>

<template>
  <div ref="tableRootRef" class="archive-table-wrap">
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
        <tr v-for="document in documents" :key="document.id">
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
              <button type="button" class="archive-icon-btn" :disabled="!canOpen(document)" @click="emit('view', document)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"></path>
                  <circle cx="12" cy="12" r="2.5"></circle>
                </svg>
              </button>
              <button type="button" class="archive-icon-btn" :disabled="!canOpen(document)" @click="emit('download', document)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                  <path d="M12 3v12"></path>
                  <path d="M7 10l5 5 5-5"></path>
                  <path d="M4 21h16"></path>
                </svg>
              </button>
              <div class="archive-menu-wrap">
                <button type="button" class="archive-icon-btn" aria-label="Diğer işlemler" @click.stop="toggleMenu(document.id)">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <circle cx="6" cy="12" r="1.8"></circle>
                    <circle cx="12" cy="12" r="1.8"></circle>
                    <circle cx="18" cy="12" r="1.8"></circle>
                  </svg>
                </button>
                <div v-if="openMenuId === document.id" class="archive-menu">
                  <button type="button" @click="handleMenuAction('email', document)">E-posta ile gönder</button>
                  <button type="button" class="danger" @click="handleMenuAction('delete', document)">Sil</button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
