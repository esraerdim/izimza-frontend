<script setup lang="ts">
withDefaults(
  defineProps<{
    
    padding?: 'none' | 'sm' | 'md' | 'lg'
    
    as?: 'div' | 'section' | 'article' | 'aside'
    
    ariaLabel?: string
  }>(),
  { padding: 'md', as: 'div', ariaLabel: undefined },
)
</script>

<template>
  <component :is="as" class="base-card" :class="`base-card--p-${padding}`" :aria-label="ariaLabel">
    <slot />
  </component>
</template>

<style scoped>
.base-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.base-card--p-none {
  padding: 0;
}
.base-card--p-sm {
  padding: var(--space-4);
}
.base-card--p-md {
  padding: var(--space-6);
}
.base-card--p-lg {
  padding: var(--space-7);
}
</style>
