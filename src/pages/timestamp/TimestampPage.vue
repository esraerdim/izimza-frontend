<script setup lang="ts">
import { ref } from 'vue'
import { dashboardApi } from '../../features/dashboard'

const isDragOver = ref(false)
const isUploading = ref(false)
const isStamping = ref(false)
const isUploaded = ref(false)
const uploadMessage = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

const openFilePicker = () => {
  fileInputRef.value?.click()
}

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

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    uploadFile(selectedFile)
  }
  target.value = ''
}

const uploadFile = async (file: File) => {
  selectedFile.value = file
  uploadMessage.value = ''
  const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2))
  if (fileSizeMb > 50) {
    uploadMessage.value = 'Dosya boyutu 50 MB limitini asamaz.'
    selectedFile.value = null
    isUploaded.value = false
    return
  }

  isUploading.value = true
  window.setTimeout(() => {
    isUploading.value = false
    isUploaded.value = true
    uploadMessage.value = 'Yüklendi · Damgalamaya hazır'
  }, 900)
}

const handleTimestamp = async () => {
  if (!selectedFile.value || isStamping.value) return

  const file = selectedFile.value
  const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2))

  isStamping.value = true
  try {
    await dashboardApi.uploadTimestamp({
      fileName: file.name,
      fileSizeMb,
    })
    uploadMessage.value = 'Damgalama tamamlandı.'
    window.dispatchEvent(new Event('dashboard:data:refresh'))
  } catch {
    uploadMessage.value = 'Zaman damgalama sırasında bir sorun oluştu.'
  } finally {
    isStamping.value = false
  }
}
</script>

<template>
  <section class="page timestamp-page">
    <p class="eyebrow">BELGELERİNİ GÜVENE AL</p>
    <h1 class="timestamp-title">Zaman Damgala</h1>
    <p class="timestamp-sub">RFC 3161 uyumlu nitelikli zaman damgası ile dosyalarına resmi tarih ekle.</p>

    <div class="stamp-stage">
      <section
        class="drop drop-large pulse"
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

        <div class="drop-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <path d="M17 8l-5-5-5 5"></path>
            <path d="M12 3v12"></path>
          </svg>
        </div>
        <div class="drop-title">Dosyalarını yüklemek için tıkla ya da sürükle</div>
        <div class="drop-sub">Tek seferde bir belge · maks 50 MB</div>
        <p v-if="isUploading" class="timestamp-drop-status">İşleniyor...</p>
        <p v-else-if="uploadMessage" class="timestamp-drop-status">{{ uploadMessage }}</p>
      </section>

      <aside class="stamp-preview-card" v-if="selectedFile">
        <div class="stamp-preview-paper">
          <div class="stamp-line long"></div>
          <div class="stamp-line"></div>
          <div class="stamp-line short"></div>
          <div class="stamp-bars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p class="stamp-file-name">{{ selectedFile.name }}</p>
        <p class="stamp-file-size">{{ (selectedFile.size / (1024 * 1024)).toFixed(1) }} MB</p>
        <p class="stamp-file-state" :class="{ ready: isUploaded && !isStamping }">
          {{ isStamping ? 'Damgalanıyor...' : uploadMessage || 'Yükleniyor...' }}
        </p>
      </aside>

      <aside class="stamp-preview-card stamp-preview-empty" v-else>
        <p>Sayfayı Temizle</p>
      </aside>
    </div>

    <div class="stamp-action-bar" v-if="isUploaded && selectedFile">
      <div class="stamp-action-text">
        <strong>Damgalamaya hazır</strong>
        <span>Token kullanımı bazlı · 8 kontör kalır</span>
      </div>
      <button class="stamp-action-btn" type="button" :disabled="isStamping" @click="handleTimestamp">
        {{ isStamping ? 'Damgalanıyor...' : 'Zaman Damgala' }}
      </button>
    </div>
  </section>
</template>
