<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSidebar from '@/widgets/organisms/AppSidebar.vue'
import AppTopbar from '@/widgets/organisms/AppTopbar.vue'
import { ToastHost } from '@/shared/ui'

const { t } = useI18n()
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--sidebar-open': isSidebarOpen }">
    <a href="#app-main-content" class="app-shell__skip-link">
      {{ t('shell.skipToContent') }}
    </a>
    <AppSidebar :mobile-open="isSidebarOpen" @navigate="closeSidebar" />
    <button
      v-if="isSidebarOpen"
      class="app-shell__backdrop"
      type="button"
      :aria-label="t('shell.closeMenu')"
      @click="closeSidebar"
    ></button>
    <div class="app-shell__main">
      <AppTopbar @toggle-menu="toggleSidebar" />
      <main id="app-main-content" class="app-shell__content" tabindex="-1">
        <RouterView />
      </main>
    </div>
    <ToastHost />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-surface-page);
}

.app-shell__skip-link {
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 16px;
  background: var(--color-brand-primary);
  color: var(--color-text-on-brand);
  border-radius: 0 0 8px 0;
  transform: translateY(-100%);
  transition: transform 0.15s ease;
  z-index: 1000;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  text-decoration: none;
}

.app-shell__skip-link:focus {
  transform: translateY(0);
}

.app-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-shell__content {
  flex: 1;
  padding: 24px;
  outline: none;
}

.app-shell__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 20;
  border: 0;
  cursor: pointer;
  display: none;
}

@media (max-width: 900px) {
  .app-shell__content {
    padding: 16px;
  }
  .app-shell--sidebar-open .app-shell__backdrop {
    display: block;
  }
}
</style>
