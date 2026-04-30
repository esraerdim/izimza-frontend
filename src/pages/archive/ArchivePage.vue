<template>
  <section class="archive-page">
    <PageHeader
      :kicker="t('archive.eyebrow')"
      :title="t('archive.title')"
      :subtitle="t('archive.usage', { count: filteredDocuments.length, usedMb })"
    >
      <template #actions>
        <BaseButton variant="secondary" size="sm" @click="handleExport">
          <Icon name="download" :size="14" :stroke-width="1.7" />
          {{ t('archive.export') }}
        </BaseButton>
      </template>
    </PageHeader>

    <BaseCard padding="md">
      <div class="archive-page__toolbar">
        <ArchiveFilters
          :active="activeFilter"
          :total-all="totalCounts.all"
          @change="activeFilter = $event"
        />

        <SearchInput
          v-model="search"
          :placeholder="t('archive.searchPlaceholder')"
          :aria-label="t('archive.searchPlaceholder')"
          class="archive-page__search"
        />
      </div>

      <DocumentsTable
        :documents="filteredDocuments"
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
    </BaseCard>

    <BaseModal
      :open="Boolean(previewModalUrl)"
      backdrop-class="archive-page__preview-backdrop"
      panel-class="archive-page__preview-modal"
      :aria-label="previewModalTitle"
      @close="closePreviewModal"
    >
      <div class="archive-page__preview-head">
        <strong>{{ previewModalTitle }}</strong>
        <IconButton
          icon="close"
          :label="t('common.closeDialog')"
          :icon-size="16"
          @click="closePreviewModal"
        />
      </div>
      <iframe
        class="archive-page__preview-frame"
        :src="previewModalUrl"
        :title="t('documents.table.previewTitle')"
      ></iframe>
    </BaseModal>

    <DocumentDeleteConfirmModal
      :open="deleteConfirmOpen"
      :file-name="deleteTarget?.name ?? ''"
      :loading="isDeletingDocument"
      @close="closeDeleteConfirm"
      @confirm="confirmPendingDelete"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArchiveFilters, useArchivePage } from '@/features/archive'
import { DocumentDeleteConfirmModal } from '@/features/documents'
import {
  BaseButton,
  BaseCard,
  BaseModal,
  DocumentsTable,
  Icon,
  IconButton,
  PageHeader,
  SearchInput,
} from '@/shared/ui'

const { t } = useI18n()

const {
  activeFilter,
  search,
  filteredDocuments,
  usedMb,
  totalCounts,
  isLoading,
  previewModalUrl,
  previewModalTitle,
  canOpenDocument,
  formatDate,
  actionLabel,
  actionTone,
  handleView,
  handleDownload,
  handleExport,
  closePreviewModal,
  handleEmailSend,
  handleDelete,
  deleteConfirmOpen,
  deleteTarget,
  isDeletingDocument,
  closeDeleteConfirm,
  confirmPendingDelete,
} = useArchivePage()

const tableLabels = computed(() => ({
  file: t('documents.table.file'),
  date: t('documents.table.date'),
  action: t('documents.table.action'),
  viewAction: t('documents.table.viewAction'),
  downloadAction: t('documents.table.downloadAction'),
  otherActions: t('documents.table.otherActions'),
  emailSend: t('common.emailSend'),
  delete: t('common.delete'),
  emptyTitle: t('documents.table.emptyTitle'),
  emptyDescription: t('documents.table.emptyDescription'),
}))
</script>

<style scoped>
.archive-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.archive-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.archive-page__search {
  margin-left: auto;
}

.archive-page__preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-soft);
}

.archive-page__preview-frame {
  width: 100%;
  height: 75vh;
  border: 0;
  display: block;
  background: var(--color-surface-empty);
}

@media (max-width: 720px) {
  .archive-page__search {
    margin-left: 0;
    width: 100%;
  }
}
</style>
