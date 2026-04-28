import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { dashboardApi, type DashboardActivity } from '../api/dashboard.api'

export const useDashboardSecondRow = () => {
  const router = useRouter()
  const activities = ref<DashboardActivity[]>([])
  const isUploading = ref(false)
  const uploadMessage = ref('')

  const formattedActivities = computed(() =>
    activities.value.slice(0, 4).map((item, index) => ({
      ...item,
      tone: (['brand', 'sage', 'coral', 'amber'][index] ?? 'brand') as 'brand' | 'sage' | 'coral' | 'amber',
      subtitle: new Date(item.createdAt).toLocaleString('tr-TR', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })),
  )

  const loadActivities = async () => {
    try {
      activities.value = await dashboardApi.getActivities()
    } catch {
      activities.value = []
    }
  }

  const uploadFile = async (file: File) => {
    uploadMessage.value = ''
    const maxSizeMb = 50
    const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2))

    if (fileSizeMb > maxSizeMb) {
      uploadMessage.value = 'Dosya boyutu 50 MB limitini asamaz.'
      return
    }

    isUploading.value = true
    try {
      const document = await dashboardApi.uploadDocument({ file })
      uploadMessage.value = `${file.name} başarıyla yüklendi.`
      await loadActivities()
      window.dispatchEvent(new Event('dashboard:data:refresh'))
      await router.push({ name: 'sign', query: { docId: String(document.id) } })
    } catch {
      uploadMessage.value = 'Belge yükleme sırasında bir sorun oluştu.'
    } finally {
      isUploading.value = false
    }
  }

  onMounted(loadActivities)

  return {
    formattedActivities,
    isUploading,
    uploadMessage,
    uploadFile,
  }
}
