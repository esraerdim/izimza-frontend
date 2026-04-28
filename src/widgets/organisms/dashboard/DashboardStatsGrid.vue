<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dashboardApi, type DashboardStats } from '../../../features/dashboard'
import { StatsCard } from '../../../shared/ui'

const stats = ref<DashboardStats>({
  totalSigned: 0,
  totalTimestamped: 0,
  remainingCredits: 0,
  archiveUsageMb: 0,
})

onMounted(async () => {
  try {
    stats.value = await dashboardApi.getStats()
  } catch {
    stats.value = {
      totalSigned: 0,
      totalTimestamped: 0,
      remainingCredits: 0,
      archiveUsageMb: 0,
    }
  }
})
</script>

<template>
  <section class="stats-grid" aria-label="Dashboard istatistik kartlari">
    <StatsCard
      title="Toplam İmzalama"
      :value="stats.totalSigned"
      subtitle="Bu ay 8 belge"
      trend-text="↑ 12%"
      skin="metric-brand"
      icon="sign"
    />
    <StatsCard
      title="Arşivlenen"
      :value="stats.totalTimestamped"
      subtitle="9 zaman damgası"
      trend-text="↑ 4 yeni"
      skin="metric-coral"
      icon="archive"
    />
    <StatsCard
      title="Kalan Kontör"
      :value="stats.remainingCredits"
      subtitle="13 Mayıs'ta yenilenir"
      skin="metric-sage"
      icon="credit"
    />
    <StatsCard
      title="Arşiv Alanı"
      :value="`${stats.archiveUsageMb}MB`"
      subtitle="1024 MB içinden"
      trend-text="%26 dolu"
      skin="metric-amber"
      icon="box"
    />
  </section>
</template>
