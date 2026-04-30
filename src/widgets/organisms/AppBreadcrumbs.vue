<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const ROUTE_LABEL_MAP: Record<string, string> = {
  dashboard: 'nav.dashboard',
  sign: 'nav.sign',
  timestamp: 'nav.timestamp',
  archive: 'nav.archive',
  profile: 'common.profile',
}

const currentLabel = computed(() => {
  const key = ROUTE_LABEL_MAP[String(route.name)]
  return key ? t(key) : t('common.page')
})
</script>

<template>
  <nav class="breadcrumbs" :aria-label="t('shell.breadcrumb')">
    <span class="breadcrumbs__sub">{{ t('common.workspace') }}</span>
    <span class="breadcrumbs__sep" aria-hidden="true">/</span>
    <span class="breadcrumbs__active">{{ currentLabel }}</span>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.breadcrumbs__sub {
  color: var(--color-text-muted);
}

.breadcrumbs__sep {
  color: var(--color-text-muted);
}

.breadcrumbs__active {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
</style>
