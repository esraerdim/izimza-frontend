<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ArchiveFilter } from '../model/useArchivePage'

defineProps<{
  active: ArchiveFilter
  totalAll: number
}>()

const emit = defineEmits<{
  (event: 'change', value: ArchiveFilter): void
}>()

const { t } = useI18n()

const FILTERS: { id: ArchiveFilter; labelKey: string }[] = [
  { id: 'all', labelKey: 'archive.filters.all' },
  { id: 'signed', labelKey: 'archive.filters.signed' },
  { id: 'timestamped', labelKey: 'archive.filters.timestamped' },
  { id: 'shared', labelKey: 'archive.filters.shared' },
]
</script>

<template>
  <div class="archive-filters" role="tablist" :aria-label="t('archive.title')">
    <button
      v-for="filter in FILTERS"
      :key="filter.id"
      type="button"
      role="tab"
      :aria-selected="active === filter.id"
      class="archive-filters__btn"
      :class="{ 'archive-filters__btn--active': active === filter.id }"
      @click="emit('change', filter.id)"
    >
      {{ t(filter.labelKey) }}
      <span v-if="filter.id === 'all'" class="archive-filters__count">{{ totalAll }}</span>
    </button>
  </div>
</template>

<style scoped>
.archive-filters {
  display: inline-flex;
  align-items: center;
  background: var(--color-surface-empty);
  padding: 4px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
  gap: 2px;
}

.archive-filters__btn {
  padding: 6px 12px;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  font: inherit;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}

.archive-filters__btn:hover {
  color: var(--color-text-primary);
}

.archive-filters__btn--active {
  background: var(--color-surface-card);
  color: var(--color-brand-primary);
  box-shadow: var(--shadow-sm);
}

.archive-filters__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
}

.archive-filters__btn--active .archive-filters__count {
  background: var(--color-brand-primary);
  color: var(--color-text-on-brand);
}
</style>
