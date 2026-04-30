<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    kicker?: string
    variant?: 'default' | 'compact'
  }>(),
  {
    subtitle: '',
    kicker: '',
    variant: 'default',
  },
)
</script>

<template>
  <div class="page-header" :class="`page-header--${variant}`">
    <div class="page-header__main">
      <p v-if="kicker" class="page-header__kicker">{{ kicker }}</p>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__sub">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: var(--space-6);
}

.page-header--compact {
  margin-bottom: var(--space-4);
}

.page-header__main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.page-header__kicker {
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-brand-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
}

.page-header__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.page-header__sub {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.page-header__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
