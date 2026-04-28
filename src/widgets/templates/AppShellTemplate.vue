<script setup lang="ts">
import AppSidebar from '../organisms/AppSidebar.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>
