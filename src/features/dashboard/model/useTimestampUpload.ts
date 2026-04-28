import { onBeforeUnmount, ref } from 'vue'
import { dashboardApi } from '../api/dashboard.api'

const SIMULATED_UPLOAD_DURATION_MS = 5000
const SIMULATED_STAMPING_DURATION_MS = 5000

export const useTimestampUpload = () => {
  const isUploading = ref(false)
  const isStamping = ref(false)
  const isUploaded = ref(false)
  const uploadMessage = ref('')
  const selectedFile = ref<File | null>(null)
  const uploadedDocumentId = ref<number | null>(null)
  const uploadTotalMb = ref(0)
  const uploadProgressMb = ref(0)
  const uploadProgressPercent = ref(0)
  const previewUrl = ref('')
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
  const stampingProgressPercent = ref(0)
  const showCompletionModal = ref(false)
  const autoArchive = ref(true)
  let uploadTimer: number | null = null
  let stampingTimer: number | null = null

  const toAbsolutePreviewUrl = (rawUrl?: string) => {
    if (!rawUrl) return ''
    if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('blob:')) return rawUrl
    if (rawUrl.startsWith('/')) return `${apiBaseUrl}${rawUrl}`
    return `${apiBaseUrl}/${rawUrl}`
  }

  const stopUploadTimer = () => {
    if (uploadTimer !== null) {
      window.clearInterval(uploadTimer)
      uploadTimer = null
    }
  }

  const stopStampingTimer = () => {
    if (stampingTimer !== null) {
      window.clearInterval(stampingTimer)
      stampingTimer = null
    }
  }

  const clearPreviewUrl = () => {
    if (previewUrl.value?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = ''
  }

  const resetTimestampPage = () => {
    stopUploadTimer()
    stopStampingTimer()
    clearPreviewUrl()
    selectedFile.value = null
    uploadedDocumentId.value = null
    isUploading.value = false
    isUploaded.value = false
    isStamping.value = false
    uploadMessage.value = ''
    uploadTotalMb.value = 0
    uploadProgressMb.value = 0
    uploadProgressPercent.value = 0
    stampingProgressPercent.value = 0
    autoArchive.value = true
    showCompletionModal.value = false
  }

  const clearSelectedFile = async () => {
    if (uploadedDocumentId.value !== null) {
      try {
        await dashboardApi.deleteDocument(uploadedDocumentId.value)
        window.dispatchEvent(new Event('dashboard:data:refresh'))
      } catch {
        uploadMessage.value = 'Belge silinirken bir sorun oluştu.'
        return
      }
    }
    resetTimestampPage()
  }

  const uploadFile = async (file: File) => {
    stopUploadTimer()
    clearPreviewUrl()
    selectedFile.value = file
    uploadMessage.value = ''
    const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2))
    uploadTotalMb.value = fileSizeMb
    uploadProgressMb.value = 0
    uploadProgressPercent.value = 0

    if (fileSizeMb > 50) {
      uploadMessage.value = 'Dosya boyutu 50 MB limitini asamaz.'
      selectedFile.value = null
      isUploaded.value = false
      return
    }

    isUploaded.value = false
    isUploading.value = true
    const startedAt = Date.now()
    uploadTimer = window.setInterval(async () => {
      const elapsedMs = Date.now() - startedAt
      const progressRatio = Math.min(1, elapsedMs / SIMULATED_UPLOAD_DURATION_MS)
      uploadProgressPercent.value = Math.round(progressRatio * 100)
      uploadProgressMb.value = Number((uploadTotalMb.value * progressRatio).toFixed(2))

      if (progressRatio >= 1) {
        stopUploadTimer()
        isUploading.value = false
        try {
          const uploadedDoc = await dashboardApi.uploadDocument({ file })
          uploadedDocumentId.value = uploadedDoc.id
          isUploaded.value = true
          uploadMessage.value = 'Yüklendi · Damgalamaya hazır'
          previewUrl.value = toAbsolutePreviewUrl(uploadedDoc.previewUrl) || URL.createObjectURL(file)
          window.dispatchEvent(new Event('dashboard:data:refresh'))
        } catch {
          uploadMessage.value = 'Yükleme sırasında bir sorun oluştu.'
        }
      }
    }, 100)
  }

  const handleTimestamp = async () => {
    if (!selectedFile.value || isStamping.value || uploadedDocumentId.value === null) return

    isStamping.value = true
    stampingProgressPercent.value = 0
    stopStampingTimer()
    const startedAt = Date.now()
    stampingTimer = window.setInterval(() => {
      const next = stampingProgressPercent.value + Math.max(1, Math.round(Math.random() * 6))
      stampingProgressPercent.value = Math.min(93, next)
    }, 140)

    try {
      await dashboardApi.markDocumentTimestamped(uploadedDocumentId.value)
      const elapsed = Date.now() - startedAt
      if (elapsed < SIMULATED_STAMPING_DURATION_MS) {
        await new Promise((resolve) => window.setTimeout(resolve, SIMULATED_STAMPING_DURATION_MS - elapsed))
      }
      stopStampingTimer()
      stampingProgressPercent.value = 100
      uploadMessage.value = 'Damgalama tamamlandı.'
      window.dispatchEvent(new Event('dashboard:data:refresh'))
      autoArchive.value = true
      showCompletionModal.value = true
      window.setTimeout(() => {
        isStamping.value = false
        stampingProgressPercent.value = 0
      }, 450)
    } catch {
      stopStampingTimer()
      stampingProgressPercent.value = 0
      uploadMessage.value = 'Zaman damgalama sırasında bir sorun oluştu.'
      isStamping.value = false
    }
  }

  const closeCompletionModal = () => {
    if (!autoArchive.value && uploadedDocumentId.value !== null) {
      dashboardApi
        .deleteDocument(uploadedDocumentId.value)
        .then(() => {
          window.dispatchEvent(new Event('dashboard:data:refresh'))
          resetTimestampPage()
        })
        .catch(() => {
          uploadMessage.value = 'Arşiv kaydı güncellenemedi.'
        })
      return
    }
    resetTimestampPage()
  }

  const openWebMailCompose = (subject: string, body: string, recipient = '') => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipient,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  const sendToMe = () => {
    if (!selectedFile.value) return
    const subject = `Damgalanan Belge: ${selectedFile.value.name}`
    const body = 'Belge başarıyla damgalandı.'
    openWebMailCompose(subject, body)
  }

  const sendToOther = () => {
    if (!selectedFile.value) return
    const recipient = window.prompt('Alıcı e-posta adresini girin:', '') ?? ''
    const subject = `Belge Paylaşımı: ${selectedFile.value.name}`
    const body = 'Belgeyi incelemeniz için iletiyorum.'
    openWebMailCompose(subject, body, recipient.trim())
  }

  const downloadStampedFile = () => {
    if (!previewUrl.value || !selectedFile.value) return
    const link = window.document.createElement('a')
    link.href = previewUrl.value
    link.download = selectedFile.value.name
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  onBeforeUnmount(() => {
    stopUploadTimer()
    stopStampingTimer()
    clearPreviewUrl()
  })

  return {
    isUploading,
    isStamping,
    isUploaded,
    uploadMessage,
    selectedFile,
    uploadTotalMb,
    uploadProgressMb,
    uploadProgressPercent,
    previewUrl,
    stampingProgressPercent,
    showCompletionModal,
    autoArchive,
    clearSelectedFile,
    uploadFile,
    handleTimestamp,
    closeCompletionModal,
    sendToMe,
    sendToOther,
    downloadStampedFile,
  }
}
