<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDashboardStore } from '@/features/dashboard'
import { ARCHIVE_TOTAL_MB } from '@/shared/config'
import { StatsCard } from '@/shared/ui'

const { t } = useI18n()
const dashboardStore = useDashboardStore()

const stats = computed(() => dashboardStore.stats)

const archivePercent = computed(() =>
  Math.min(100, Math.round((stats.value.archiveUsageMb / ARCHIVE_TOTAL_MB) * 100)),
)

onMounted(() => dashboardStore.loadStats())
</script>

<template>
  <section class="dashboard-stats-grid" :aria-label="t('dashboard.stats.ariaLabel')">
    <StatsCard
      :title="t('dashboard.stats.totalSign')"
      :value="stats.totalSigned"
      :subtitle="t('dashboard.stats.totalSignSub', { count: stats.totalSigned })"
      variant="metric-brand"
      icon="sign"
    />
    <StatsCard
      :title="t('dashboard.stats.archived')"
      :value="stats.totalTimestamped"
      :subtitle="t('dashboard.stats.archivedSub', { count: stats.totalTimestamped })"
      variant="metric-coral"
      icon="archive-stack"
    />
    <StatsCard
      :title="t('dashboard.stats.remainingCredits')"
      :value="stats.remainingCredits"
      :subtitle="t('dashboard.stats.remainingCreditsSub', { count: stats.remainingCredits })"
      variant="metric-sage"
      icon="credit"
    />
    <StatsCard
      :title="t('dashboard.stats.archiveSpace')"
      :value="`${stats.archiveUsageMb}MB`"
      :subtitle="
        t('dashboard.stats.archiveSpaceSub', {
          used: stats.archiveUsageMb,
          total: ARCHIVE_TOTAL_MB,
        })
      "
      :trend-text="t('dashboard.stats.archiveSpaceTrend', { percent: archivePercent })"
      variant="metric-amber"
      icon="box"
    />
  </section>
</template>

<style scoped>
.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1080px) {
  .dashboard-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .dashboard-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
