<script setup lang="ts">
import { computed, ref } from 'vue'
import BasePill from '../atoms/BasePill.vue'
import Icon from '../atoms/Icon.vue'
import IconButton from '../atoms/IconButton.vue'
import SkeletonBar from '../atoms/SkeletonBar.vue'
import DropdownMenu from '../molecules/DropdownMenu.vue'
import DropdownMenuItem from '../molecules/DropdownMenuItem.vue'
import EmptyState from '../molecules/EmptyState.vue'
import type { BasePillTone } from '../atoms/BasePill.vue'

type TableLabels = {
  file: string
  date: string
  action: string
  viewAction: string
  downloadAction: string
  otherActions: string
  emailSend: string
  delete: string
  emptyTitle: string
  emptyDescription: string
}

type ActionTone = 'stamp' | 'signed' | 'shared' | 'upload' | string
type DocumentTableItem = {
  id: number
  name: string
  sizeMb: number
  action: string
  createdAt: string
  previewUrl?: string
}

const TONE_TO_PILL: Record<string, BasePillTone> = {
  stamp: 'amber',
  signed: 'sage',
  shared: 'brand',
  upload: 'neutral',
}

const props = withDefaults(
  defineProps<{
    documents: DocumentTableItem[]
    labels: TableLabels
    formatDate: (value: string) => string
    actionLabel: (action: string) => string
    actionTone: (action: string) => ActionTone
    canOpenDocument?: (document: DocumentTableItem) => boolean
    isLoading?: boolean
    skeletonRows?: number
  }>(),
  {
    canOpenDocument: undefined,
    isLoading: false,
    skeletonRows: 4,
  },
)

const emit = defineEmits<{
  (event: 'view', document: DocumentTableItem): void
  (event: 'download', document: DocumentTableItem): void
  (event: 'email', document: DocumentTableItem): void
  (event: 'delete', document: DocumentTableItem): void
}>()

const openMenuId = ref<number | null>(null)

const showSkeleton = computed(() => props.isLoading && props.documents.length === 0)

const canOpen = (document: DocumentTableItem) => props.canOpenDocument?.(document) ?? true

const toPillTone = (tone: ActionTone): BasePillTone => TONE_TO_PILL[tone] ?? 'neutral'

const toggleMenu = (documentId: number) => {
  openMenuId.value = openMenuId.value === documentId ? null : documentId
}

const closeMenu = () => {
  openMenuId.value = null
}

const handleMenuAction = (action: 'email' | 'delete', document: DocumentTableItem) => {
  if (action === 'email') emit('email', document)
  else emit('delete', document)
  closeMenu()
}
</script>

<template>
  <div class="documents-table">
    <table>
      <thead>
        <tr>
          <th>{{ labels.file }}</th>
          <th>{{ labels.date }}</th>
          <th>{{ labels.action }}</th>
          <th class="documents-table__actions-col"></th>
        </tr>
      </thead>
      <tbody>
        <template v-if="showSkeleton">
          <tr
            v-for="n in skeletonRows"
            :key="`skeleton-${n}`"
            class="documents-table__skeleton-row"
          >
            <td>
              <div class="documents-table__file-cell">
                <SkeletonBar width="32px" height="32px" radius="8px" />
                <div class="documents-table__file-meta">
                  <SkeletonBar width="160px" height="12px" />
                  <SkeletonBar width="60px" height="10px" />
                </div>
              </div>
            </td>
            <td><SkeletonBar width="120px" height="12px" /></td>
            <td><SkeletonBar width="80px" height="20px" radius="999px" /></td>
            <td><SkeletonBar width="80px" height="14px" /></td>
          </tr>
        </template>
        <tr v-else-if="documents.length === 0">
          <td colspan="4">
            <EmptyState
              icon="inbox"
              :title="labels.emptyTitle"
              :description="labels.emptyDescription"
            />
          </td>
        </tr>
        <template v-else>
          <tr v-for="document in documents" :key="document.id">
            <td>
              <div class="documents-table__file-cell">
                <span class="documents-table__file-icon" aria-hidden="true">
                  <Icon name="file" :size="13" :stroke-width="1.7" />
                </span>
                <div class="documents-table__file-meta">
                  <strong>{{ document.name }}</strong>
                  <small>{{ document.sizeMb }} MB</small>
                </div>
              </div>
            </td>
            <td class="documents-table__muted">{{ formatDate(document.createdAt) }}</td>
            <td>
              <BasePill :tone="toPillTone(actionTone(document.action))">
                {{ actionLabel(document.action) }}
              </BasePill>
            </td>
            <td>
              <div class="documents-table__row-actions">
                <IconButton
                  icon="eye"
                  :label="labels.viewAction"
                  :disabled="!canOpen(document)"
                  @click="emit('view', document)"
                />
                <IconButton
                  icon="download"
                  :label="labels.downloadAction"
                  :disabled="!canOpen(document)"
                  @click="emit('download', document)"
                />
                <DropdownMenu :open="openMenuId === document.id" @close="closeMenu">
                  <template #trigger>
                    <IconButton
                      icon="menu-dots"
                      :label="labels.otherActions"
                      @click="toggleMenu(document.id)"
                    />
                  </template>
                  <DropdownMenuItem
                    icon="mail"
                    :label="labels.emailSend"
                    @select="handleMenuAction('email', document)"
                  />
                  <DropdownMenuItem
                    icon="trash"
                    tone="danger"
                    :label="labels.delete"
                    @select="handleMenuAction('delete', document)"
                  />
                </DropdownMenu>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.documents-table {
  background: var(--color-surface-card);
  overflow: hidden;
}

.documents-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  table-layout: fixed;
}

.documents-table thead th {
  text-align: left;
  padding: 12px 16px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  background: var(--color-surface-card);
  border-bottom: 1px solid var(--color-border-soft);
}

.documents-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-soft);
  vertical-align: middle;
}

.documents-table tbody tr:last-child td {
  border-bottom: 0;
}

.documents-table tbody tr:hover:not(.documents-table__skeleton-row) {
  background: var(--color-surface-row-hover);
}

.documents-table__file-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.documents-table__file-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.documents-table__file-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.documents-table__file-meta strong {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.documents-table__file-meta small {
  font-size: 11px;
  color: var(--color-text-muted);
}

.documents-table__muted {
  color: var(--color-text-secondary);
}

.documents-table__actions-col {
  width: 124px;
  min-width: 124px;
  white-space: nowrap;
  text-align: right;
}

.documents-table__row-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
}
</style>
