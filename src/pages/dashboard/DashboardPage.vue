<template>
  <section class="dashboard-page">
    <DashboardWelcome />
    <DashboardStatsGrid />
    <DashboardSecondRow />
    <DashboardRecentArchives />
  </section>
</template>

<script setup lang="ts">
import DashboardWelcome from '@/widgets/organisms/dashboard/DashboardWelcome.vue'
import DashboardStatsGrid from '@/widgets/organisms/dashboard/DashboardStatsGrid.vue'
import DashboardSecondRow from '@/widgets/organisms/dashboard/DashboardSecondRow.vue'
import DashboardRecentArchives from '@/widgets/organisms/dashboard/DashboardRecentArchives.vue'
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
