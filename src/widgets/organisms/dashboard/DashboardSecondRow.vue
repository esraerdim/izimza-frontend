<script setup lang="ts">
import { useDashboardSecondRow } from '../../../features/dashboard'
import { ActionChip, FileUploadDropzone, TimelineItem } from '../../../shared/ui'

const { formattedActivities, isUploading, uploadMessage, uploadFile } = useDashboardSecondRow()
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

      <FileUploadDropzone
        title="Dosyalarını yüklemek için tıkla ya da sürükle"
        subtitle="PDF · DOCX · PNG · JPG · En fazla 50 MB"
        :status-text="isUploading ? 'Yükleniyor...' : uploadMessage"
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
