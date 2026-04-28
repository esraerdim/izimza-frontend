<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '../organisms/AppSidebar.vue'
import AppTopbar from '../organisms/AppTopbar.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="app-shell" :class="{ 'sidebar-open': isSidebarOpen }">
    <AppSidebar @navigate="closeSidebar" />
    <button
      v-if="isSidebarOpen"
      class="sidebar-backdrop"
      type="button"
      aria-label="Menüyü kapat"
      @click="closeSidebar"
    ></button>
    <div class="main-panel">
      <AppTopbar @toggle-menu="toggleSidebar" />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
