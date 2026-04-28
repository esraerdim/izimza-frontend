<script setup lang="ts">
import { useTimestampUpload } from '../../features/dashboard'
import { ActionChip, FileUploadDropzone } from '../../shared/ui'

const {
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
} = useTimestampUpload()
</script>

<template>
  <section class="page timestamp-page">
    <p class="eyebrow">BELGELERİNİ GÜVENE AL</p>
    <h1 class="timestamp-title">Zaman Damgala</h1>
    <p class="timestamp-sub">RFC 3161 uyumlu nitelikli zaman damgası ile dosyalarına resmi tarih ekle.</p>

    <div class="stamp-stage" :class="{ 'has-file': !!selectedFile }">
      <FileUploadDropzone
        :is-pulse="!!selectedFile"
        title="Dosyalarını yüklemek için tıkla ya da sürükle"
        subtitle="PDF · DOCX · PNG · JPG · En fazla 50 MB"
        :status-text="isUploading ? 'İşleniyor...' : uploadMessage"
        @file-selected="uploadFile"
      >
        <template #footer>
          <div class="drop-chips">
            <ActionChip label="İmza ekle" icon="sign" />
            <ActionChip label="Zaman damgası" icon="stamp" />
            <ActionChip label="Paylaş" icon="share" />
          </div>
        </template>
      </FileUploadDropzone>

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
