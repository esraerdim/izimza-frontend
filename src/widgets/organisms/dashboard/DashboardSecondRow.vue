<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useDashboardActivities, useDashboardUpload } from '@/features/dashboard'
import { useToast } from '@/shared/lib'
import { BaseCard, EmptyState, Icon, TimelineItem } from '@/shared/ui'
import UploadCard from '@/widgets/organisms/UploadCard.vue'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const { formattedActivities } = useDashboardActivities()
const { uploadFile } = useDashboardUpload()

const isUploading = ref(false)

const onFileSelected = async (file: File) => {
  isUploading.value = true
  try {
    const result = await uploadFile(file)
    if (result.ok) {
      toast.success(result.successMessage)
    } else {
      toast.error(t(result.errorKey))
    }
  } finally {
    isUploading.value = false
  }
}

const goToArchive = () => router.push({ name: 'archive' })
</script>

<template>
  <section class="dashboard-second-row">
    <UploadCard
      :title="t('dashboard.secondRow.quickSignTitle')"
      :subtitle="t('dashboard.secondRow.quickSignSub')"
      :badge="t('dashboard.secondRow.eSignReady')"
      :drop-title="t('dashboard.secondRow.dropTitle')"
      :drop-subtitle="t('dashboard.secondRow.dropSubtitle')"
      :status-text="isUploading ? t('dashboard.secondRow.uploading') : ''"
      @file-selected="onFileSelected"
    />

    <BaseCard padding="md" as="section" class="dashboard-second-row__activity">
      <header class="dashboard-second-row__head">
        <h2 class="dashboard-second-row__title">{{ t('dashboard.secondRow.activityTitle') }}</h2>
        <button class="dashboard-second-row__link" type="button" @click="goToArchive">
          {{ t('dashboard.secondRow.all') }}
          <Icon name="arrow-right" :size="13" />
        </button>
      </header>

      <EmptyState
        v-if="formattedActivities.length === 0"
        icon="clock"
        :title="t('dashboard.secondRow.emptyTitle')"
        :description="t('dashboard.secondRow.emptySub')"
      />
      <ul v-else class="dashboard-second-row__timeline">
        <TimelineItem
          v-for="item in formattedActivities"
          :key="item.id"
          :title="item.title"
          :subtitle="item.subtitle"
          :tone="item.tone"
        />
      </ul>
    </BaseCard>
  </section>
</template>

<style scoped>
.dashboard-second-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}

.dashboard-second-row__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dashboard-second-row__title {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.dashboard-second-row__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 0;
  font: inherit;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  color: var(--color-brand-primary);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
}

.dashboard-second-row__link:hover {
  background: var(--color-brand-soft);
}

.dashboard-second-row__timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}

@media (max-width: 1080px) {
  .dashboard-second-row {
    grid-template-columns: 1fr;
  }
}
</style>
