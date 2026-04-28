<script setup lang="ts">
import { useSignUpload } from '../../features/dashboard'
import { ActionChip, FileUploadDropzone } from '../../shared/ui'

const { isUploading, selectedDoc, progress, formattedSize, previewCoverUrl, isPreviewReady, uploadFromDropzone } =
  useSignUpload()
</script>

<template>
  <section class="page">
    <section class="card upload-card sign-upload-card">
      <div class="card-head">
        <div>
          <h2 class="card-title">İmzala</h2>
          <p class="card-sub">PDF, DOCX veya görsel sürükleyebilirsin · maks 50 MB</p>
        </div>
        <span class="pill pill-brand">e-İmza hazır</span>
      </div>

      <div class="sign-upload-row">
        <FileUploadDropzone
          title="Dosyalarını yüklemek için tıkla ya da sürükle"
          subtitle="PDF · DOCX · PNG · JPG · En fazla 50 MB"
          :status-text="isUploading ? 'Yükleniyor...' : ''"
          @file-selected="uploadFromDropzone"
        >
          <template #footer>
            <div class="drop-chips">
              <ActionChip label="İmza ekle" icon="sign" />
              <ActionChip label="Zaman damgası" icon="stamp" />
              <ActionChip label="Paylaş" icon="share" />
            </div>
          </template>
        </FileUploadDropzone>

        <article v-if="selectedDoc && !isPreviewReady" class="sign-file-card">
          <div class="sign-file-thumb">
            <div class="sign-loader"></div>
          </div>
          <div class="sign-file-name">{{ selectedDoc.name }}</div>
          <div class="sign-file-size">{{ formattedSize }}</div>
          <div class="sign-progress-line">
            <span :style="{ width: `${progress}%` }"></span>
          </div>
          <div class="sign-progress-badge">{{ progress }}%</div>
        </article>

        <article v-else-if="selectedDoc && isPreviewReady" class="sign-preview-card">
          <div class="sign-cover-thumb">
            <iframe
              v-if="previewCoverUrl"
              class="sign-cover-frame"
              :src="previewCoverUrl"
              title="Yüklenen dosya kapak önizleme"
              scrolling="no"
            ></iframe>

            <div v-else class="sign-cover-fallback">PDF</div>
          </div>

          <div class="sign-file-name">{{ selectedDoc.name }}</div>
          <div class="sign-file-size">{{ formattedSize }}</div>
        </article>
      </div>
    </section>
  </section>
</template>
