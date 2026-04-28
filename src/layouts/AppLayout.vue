<script setup lang="ts">
const navItems = [
  { name: 'dashboard', label: 'Anasayfa', to: '/' },
  { name: 'timestamp', label: 'Zaman Damgala', to: '/timestamp' },
  { name: 'archive', label: 'Arsiv', to: '/archive' },
  { name: 'profile', label: 'Profil', to: '/settings/profile' },
]
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <h1 class="brand">izimza</h1>
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
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>
