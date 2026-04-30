<template>
  <section class="timestamp-page" :class="{ 'timestamp-page--with-dock': showStampDock }">
    <PageHeader
      :kicker="t('timestampPage.eyebrow')"
      :title="t('timestampPage.title')"
      :subtitle="t('timestampPage.sub')"
    />

    <div
      class="timestamp-page__stage"
      :class="{ 'timestamp-page__stage--has-file': !!selectedFile }"
    >
      <FileUploadDropzone
        :is-pulse="!!selectedFile"
        :title="t('timestampPage.dropTitle')"
        :subtitle="t('timestampPage.dropSubtitle')"
        :status-text="isUploading ? t('timestampPage.processing') : uploadMessage"
        @file-selected="uploadFile"
      >
        <template #footer>
          <DropzoneChips />
        </template>
      </FileUploadDropzone>

      <aside v-if="selectedFile" class="timestamp-page__preview-card">
        <IconButton
          v-if="isUploaded && !isStamping"
          icon="trash"
          :label="t('timestampPage.removeFileAria')"
          :icon-size="13"
          variant="soft"
          class="timestamp-page__trash"
          @click="clearSelectedFile"
        />
        <div
          class="timestamp-page__paper"
          :class="{ 'timestamp-page__paper--busy': isUploading || isStamping }"
        >
          <div
            v-if="isUploaded && previewUrl"
            class="timestamp-page__paper-body timestamp-page__paper-body--pdf"
          >
            <iframe
              class="timestamp-page__frame"
              :src="`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`"
              :title="t('timestampPage.previewTitle')"
              scrolling="no"
            ></iframe>
            <div
              v-if="isStamping"
              class="timestamp-page__stamp-overlay"
              :style="{ '--stamp-p': `${stampingProgressPercent}%` }"
              aria-hidden="true"
            >
              <div class="timestamp-page__stamp-overlay-gradient" />
              <div class="timestamp-page__stamp-overlay-shade" />
              <div class="timestamp-page__stamp-overlay-ui">
                <Icon name="stamp" :size="26" :stroke-width="1.6" />
                <span class="timestamp-page__stamp-pct">%{{ stampingProgressPercent }}</span>
              </div>
            </div>
          </div>
          <div v-else class="timestamp-page__paper-body timestamp-page__paper-body--loading">
            <div class="timestamp-page__skeleton-lines">
              <SkeletonBar width="80%" height="8px" />
              <SkeletonBar width="100%" height="8px" />
              <SkeletonBar width="60%" height="8px" />
            </div>
            <div class="timestamp-page__eq" aria-hidden="true">
              <span v-for="i in 7" :key="i" class="timestamp-page__eq-bar" :style="eqBarStyle(i)" />
            </div>
          </div>
        </div>
        <div class="timestamp-page__meta">
          <p class="timestamp-page__file-name">{{ selectedFile.name }}</p>
          <p class="timestamp-page__file-size">{{ formatFileSize(selectedFile.size) }} MB</p>
          <p
            class="timestamp-page__file-state"
            :class="{ 'timestamp-page__file-state--ready': isUploaded && !isStamping }"
          >
            {{
              isStamping
                ? t('timestampPage.stamping')
                : uploadMessage || t('timestampPage.uploading')
            }}
          </p>
          <div v-if="isUploading" class="timestamp-page__upload-progress">
            <div class="timestamp-page__upload-head">
              <span>{{ uploadProgressMb.toFixed(1) }} MB / {{ uploadTotalMb.toFixed(1) }} MB</span>
              <strong>%{{ uploadProgressPercent }}</strong>
            </div>
            <ProgressBar :value="uploadProgressPercent" tone="brand" />
          </div>
        </div>
      </aside>
    </div>

    <Teleport to="body">
      <div
        v-if="showStampDock"
        class="timestamp-page__dock"
        role="region"
        :aria-label="t('timestampPage.actionReadyTitle')"
      >
        <div class="timestamp-page__dock-inner">
          <Icon name="shield" :size="18" class="timestamp-page__dock-shield" />
          <div class="timestamp-page__dock-copy">
            <div class="timestamp-page__dock-title">{{ t('timestampPage.actionReadyTitle') }}</div>
            <div class="timestamp-page__dock-sub">
              {{ t('timestampPage.actionReadySubFull', { use: creditUse, remain: creditsRemain }) }}
            </div>
          </div>
          <button type="button" class="timestamp-page__dock-cta" @click="handleTimestamp">
            <Icon name="stamp" :size="16" />
            {{ t('timestampPage.actionButton') }}
          </button>
        </div>
      </div>
    </Teleport>

    <BaseModal
      :open="showCompletionModal && Boolean(selectedFile)"
      :aria-label="t('timestampPage.modalTitle')"
      @close="closeCompletionModal"
    >
      <div v-if="selectedFile" class="timestamp-page__completion">
        <div class="timestamp-page__completion-bar">
          <span class="timestamp-page__completion-bar-spacer" aria-hidden="true" />
          <IconButton
            icon="close"
            class="timestamp-page__close"
            :label="t('common.closeDialog')"
            :icon-size="16"
            @click="closeCompletionModal"
          />
        </div>

        <div class="timestamp-page__celebrate">
          <ConfettiBurst centered />
          <div class="timestamp-page__check-wrap">
            <span class="timestamp-page__ripple" />
            <span class="timestamp-page__ripple" />
            <span class="timestamp-page__ripple" />
            <div class="timestamp-page__check-ring">
              <Icon name="check" :size="28" :stroke-width="2" />
            </div>
          </div>
        </div>
        <h3 class="timestamp-page__completion-title">{{ t('timestampPage.modalTitle') }}</h3>
        <p class="timestamp-page__completion-sub">
          {{ t('timestampPage.modalSub', { time: completionTimestampLabel }) }}
        </p>

        <div class="timestamp-page__completion-file">
          <div class="timestamp-page__file-thumb">
            <Icon name="file" :size="16" />
          </div>
          <div>
            <div class="timestamp-page__file-thumb-name">{{ selectedFile.name }}</div>
            <div class="timestamp-page__file-thumb-size">
              {{ formatFileSize(selectedFile.size) }} MB · {{ t('timestampPage.tsaSignedSuffix') }}
            </div>
          </div>
        </div>

        <div class="timestamp-page__completion-actions">
          <BaseButton variant="ghost" size="sm" @click="onSendToMe">
            <Icon name="paper-plane" :size="14" />
            {{ t('timestampPage.sendMe') }}
          </BaseButton>
          <BaseButton variant="ghost" size="sm" @click="recipient.open()">
            <Icon name="user" :size="14" />
            {{ t('timestampPage.sendOther') }}
          </BaseButton>
          <BaseButton size="sm" @click="onDownload">
            <Icon name="download" :size="14" />
            {{ t('timestampPage.download') }}
          </BaseButton>
        </div>

        <label class="timestamp-page__archive-toggle">
          <input v-model="autoArchive" type="checkbox" />
          <span>{{ t('timestampPage.autoArchive') }}</span>
        </label>
      </div>
    </BaseModal>

    <RecipientDialog
      :open="recipient.isOpen.value"
      :model-value="recipient.draft.value"
      :invalid="recipientInvalid"
      @update:model-value="onRecipientInput"
      @cancel="onRecipientCancel"
      @confirm="onConfirmRecipient"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useRecipientDialog,
  useTimestampPageView,
  useTimestampUpload,
  RecipientDialog,
} from '@/features/timestamp'
import { useDashboardStore } from '@/features/dashboard'
import {
  BaseButton,
  BaseModal,
  ConfettiBurst,
  DropzoneChips,
  FileUploadDropzone,
  Icon,
  IconButton,
  PageHeader,
  ProgressBar,
  SkeletonBar,
} from '@/shared/ui'

const { t } = useI18n()
const dashboardStore = useDashboardStore()
const creditUse = 1

const recipient = useRecipientDialog()

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
  completionTimestampLabel,
  completion,
  clearSelectedFile,
  uploadFile,
  handleTimestamp,
  closeCompletionModal,
} = useTimestampUpload()

const {
  recipientInvalid,
  creditsRemain,
  showStampDock,
  eqBarStyle,
  formatFileSize,
  onSendToMe,
  onDownload,
  onRecipientInput,
  onRecipientCancel,
  onConfirmRecipient,
} = useTimestampPageView({
  remainingCredits: () => dashboardStore.stats.remainingCredits,
  creditUse,
  isUploaded: () => isUploaded.value,
  isStamping: () => isStamping.value,
  isCompletionOpen: () => showCompletionModal.value,
  selectedFile: () => selectedFile.value,
  previewUrl: () => previewUrl.value,
  completion,
  recipient,
})

onMounted(() => {
  dashboardStore.loadStats()
})
</script>

<style scoped>
.timestamp-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
}

.timestamp-page--with-dock {
  padding-bottom: 112px;
}

.timestamp-page__stage {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: start;
}

.timestamp-page__stage--has-file {
  grid-template-columns: minmax(0, 1fr) minmax(260px, min(380px, 100%));
  align-items: stretch;
}

@media (max-width: 900px) {
  .timestamp-page__stage--has-file {
    grid-template-columns: 1fr;
  }

  .timestamp-page__preview-card {
    max-width: none;
  }
}

.timestamp-page__preview-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 380px;
  margin-inline: auto;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  padding: 12px 12px 14px;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
  height: 100%;
}

.timestamp-page__trash {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 6;
}

.timestamp-page__paper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 360px;
  margin-inline: auto;
  background: var(--color-surface-empty);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-soft);
  overflow: hidden;
}

.timestamp-page__paper--busy {
  border-color: var(--color-border-default);
}

.timestamp-page__paper-body {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.timestamp-page__paper-body--pdf {
  background: var(--color-surface-empty);
}

.timestamp-page__frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.timestamp-page__stamp-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: hidden;
}

.timestamp-page__stamp-overlay-gradient {
  position: absolute;
  inset: 0;
  background: var(--gradient-stamp-progress);
  opacity: 0.88;
  clip-path: inset(0 calc(100% - var(--stamp-p, 0%)) 0 0);
  transition: clip-path 0.1s linear;
}

.timestamp-page__stamp-overlay-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 23, 42, 0.12) 100%);
  clip-path: inset(0 calc(100% - var(--stamp-p, 0%)) 0 0);
  transition: clip-path 0.1s linear;
}

.timestamp-page__stamp-overlay-ui {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text-on-brand);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.timestamp-page__stamp-pct {
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
}

.timestamp-page__paper-body--loading {
  padding: 20px 16px 0;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-surface-empty) 92%, white) 0%,
    color-mix(in srgb, var(--color-surface-empty) 82%, #e8ecff) 100%
  );
}

.timestamp-page__skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
}

.timestamp-page__eq {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  height: 56px;
  padding: 10px 12px 14px;
  flex-shrink: 0;
}

.timestamp-page__eq-bar {
  flex: 1;
  max-width: 22px;
  height: 100%;
  border-radius: 6px 6px 3px 3px;
  transform-origin: bottom center;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-brand-secondary) 22%, white) 0%,
    var(--color-brand-primary) 100%
  );
  opacity: 0.92;
  animation: timestamp-eq 0.85s ease-in-out infinite;
}

.timestamp-page__eq-bar:nth-child(odd) {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-brand-secondary) 14%, white) 0%,
    color-mix(in srgb, var(--color-brand-secondary) 88%, #4e46d1) 100%
  );
}

@keyframes timestamp-eq {
  0%,
  100% {
    transform: scaleY(0.28);
  }
  50% {
    transform: scaleY(1);
  }
}

.timestamp-page__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timestamp-page__file-name {
  margin: 0;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.timestamp-page__file-size {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.timestamp-page__file-state {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.timestamp-page__file-state--ready {
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

.timestamp-page__upload-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.timestamp-page__upload-head {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.timestamp-page__dock {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 40;
  width: min(560px, calc(100vw - 32px));
  padding: 0 8px;
  pointer-events: none;
}

.timestamp-page__dock-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px 14px 18px;
  border-radius: 999px;
  background: var(--gradient-dock);
  box-shadow:
    0 12px 40px -8px rgba(91, 76, 220, 0.55),
    0 4px 14px rgba(50, 40, 120, 0.12);
  pointer-events: auto;
}

.timestamp-page__dock-shield {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.95);
}

.timestamp-page__dock-copy {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.timestamp-page__dock-title {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-on-brand);
  line-height: 1.25;
}

.timestamp-page__dock-sub {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.78);
}

.timestamp-page__dock-cta {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: #1f1f2e;
  background: var(--color-surface-contrast);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.timestamp-page__dock-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.timestamp-page__completion {
  padding: 0 20px 28px;
  text-align: center;
}

.timestamp-page__completion-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 40px;
  margin: 0 0 4px;
}

.timestamp-page__completion-bar-spacer {
  flex: 1;
}

.timestamp-page__close {
  flex-shrink: 0;
}

.timestamp-page__celebrate {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  min-height: 100px;
}

.timestamp-page__check-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.timestamp-page__ripple {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid rgba(90, 87, 255, 0.45);
  animation: timestamp-ripple 2.1s ease-out infinite;
  pointer-events: none;
}

.timestamp-page__ripple:nth-child(2) {
  animation-delay: 0.55s;
}

.timestamp-page__ripple:nth-child(3) {
  animation-delay: 1.1s;
}

@keyframes timestamp-ripple {
  0% {
    transform: scale(0.92);
    opacity: 0.65;
  }
  100% {
    transform: scale(1.75);
    opacity: 0;
  }
}

.timestamp-page__check-ring {
  position: relative;
  z-index: 2;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--color-brand-primary), var(--color-brand-secondary));
  color: var(--color-text-on-brand);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(90, 87, 255, 0.35);
}

.timestamp-page__completion-title {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
}

.timestamp-page__completion-sub {
  margin: 0 0 20px 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.timestamp-page__completion-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--color-surface-empty);
  border: 1px solid var(--color-border-soft);
  margin-bottom: 16px;
  text-align: left;
}

.timestamp-page__file-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.timestamp-page__file-thumb-name {
  font-weight: var(--font-weight-medium);
  font-size: 13px;
}

.timestamp-page__file-thumb-size {
  font-size: 11px;
  color: var(--color-text-muted);
}

.timestamp-page__completion-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.timestamp-page__archive-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

@media (max-width: 720px) {
  .timestamp-page__dock-inner {
    flex-wrap: wrap;
    border-radius: 20px;
    justify-content: center;
    text-align: center;
  }

  .timestamp-page__dock-copy {
    flex: 1 1 100%;
    text-align: center;
  }

  .timestamp-page__dock-cta {
    width: 100%;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timestamp-page__eq-bar {
    animation: none;
    transform: scaleY(0.65);
  }

  .timestamp-page__ripple {
    animation: none;
    opacity: 0;
  }
}
</style>
