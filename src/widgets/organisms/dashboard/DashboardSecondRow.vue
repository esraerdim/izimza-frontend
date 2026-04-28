<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { dashboardApi, type DashboardActivity } from '../../../features/dashboard'
import { ActionChip, TimelineItem } from '../../../shared/ui'

const router = useRouter()
const activities = ref<DashboardActivity[]>([])
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadMessage = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

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

onMounted(loadActivities)

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (droppedFile) {
    uploadFile(droppedFile)
  }
}

const openFilePicker = () => {
  fileInputRef.value?.click()
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    uploadFile(selectedFile)
  }
  target.value = ''
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
    const document = await dashboardApi.uploadDocument({
      file,
    })
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
</script>

<template>
  <section class="grid-split">
    <section class="card upload-card">
      <div class="card-head">
        <div>
          <h2 class="card-title">Hemen İmzala</h2>
          <p class="card-sub">PDF, DOCX veya görsel sürükleyebilirsin · maks 50 MB</p>
        </div>
        <span class="pill pill-brand">e-İmza hazır</span>
      </div>

      <div
        class="drop"
        :class="{ 'is-dragover': isDragOver }"
        role="button"
        tabindex="0"
        @dragover="onDragOver"
        @dragenter="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        @click="openFilePicker"
        @keydown.enter.prevent="openFilePicker"
        @keydown.space.prevent="openFilePicker"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          hidden
          @change="onFileSelected"
        />
        <div class="drop-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <path d="M17 8l-5-5-5 5"></path>
            <path d="M12 3v12"></path>
          </svg>
        </div>
        <div class="drop-title">Dosyalarını yüklemek için tıkla ya da sürükle</div>
        <div class="drop-sub">PDF · DOCX · PNG · JPG · En fazla 50 MB</div>
        <div v-if="isUploading" class="drop-status">Yükleniyor...</div>
        <div v-else-if="uploadMessage" class="drop-status">{{ uploadMessage }}</div>
        <div class="drop-chips">
          <ActionChip label="İmza ekle" icon="sign" />
          <ActionChip label="Zaman damgası" icon="stamp" />
          <ActionChip label="Paylaş" icon="share" />
        </div>
      </div>
    </section>

    <section class="card activity-card">
      <div class="card-head">
        <h2 class="card-title">Aktivite</h2>
        <button class="link-btn" type="button">
          Tümü
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
            <path d="M5 12h14M13 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <ul class="timeline">
        <TimelineItem
          v-for="item in formattedActivities"
          :key="item.id"
          :title="item.title"
          :subtitle="item.subtitle"
          :tone="item.tone"
        />
      </ul>
    </section>
  </section>
</template>
