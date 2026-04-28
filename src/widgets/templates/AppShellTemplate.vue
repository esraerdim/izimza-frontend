<script setup lang="ts">
import AppSidebar from '../organisms/AppSidebar.vue'
import AppTopbar from '../organisms/AppTopbar.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <div class="main-panel">
      <AppTopbar />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
