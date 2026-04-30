import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  canOpenPdfDocument,
  getDocumentActionKey,
  getDocumentActionTone,
} from '../lib/document-actions'
import { useDocumentsStore } from './documents.store'
import type { DocumentItem } from '../types/document'
import {
  downloadFromUrl,
  openWebMailCompose,
  toAbsolutePreviewUrl,
  useFormatDate,
} from '@/shared/lib'

type Options = {
  enablePreviewModal?: boolean
}

export const useDocumentTableActions = (options: Options = {}) => {
  const { enablePreviewModal = false } = options
  const { t } = useI18n()
  const { formatDateTime } = useFormatDate()
  const documentsStore = useDocumentsStore()

  const previewModalUrl = ref('')
  const previewModalTitle = ref('')
  const deleteTarget = ref<DocumentItem | null>(null)
  const isDeletingDocument = ref(false)
  const deleteConfirmOpen = computed(() => deleteTarget.value !== null)

  const actionLabel = (action: string) => t(getDocumentActionKey(action))
  const actionTone = getDocumentActionTone
  const canOpenDocument = canOpenPdfDocument

  const handleView = (document: DocumentItem) => {
    if (!canOpenDocument(document)) return
    const previewUrl = toAbsolutePreviewUrl(document.previewUrl)
    if (!previewUrl) return

    if (enablePreviewModal) {
      previewModalUrl.value = `${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
      previewModalTitle.value = document.name
      return
    }

    window.open(previewUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDownload = (document: DocumentItem) => {
    if (!canOpenDocument(document)) return
    const previewUrl = toAbsolutePreviewUrl(document.previewUrl)
    if (!previewUrl) return
    downloadFromUrl(previewUrl, document.name)
  }

  const handleEmailSend = (document: DocumentItem) => {
    const previewUrl = toAbsolutePreviewUrl(document.previewUrl)
    const subject = t('documents.email.shareSubject', { name: document.name })
    const body = t('documents.email.shareBody', { url: previewUrl })
    openWebMailCompose(subject, body)
  }

  const handleDelete = (document: DocumentItem) => {
    deleteTarget.value = document
  }

  const closeDeleteConfirm = () => {
    if (isDeletingDocument.value) return
    deleteTarget.value = null
  }

  const confirmPendingDelete = async () => {
    const id = deleteTarget.value?.id
    if (id === undefined) return
    isDeletingDocument.value = true
    try {
      await documentsStore.remove(id)
      deleteTarget.value = null
    } finally {
      isDeletingDocument.value = false
    }
  }

  const closePreviewModal = () => {
    previewModalUrl.value = ''
    previewModalTitle.value = ''
  }

  return {
    formatDate: formatDateTime,
    actionLabel,
    actionTone,
    canOpenDocument,
    previewModalUrl,
    previewModalTitle,
    deleteConfirmOpen,
    deleteTarget,
    isDeletingDocument,
    handleView,
    handleDownload,
    handleEmailSend,
    handleDelete,
    closeDeleteConfirm,
    confirmPendingDelete,
    closePreviewModal,
  }
}
