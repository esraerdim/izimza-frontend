<template>
  <section class="sign-page">
    <PageHeader
      :kicker="t('signPage.eyebrow')"
      :title="t('signPage.pageTitle')"
      :subtitle="t('signPage.pageSub')"
    />

    <UploadCard
      :subtitle="t('signPage.sub')"
      :badge="t('signPage.eSignReady')"
      :drop-title="t('signPage.dropTitle')"
      :drop-subtitle="t('signPage.dropSubtitle')"
      :bare="true"
      :aside-active="Boolean(selectedDoc)"
      :status-text="isUploading ? t('signPage.uploading') : ''"
      @file-selected="uploadFromDropzone"
    >
      <template v-if="selectedDoc" #aside>
        <div class="sign-page__preview-shell">
          <article v-if="!isPreviewReady" class="sign-page__file-card">
            <div class="sign-page__thumb">
              <BaseSpinner />
            </div>
            <p class="sign-page__name">{{ selectedDoc.name }}</p>
            <p class="sign-page__size">{{ formattedSize }}</p>
            <ProgressBar :value="progress" tone="brand" />
            <p class="sign-page__progress-badge">%{{ progress }}</p>
          </article>

          <article v-else class="sign-page__preview-body">
            <div class="sign-page__cover">
              <iframe
                v-if="previewCoverUrl"
                class="sign-page__cover-frame"
                :src="previewCoverUrl"
                :title="t('signPage.previewTitle')"
                scrolling="no"
              ></iframe>
              <div v-else class="sign-page__cover-fallback">PDF</div>
            </div>
            <div class="sign-page__meta">
              <p class="sign-page__name">{{ selectedDoc.name }}</p>
              <p class="sign-page__size">{{ formattedSize }}</p>
            </div>
          </article>
        </div>
      </template>
    </UploadCard>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSignUpload } from '@/features/sign'
import { BaseSpinner, PageHeader, ProgressBar } from '@/shared/ui'
import UploadCard from '@/widgets/organisms/UploadCard.vue'

const { t } = useI18n()
const {
  isUploading,
  selectedDoc,
  progress,
  formattedSize,
  previewCoverUrl,
  isPreviewReady,
  uploadFromDropzone,
} = useSignUpload()
</script>

<style scoped>
.sign-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sign-page__preview-shell {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  height: 100%;
}

.sign-page__file-card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  text-align: center;
}

.sign-page__preview-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  text-align: left;
}

.sign-page__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sign-page__thumb {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  background: var(--color-brand-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign-page__cover {
  width: 100%;
  aspect-ratio: 3 / 4;
  max-height: 480px;
  margin-inline: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-soft);
  background: #f8f6f1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign-page__cover-frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.sign-page__cover-fallback {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.sign-page__name {
  margin: 0;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: 14px;
  word-break: break-word;
}

.sign-page__size {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.sign-page__progress-badge {
  margin: 0;
  font-size: 12px;
  color: var(--color-brand-primary);
  font-weight: var(--font-weight-semibold);
}
</style>
