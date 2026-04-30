import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  countDocumentsByAction,
  filterDocuments,
  sortByCreatedAtDesc,
  sumDocumentSizeMb,
  useDocumentTableActions,
  useDocumentsStore,
  type DocumentItem,
} from '@/entities/document'
import { exportCsvFile } from '@/shared/lib'

export type ArchiveFilter = 'all' | 'signed' | 'timestamped' | 'shared'

export const useArchivePage = () => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const documentsStore = useDocumentsStore()
  const tableActions = useDocumentTableActions({ enablePreviewModal: true })

  const activeFilter = ref<ArchiveFilter>('all')
  const initialSearch = Array.isArray(route.query.q)
    ? (route.query.q[0] ?? '')
    : (route.query.q ?? '')
  const search = ref(String(initialSearch))

  watch(search, (next) => {
    const trimmed = next.trim()
    if ((route.query.q ?? '') === trimmed) return
    router.replace({
      query: trimmed ? { ...route.query, q: trimmed } : { ...route.query, q: undefined },
    })
  })

  const documents = computed<DocumentItem[]>(() => documentsStore.allDocuments)

  const filteredDocuments = computed(() => {
    const filtered = filterDocuments(documents.value, {
      action: activeFilter.value,
      query: search.value,
    })
    return sortByCreatedAtDesc(filtered)
  })

  const usedMb = computed(() => sumDocumentSizeMb(filteredDocuments.value).toFixed(0))

  const totalCounts = computed(() => {
    const counts = countDocumentsByAction(documents.value, [
      'signed',
      'timestamped',
      'shared',
    ] as const)
    return {
      all: documents.value.length,
      signed: counts.signed ?? 0,
      timestamped: counts.timestamped ?? 0,
      shared: counts.shared ?? 0,
    }
  })

  const handleExport = () => {
    const rows = filteredDocuments.value.map((item) => [
      item.name,
      `${item.sizeMb} MB`,
      tableActions.actionLabel(item.action),
      tableActions.formatDate(item.createdAt),
    ])
    exportCsvFile(
      [
        t('archive.csvHeaders.file'),
        t('archive.csvHeaders.size'),
        t('archive.csvHeaders.action'),
        t('archive.csvHeaders.date'),
      ],
      rows,
      t('archive.csvFileName'),
    )
  }

  onMounted(() => documentsStore.loadAll())
  onBeforeUnmount(() => {
    tableActions.closePreviewModal()
    tableActions.closeDeleteConfirm()
  })

  const isLoading = computed(() => documentsStore.isLoadingAll)

  return {
    activeFilter,
    search,
    filteredDocuments,
    usedMb,
    totalCounts,
    isLoading,
    previewModalUrl: tableActions.previewModalUrl,
    previewModalTitle: tableActions.previewModalTitle,
    canOpenDocument: tableActions.canOpenDocument,
    formatDate: tableActions.formatDate,
    actionLabel: tableActions.actionLabel,
    actionTone: tableActions.actionTone,
    handleView: tableActions.handleView,
    handleDownload: tableActions.handleDownload,
    handleEmailSend: tableActions.handleEmailSend,
    handleDelete: tableActions.handleDelete,
    deleteConfirmOpen: tableActions.deleteConfirmOpen,
    deleteTarget: tableActions.deleteTarget,
    isDeletingDocument: tableActions.isDeletingDocument,
    closeDeleteConfirm: tableActions.closeDeleteConfirm,
    confirmPendingDelete: tableActions.confirmPendingDelete,
    handleExport,
    closePreviewModal: tableActions.closePreviewModal,
  }
}
