<script lang="ts">
export type BasePillTone =
  | 'brand'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'sage'
  | 'coral'
  | 'amber'
</script>

<script setup lang="ts">
withDefaults(defineProps<{ tone?: BasePillTone }>(), { tone: 'brand' })
</script>

<template>
  <span :class="['base-pill', `base-pill--${tone}`]">
    <slot />
  </span>
</template>

<style scoped>
.base-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.base-pill--brand {
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
}

.base-pill--neutral {
  background: var(--color-border-soft);
  color: var(--color-text-secondary);
}

.base-pill--success,
.base-pill--sage {
  background: var(--color-sage-soft);
  color: var(--color-sage);
}

.base-pill--warning,
.base-pill--amber {
  background: var(--color-amber-soft);
  color: var(--color-amber);
}

.base-pill--danger {
  background: var(--color-error-soft);
  color: var(--color-error);
}

.base-pill--coral {
  background: var(--color-coral-soft);
  color: var(--color-coral);
}
</style>
