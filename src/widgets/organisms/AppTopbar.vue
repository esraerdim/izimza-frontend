<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { IconButton, SearchInput } from '@/shared/ui'
import AppBreadcrumbs from './AppBreadcrumbs.vue'
import LocaleSwitcher from './LocaleSwitcher.vue'
import UserMenu from './UserMenu.vue'

const { t } = useI18n()
const router = useRouter()

defineEmits<{ (event: 'toggle-menu'): void }>()

const searchTerm = ref('')

const onSearch = () => {
  const term = searchTerm.value.trim()
  router.push({ name: 'archive', query: term ? { q: term } : {} })
}
</script>

<template>
  <header class="topbar">
    <IconButton
      icon="menu"
      :label="t('shell.openMenu')"
      :icon-size="18"
      class="topbar__menu-btn"
      @click="$emit('toggle-menu')"
    />

    <AppBreadcrumbs />

    <div class="topbar__right">
      <SearchInput
        v-model="searchTerm"
        :placeholder="t('common.searchDocument')"
        :aria-label="t('common.searchDocument')"
        collapse-on-mobile
        @submit="onSearch"
      />
      <LocaleSwitcher />
      <UserMenu />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: var(--topbar-height);
  padding: 0 24px;
  background: var(--color-surface-card);
  border-bottom: 1px solid var(--color-border-soft);
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar__menu-btn {
  display: none;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

@media (max-width: 900px) {
  .topbar {
    padding: 0 16px;
  }
  .topbar__menu-btn {
    display: inline-flex;
  }
}
</style>
