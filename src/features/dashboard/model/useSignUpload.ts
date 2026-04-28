import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dashboardApi, type DashboardDocument } from '../api/dashboard.api'

export const useSignUpload = () => {
  const route = useRoute()
  const router = useRouter()
  const progress = ref(0)
  const isUploading = ref(false)
  const selectedDoc = ref<DashboardDocument | null>(null)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
  let progressTimer: number | null = null

  const toAbsolutePreviewUrl = (rawUrl?: string) => {
    if (!rawUrl) return ''
    if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('blob:')) return rawUrl
    if (rawUrl.startsWith('/')) return `${apiBaseUrl}${rawUrl}`
    return `${apiBaseUrl}/${rawUrl}`
  }

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
      step += 8
      progress.value = Math.min(step, 100)
      if (progress.value >= 100) {
        stopProgressTimer()
      }
    }, 180)
  }

  const setSelectedDocument = (document: DashboardDocument) => {
    selectedDoc.value = document
    startPreviewProgress()
  }

  const uploadFromDropzone = async (file: File) => {
    const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2))
    if (fileSizeMb > 50) return

    isUploading.value = true
    try {
      const uploadedDoc = await dashboardApi.uploadDocument({ file })
      setSelectedDocument(uploadedDoc)
      window.dispatchEvent(new Event('dashboard:data:refresh'))
      await router.replace({ name: 'sign', query: { docId: String(uploadedDoc.id) } })
    } finally {
      isUploading.value = false
    }
  }

  onMounted(async () => {
    const docId = Number(route.query.docId)
    if (Number.isNaN(docId)) return
    const recent = await dashboardApi.getRecentDocuments()
    const document = recent.find((item) => item.id === docId)
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
