<script setup lang="ts">
import DashboardWelcome from '../../widgets/organisms/dashboard/DashboardWelcome.vue'
import DashboardStatsGrid from '../../widgets/organisms/dashboard/DashboardStatsGrid.vue'
import DashboardSecondRow from '../../widgets/organisms/dashboard/DashboardSecondRow.vue'
import DashboardRecentArchives from '../../widgets/organisms/dashboard/DashboardRecentArchives.vue'
</script>

<template>
  <section class="page">
    <DashboardWelcome />
    <DashboardStatsGrid />
    <DashboardSecondRow />
    <DashboardRecentArchives />
  </section>
</template>
