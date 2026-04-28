<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../features/auth/model/auth.store'
import BaseButton from '../../shared/ui/atoms/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { name: 'dashboard', label: 'Anasayfa', to: '/' },
  { name: 'timestamp', label: 'Zaman Damgala', to: '/timestamp' },
  { name: 'archive', label: 'Arsiv', to: '/archive' },
  { name: 'profile', label: 'Profil', to: '/settings/profile' },
]

const handleLogout = async () => {
  await authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <aside class="sidebar">
    <h1 class="brand">izimza</h1>
    <p class="user-email" v-if="authStore.user">{{ authStore.user.email }}</p>
    <nav class="menu">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="menu-item"
        active-class="is-active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <BaseButton variant="secondary" @click="handleLogout">Cikis Yap</BaseButton>
  </aside>
</template>
