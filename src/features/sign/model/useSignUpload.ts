import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDocumentsStore } from '@/entities/document'
import { useDashboardStore } from '@/entities/dashboard'
import type { DocumentItem } from '@/entities/document'
import {
  BYTES_PER_MB,
  MAX_UPLOAD_SIZE_MB,
  PREVIEW_TICK_INCREMENT,
  PREVIEW_TICK_INTERVAL_MS,
} from '@/shared/config'
import {
  devError,
  parseRouteQueryId,
  toAbsolutePreviewUrl,
  useToast,
  validateUploadGuard,
} from '@/shared/lib'

export const useSignUpload = () => {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const toast = useToast()
  const documentsStore = useDocumentsStore()
  const dashboardStore = useDashboardStore()

  const progress = ref(0)
  const isUploading = ref(false)
  const selectedDoc = ref<DocumentItem | null>(null)
  let progressTimer: number | null = null

  const formattedSize = computed(() => {
    if (!selectedDoc.value) return ''
    return `${selectedDoc.value.sizeMb.toFixed(1)} MB`
  })

  const previewUrl = computed(() => {
    if (!selectedDoc.value?.previewUrl) return ''
    return toAbsolutePreviewUrl(selectedDoc.value.previewUrl)
  })

  const previewCoverUrl = computed(() => {
    if (!previewUrl.value) return ''
    return `${previewUrl.value}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH`
  })

  const isPreviewReady = computed(() => progress.value >= 100)

  const stopProgressTimer = () => {
    if (progressTimer !== null) {
      window.clearInterval(progressTimer)
      progressTimer = null
    }
  }

  const startPreviewProgress = () => {
    stopProgressTimer()
    progress.value = 0
    let step = 0
    progressTimer = window.setInterval(() => {
      step += PREVIEW_TICK_INCREMENT
      progress.value = Math.min(step, 100)
      if (progress.value >= 100) {
        stopProgressTimer()
      }
    }, PREVIEW_TICK_INTERVAL_MS)
  }

  const setSelectedDocument = (document: DocumentItem) => {
    selectedDoc.value = document
    startPreviewProgress()
  }

  const uploadFromDropzone = async (file: File) => {
    await dashboardStore.loadStats()
    const guard = validateUploadGuard({
      file,
      remainingCredits: dashboardStore.stats.remainingCredits,
      maxUploadSizeMb: MAX_UPLOAD_SIZE_MB,
      bytesPerMb: BYTES_PER_MB,
    })
    if (!guard.ok && guard.error === 'noCredits') {
      toast.error(t('errors.noCredits'))
      return
    }

    if (!guard.ok && guard.error === 'fileTooLarge') {
      toast.error(t('errors.fileTooLarge'))
      return
    }

    isUploading.value = true
    try {
      const uploadedDoc = await documentsStore.upload(file)
      setSelectedDocument(uploadedDoc)
      toast.success(t('signPage.uploadSuccess', { name: uploadedDoc.name }))
      await router.replace({ name: 'sign', query: { docId: String(uploadedDoc.id) } })
    } catch (error) {
      devError('sign.uploadFromDropzone', error)
      toast.error(t('signPage.uploadError'))
    } finally {
      isUploading.value = false
    }
  }

  onMounted(async () => {
    const docId = parseRouteQueryId(route.query.docId)
    if (docId === null) return
    await documentsStore.loadRecent()
    const document = documentsStore.recentDocuments.find((item) => item.id === docId)
    if (document) setSelectedDocument(document)
  })

  onBeforeUnmount(() => stopProgressTimer())

  return {
    isUploading,
    selectedDoc,
    progress,
    formattedSize,
    previewCoverUrl,
    isPreviewReady,
    uploadFromDropzone,
  }
}
