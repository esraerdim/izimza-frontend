<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { dashboardApi } from '../../features/dashboard'

const isDragOver = ref(false)
const isUploading = ref(false)
const isStamping = ref(false)
const isUploaded = ref(false)
const uploadMessage = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const uploadedDocumentId = ref<number | null>(null)
const uploadTotalMb = ref(0)
const uploadProgressMb = ref(0)
const uploadProgressPercent = ref(0)
let uploadTimer: number | null = null
let stampingTimer: number | null = null
const SIMULATED_UPLOAD_DURATION_MS = 5000
const SIMULATED_STAMPING_DURATION_MS = 5000
const previewUrl = ref('')
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
const stampingProgressPercent = ref(0)
const showCompletionModal = ref(false)
const autoArchive = ref(true)

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
    // Keep animation moving while backend operation continues.
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

const sendToMe = () => {
  if (!selectedFile.value) return
  const subject = encodeURIComponent(`Damgalanan Belge: ${selectedFile.value.name}`)
  const body = encodeURIComponent('Belge başarıyla damgalandı.')
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

const sendToOther = () => {
  if (!selectedFile.value) return
  const subject = encodeURIComponent(`Belge Paylaşımı: ${selectedFile.value.name}`)
  const body = encodeURIComponent('Belgeyi incelemeniz için iletiyorum.')
  window.location.href = `mailto:?subject=${subject}&body=${body}`
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
</script>

<template>
  <section class="page timestamp-page">
    <p class="eyebrow">BELGELERİNİ GÜVENE AL</p>
    <h1 class="timestamp-title">Zaman Damgala</h1>
    <p class="timestamp-sub">RFC 3161 uyumlu nitelikli zaman damgası ile dosyalarına resmi tarih ekle.</p>

    <div class="stamp-stage" :class="{ 'has-file': !!selectedFile }">
      <section
        class="drop drop-large"
        :class="{ pulse: !!selectedFile, 'is-dragover': isDragOver }"
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
        <button
          v-if="isUploaded && !isStamping"
          class="stamp-trash-btn"
          type="button"
          @click="clearSelectedFile"
          aria-label="Dosyayı kaldır"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
            <path d="M3 6h18"></path>
            <path d="M8 6V4h8v2"></path>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 10v7"></path>
            <path d="M14 10v7"></path>
          </svg>
        </button>
        <div v-if="isUploaded && previewUrl" class="stamp-preview-paper stamp-preview-paper-file">
          <iframe
            class="stamp-preview-frame"
            :src="`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`"
            title="Yüklenen PDF önizleme"
            scrolling="no"
          ></iframe>
        </div>
        <div v-else class="stamp-preview-paper">
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
        <div v-if="isStamping" class="stamp-stamping-overlay">
          <div class="stamp-stamping-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
              <path d="M5 21h14"></path>
              <path d="M9 17h6l1.5-3a4 4 0 0 0-1-5L14 7V5a2 2 0 1 0-4 0v2L7.5 9a4 4 0 0 0-1 5z"></path>
            </svg>
          </div>
          <div class="stamp-stamping-percent">%{{ stampingProgressPercent }}</div>
          <div class="stamp-stamping-bars">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="stamp-preview-meta">
          <p class="stamp-file-name">{{ selectedFile.name }}</p>
          <p class="stamp-file-size">{{ (selectedFile.size / (1024 * 1024)).toFixed(1) }} MB</p>
          <p class="stamp-file-state" :class="{ ready: isUploaded && !isStamping }">
            {{ isStamping ? 'Damgalanıyor...' : uploadMessage || 'Yükleniyor...' }}
          </p>
          <div v-if="isUploading" class="stamp-upload-progress">
            <div class="stamp-upload-progress-head">
              <span>{{ uploadProgressMb.toFixed(1) }} MB / {{ uploadTotalMb.toFixed(1) }} MB</span>
              <strong>%{{ uploadProgressPercent }}</strong>
            </div>
            <div class="stamp-upload-progress-track">
              <span :style="{ width: `${uploadProgressPercent}%` }"></span>
            </div>
          </div>
        </div>
      </aside>

    </div>

    <div class="action-bar" v-if="isUploaded && selectedFile">
      <div class="action-info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z"></path>
        </svg>
        <div>
          <div class="action-title">Damgalamaya hazır</div>
          <div class="action-sub">1 kontör kullanılacak · 8 kontör kalır</div>
        </div>
      </div>
      <button class="action-button" type="button" :disabled="isStamping" @click="handleTimestamp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <path d="M5 21h14"></path>
          <path d="M9 17h6l1.5-3a4 4 0 0 0-1-5L14 7V5a2 2 0 1 0-4 0v2L7.5 9a4 4 0 0 0-1 5z"></path>
        </svg>
        {{ isStamping ? 'Damgalanıyor...' : 'Zaman Damgala' }}
      </button>
    </div>

    <div v-if="showCompletionModal && selectedFile" class="modal-back" @click.self="closeCompletionModal">
      <div class="modal">
        <div class="modal-celebrate">
          <div class="celebrate-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
              <path d="M5 12l5 5L20 7"></path>
            </svg>
          </div>
          <div class="confetti">
            <span class="confetti-bit c0" style="--i: 0;"></span>
            <span class="confetti-bit c1" style="--i: 1;"></span>
            <span class="confetti-bit c2" style="--i: 2;"></span>
            <span class="confetti-bit c3" style="--i: 3;"></span>
            <span class="confetti-bit c0" style="--i: 4;"></span>
            <span class="confetti-bit c1" style="--i: 5;"></span>
            <span class="confetti-bit c2" style="--i: 6;"></span>
            <span class="confetti-bit c3" style="--i: 7;"></span>
            <span class="confetti-bit c0" style="--i: 8;"></span>
            <span class="confetti-bit c1" style="--i: 9;"></span>
            <span class="confetti-bit c2" style="--i: 10;"></span>
            <span class="confetti-bit c3" style="--i: 11;"></span>
            <span class="confetti-bit c0" style="--i: 12;"></span>
            <span class="confetti-bit c1" style="--i: 13;"></span>
          </div>
        </div>
        <h3 class="modal-title">Zaman Damgalama Tamamlandı</h3>
        <p class="modal-sub">
          {{ new Date().toLocaleString('tr-TR') }} itibariyle dosyan kanıtlanabilir şekilde mühürlendi.
        </p>

        <div class="modal-file">
          <div class="ft-thumb">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
            </svg>
          </div>
          <div>
            <div class="ft-name">{{ selectedFile.name }}</div>
            <div class="ft-size">{{ (selectedFile.size / (1024 * 1024)).toFixed(2) }} MB · TSA tarafından imzalandı</div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" @click="sendToMe">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <path d="M22 2L11 13"></path>
              <path d="M22 2l-7 20-4-9-9-4z"></path>
            </svg>
            Bana Gönder
          </button>
          <button class="btn btn-ghost" type="button" @click="sendToOther">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 21a8 8 0 0 1 16 0"></path>
            </svg>
            Başkasına Gönder
          </button>
          <button class="btn btn-primary" type="button" @click="downloadStampedFile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <path d="M7 10l5 5 5-5"></path>
              <path d="M12 15V3"></path>
            </svg>
            İndir
          </button>
        </div>

        <label class="modal-archive">
          <input v-model="autoArchive" type="checkbox" />
          <span class="cbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">
              <path d="M5 12l5 5L20 7"></path>
            </svg>
          </span>
          <span>Arşive otomatik kaydet</span>
        </label>

        <button class="modal-close" type="button" @click="closeCompletionModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="16" height="16">
            <path d="M6 6l12 12M18 6L6 18"></path>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
