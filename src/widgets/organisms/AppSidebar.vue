<script setup lang="ts">
import { NavIcon } from '../../shared/ui'
import type { NavIconName } from '../../shared/ui/atoms/NavIcon.vue'
const emit = defineEmits<{
  (event: 'navigate'): void
}>()

const navItems: { name: string; label: string; to: string; icon: NavIconName }[] = [
  { name: 'dashboard', label: 'Anasayfa', to: '/', icon: 'home' },
  { name: 'sign', label: 'İmzala', to: '/sign', icon: 'sign' },
  { name: 'timestamp', label: 'Zaman Damgala', to: '/timestamp', icon: 'clock' },
  { name: 'archive', label: 'Arşiv', to: '/archive', icon: 'archive' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand-row">
      <div class="brand-icon">N</div>
      <h1 class="brand">izimza</h1>
    </div>
    <nav class="menu">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="nav-item"
        exact-active-class="active"
        @click="emit('navigate')"
      >
        <span class="nav-icon" aria-hidden="true">
          <NavIcon :name="item.icon" />
        </span>
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
