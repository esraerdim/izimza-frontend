<script setup lang="ts">
import { Icon } from '@/shared/ui'
import type { IconName } from '@/shared/ui'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'

const emit = defineEmits<{ (event: 'navigate'): void }>()
const props = withDefaults(
  defineProps<{
    mobileOpen?: boolean
  }>(),
  { mobileOpen: false },
)

const { t } = useI18n()

type NavItem = {
  routeName: string
  labelKey: string
  to: RouteLocationRaw
  icon: IconName
}

const navItems: NavItem[] = [
  { routeName: 'dashboard', labelKey: 'nav.dashboard', to: { name: 'dashboard' }, icon: 'home' },
  { routeName: 'sign', labelKey: 'nav.sign', to: { name: 'sign' }, icon: 'sign' },
  { routeName: 'timestamp', labelKey: 'nav.timestamp', to: { name: 'timestamp' }, icon: 'clock' },
  { routeName: 'archive', labelKey: 'nav.archive', to: { name: 'archive' }, icon: 'archive' },
]
</script>

<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--mobile-open': props.mobileOpen }"
    aria-label="Primary navigation"
  >
    <div class="sidebar__brand">
      <img class="sidebar__logo" src="/icons.svg" alt="iZimza" />
    </div>
    <nav class="sidebar__menu">
      <RouterLink
        v-for="item in navItems"
        :key="item.routeName"
        :to="item.to"
        class="sidebar__link"
        active-class="sidebar__link--active"
        exact-active-class="sidebar__link--active"
        @click="emit('navigate')"
      >
        <span class="sidebar__icon" aria-hidden="true">
          <Icon :name="item.icon" :size="18" />
        </span>
        {{ t(item.labelKey) }}
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: sticky;
  top: 0;
  background: var(--color-surface-card);
  border-right: 1px solid var(--color-border-soft);
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 20px;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  height: var(--topbar-height);
  padding: 0 6px;
}

.sidebar__logo {
  width: 120px;
  height: auto;
  display: block;
}

.sidebar__menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar__link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: 14px;
  transition:
    background 0.15s,
    color 0.15s;
}

.sidebar__link:hover {
  background: var(--color-surface-row-hover);
  color: var(--color-text-primary);
}

.sidebar__link--active {
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
}

.sidebar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }

  .sidebar--mobile-open {
    transform: translateX(0);
  }
}
</style>
