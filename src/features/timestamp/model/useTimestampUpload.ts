import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocumentsStore } from '@/entities/document'
import { useDashboardStore } from '@/entities/dashboard'
import {
  MAX_UPLOAD_SIZE_MB,
  SIMULATED_STAMPING_DURATION_MS,
  STAMPING_RESET_DELAY_MS,
  STAMPING_TICK_INTERVAL_MS,
} from '@/shared/config'
import { BYTES_PER_MB } from '@/shared/config'
import { devError, useToast, validateUploadGuard } from '@/shared/lib'
import { useTimestampCompletion } from './useTimestampCompletion'
import { usePreviewUrl } from './usePreviewUrl'
import { useStampingProgress } from './useStampingProgress'
import { useUploadProgress } from './useUploadProgress'

export const useTimestampUpload = () => {
  const { t } = useI18n()
  const toast = useToast()
  const documentsStore = useDocumentsStore()
  const dashboardStore = useDashboardStore()
  const completion = useTimestampCompletion()
  const upload = useUploadProgress()
  const preview = usePreviewUrl()
  const stamping = useStampingProgress({ tickIntervalMs: STAMPING_TICK_INTERVAL_MS })

  const isUploading = ref(false)
  const isStamping = ref(false)
  const isUploaded = ref(false)
  const uploadMessage = ref('')
  const selectedFile = ref<File | null>(null)
  const uploadedDocumentId = ref<number | null>(null)

  const resetTimestampPage = () => {
    upload.cancel()
    upload.reset()
    stamping.reset()
    preview.clearPreviewUrl()
    selectedFile.value = null
    uploadedDocumentId.value = null
    isUploading.value = false
    isUploaded.value = false
    isStamping.value = false
    uploadMessage.value = ''
    completion.close()
  }

  const clearSelectedFile = async () => {
    if (uploadedDocumentId.value !== null) {
      try {
        await documentsStore.remove(uploadedDocumentId.value)
      } catch (error) {
        devError('timestamp.clearSelectedFile', error)
        uploadMessage.value = t('timestampPage.clearFileError')
        toast.error(t('timestampPage.clearFileError'))
        return
      }
    }
    resetTimestampPage()
  }

  const uploadFile = async (file: File) => {
    await dashboardStore.loadStats()
    const guard = validateUploadGuard({
      file,
      remainingCredits: dashboardStore.stats.remainingCredits,
      maxUploadSizeMb: MAX_UPLOAD_SIZE_MB,
      bytesPerMb: BYTES_PER_MB,
    })
    if (!guard.ok && guard.error === 'noCredits') {
      uploadMessage.value = t('errors.noCredits')
      toast.error(t('errors.noCredits'))
      selectedFile.value = null
      isUploaded.value = false
      return
    }

    upload.cancel()
    preview.clearPreviewUrl()
    selectedFile.value = file
    uploadMessage.value = ''

    if (!guard.ok && guard.error === 'fileTooLarge') {
      uploadMessage.value = t('timestampPage.sizeLimitError')
      toast.error(t('errors.fileTooLarge'))
      selectedFile.value = null
      isUploaded.value = false
      return
    }

    isUploaded.value = false
    isUploading.value = true

    const result = await upload.start(file, guard.fileSizeMb)
    if (result === 'cancelled' || selectedFile.value !== file) {
      isUploading.value = false
      return
    }

    isUploading.value = false

    try {
      const uploadedDoc = await documentsStore.upload(file)
      if (selectedFile.value !== file) return
      uploadedDocumentId.value = uploadedDoc.id
      isUploaded.value = true
      uploadMessage.value = t('timestampPage.uploadReady')
      preview.setPreviewFromUpload(uploadedDoc.previewUrl, file)
    } catch (error) {
      devError('timestamp.uploadFile', error)
      if (selectedFile.value !== file) return
      uploadMessage.value = t('timestampPage.uploadError')
      toast.error(t('timestampPage.uploadError'))
    }
  }

  const handleTimestamp = async () => {
    if (!selectedFile.value || isStamping.value || uploadedDocumentId.value === null) return

    isStamping.value = true
    stamping.start()
    const startedAt = Date.now()

    try {
      await documentsStore.markTimestamped(uploadedDocumentId.value)
      const elapsed = Date.now() - startedAt
      if (elapsed < SIMULATED_STAMPING_DURATION_MS) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, SIMULATED_STAMPING_DURATION_MS - elapsed),
        )
      }
      stamping.complete()
      uploadMessage.value = t('timestampPage.stampSuccess')
      void dashboardStore.invalidate().catch(() => {})
      completion.open()
      window.setTimeout(() => {
        isStamping.value = false
        stamping.reset()
      }, STAMPING_RESET_DELAY_MS)
    } catch (error) {
      devError('timestamp.handleTimestamp', error)
      stamping.reset()
      uploadMessage.value = t('timestampPage.stampError')
      toast.error(t('timestampPage.stampError'))
      isStamping.value = false
    }
  }

  const closeCompletionModal = () => {
    if (!completion.autoArchive.value && uploadedDocumentId.value !== null) {
      documentsStore
        .remove(uploadedDocumentId.value)
        .then(resetTimestampPage)
        .catch((error) => {
          devError('timestamp.closeCompletionModal', error)
          uploadMessage.value = t('timestampPage.archiveUpdateError')
          toast.error(t('timestampPage.archiveUpdateError'))
        })
      return
    }
    resetTimestampPage()
  }

  onBeforeUnmount(() => {
    stamping.stop()
    preview.clearPreviewUrl()
  })

  return {
    isUploading,
    isStamping,
    isUploaded,
    uploadMessage,
    selectedFile,
    uploadTotalMb: upload.totalMb,
    uploadProgressMb: upload.progressMb,
    uploadProgressPercent: upload.progressPercent,
    previewUrl: preview.previewUrl,
    stampingProgressPercent: stamping.progressPercent,
    showCompletionModal: completion.isOpen,
    autoArchive: completion.autoArchive,
    completionTimestampLabel: completion.completionTimestampLabel,
    completion,
    clearSelectedFile,
    uploadFile,
    handleTimestamp,
    closeCompletionModal,
  }
}
