<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../features/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const emit = defineEmits<{
  (event: 'toggle-menu'): void
}>()

const routeLabelMap: Record<string, string> = {
  dashboard: 'Anasayfa',
  sign: 'İmzala',
  timestamp: 'Zaman Damgala',
  archive: 'Arşiv',
  profile: 'Profil',
}

const currentLabel = computed(() => routeLabelMap[String(route.name)] ?? 'Sayfa')
const initials = computed(() => {
  const first = authStore.user?.firstName?.[0] ?? ''
  const last = authStore.user?.lastName?.[0] ?? ''
  return `${first}${last}`.toUpperCase() || 'U'
})

const handleLogout = async () => {
  await authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <header class="topbar">
    <button class="topbar-menu-btn" type="button" @click="emit('toggle-menu')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M3 6h18"></path>
        <path d="M3 12h18"></path>
        <path d="M3 18h18"></path>
      </svg>
    </button>

    <div class="crumbs">
      <span class="crumb-sub">Çalışma alanın</span>
      <span class="crumb-sep">/</span>
      <span class="crumb-active">{{ currentLabel }}</span>
    </div>

    <div class="topbar-right">
      <label class="topbar-search-wrap" aria-label="Belge ara">
        <svg
          class="topbar-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.8"></circle>
          <path d="M16.1 16.1L20 20"></path>
        </svg>
        <input class="topbar-search" type="text" placeholder="Belge ara..." />
      </label>

      <div class="user-menu">
        <button class="avatar-button" type="button">{{ initials }}</button>
        <div class="user-dropdown">
          <RouterLink class="dropdown-item" :to="{ name: 'profile' }">Profil</RouterLink>
          <button class="dropdown-item" type="button" @click="handleLogout">Çıkış Yap</button>
        </div>
      </div>
    </div>
  </header>
</template>
