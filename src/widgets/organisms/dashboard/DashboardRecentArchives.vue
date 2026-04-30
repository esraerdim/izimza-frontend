<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDocumentTableActions, useDocumentsStore } from '@/entities/document'
import { DocumentDeleteConfirmModal } from '@/features/documents'
import { BaseCard, DocumentsTable, Icon } from '@/shared/ui'

const router = useRouter()
const { t } = useI18n()
const documentsStore = useDocumentsStore()
const {
  formatDate,
  actionLabel,
  actionTone,
  canOpenDocument,
  handleView,
  handleDownload,
  handleEmailSend,
  handleDelete,
  deleteConfirmOpen,
  deleteTarget,
  isDeletingDocument,
  closeDeleteConfirm,
  confirmPendingDelete,
} = useDocumentTableActions()

const listedDocuments = computed(() => documentsStore.visibleRecentDocuments)
const isLoading = computed(() => documentsStore.isLoadingRecent)

const tableLabels = computed(() => ({
  file: t('documents.table.file'),
  date: t('documents.table.date'),
  action: t('documents.table.action'),
  viewAction: t('documents.table.viewAction'),
  downloadAction: t('documents.table.downloadAction'),
  otherActions: t('documents.table.otherActions'),
  emailSend: t('common.emailSend'),
  delete: t('common.delete'),
  emptyTitle: t('dashboard.recentArchives.emptyTitle'),
  emptyDescription: t('dashboard.recentArchives.emptyDescription'),
}))

const goArchivePage = () => router.push({ name: 'archive' })

onMounted(() => documentsStore.loadRecent())
</script>

<template>
  <BaseCard padding="md" as="section" class="dashboard-recent">
    <header class="dashboard-recent__head">
      <div>
        <h2 class="dashboard-recent__title">{{ t('dashboard.recentArchives.title') }}</h2>
        <p class="dashboard-recent__sub">{{ t('dashboard.recentArchives.sub') }}</p>
      </div>
      <button class="dashboard-recent__link" type="button" @click="goArchivePage">
        {{ t('dashboard.recentArchives.viewAll') }}
        <Icon name="arrow-right" :size="13" />
      </button>
    </header>

    <DocumentsTable
      :documents="listedDocuments"
      :labels="tableLabels"
      :format-date="formatDate"
      :action-label="actionLabel"
      :action-tone="actionTone"
      :can-open-document="canOpenDocument"
      :is-loading="isLoading"
      @view="handleView"
      @download="handleDownload"
      @email="handleEmailSend"
      @delete="handleDelete"
    />
    <DocumentDeleteConfirmModal
      :open="deleteConfirmOpen"
      :file-name="deleteTarget?.name ?? ''"
      :loading="isDeletingDocument"
      @close="closeDeleteConfirm"
      @confirm="confirmPendingDelete"
    />
  </BaseCard>
</template>

<style scoped>
.dashboard-recent__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.dashboard-recent__title {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--color-text-primary);
}

.dashboard-recent__sub {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.dashboard-recent__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 0;
  font: inherit;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  color: var(--color-brand-primary);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
}

.dashboard-recent__link:hover {
  background: var(--color-brand-soft);
}
</style>
