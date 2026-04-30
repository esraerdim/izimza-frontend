<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md'
    fullWidth?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--full': fullWidth },
    ]"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
  white-space: nowrap;
}

.base-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.base-button--md {
  padding: 10px 18px;
}

.base-button--sm {
  padding: 6px 12px;
  font-size: 13px;
}

.base-button--full {
  width: 100%;
}

.base-button--primary {
  background: linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-secondary));
  color: #ffffff;
  box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.6);
}

.base-button--primary:hover:not(:disabled) {
  filter: brightness(1.05);
}

.base-button--secondary {
  background: var(--color-surface-card);
  color: var(--color-brand-primary);
  border-color: var(--color-border-soft);
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--color-surface-row-hover);
}

.base-button--ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.base-button--ghost:hover:not(:disabled) {
  background: var(--color-surface-row-hover);
  color: var(--ink);
}
</style>
