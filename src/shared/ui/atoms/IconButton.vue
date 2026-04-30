<script setup lang="ts">
import Icon from './Icon.vue'
import type { IconName } from './icon-types'

withDefaults(
  defineProps<{
    icon: IconName
    label: string
    size?: number | string
    iconSize?: number | string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: 'ghost' | 'soft' | 'danger'
  }>(),
  {
    size: 30,
    iconSize: 14,
    type: 'button',
    disabled: false,
    variant: 'ghost',
  },
)

defineEmits<{
  (event: 'click', payload: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="label"
    :class="['icon-button', `icon-button--${variant}`]"
    :style="{ '--icon-button-size': typeof size === 'number' ? `${size}px` : String(size) }"
    @click="$emit('click', $event)"
  >
    <Icon :name="icon" :size="iconSize" />
  </button>
</template>

<style scoped>
.icon-button {
  width: var(--icon-button-size, 30px);
  height: var(--icon-button-size, 30px);
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-secondary);
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.icon-button:hover:not(:disabled) {
  background: var(--color-surface-row-hover);
  color: var(--ink);
}

.icon-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.icon-button--soft {
  background: var(--color-surface-row-hover);
}

.icon-button--danger:hover:not(:disabled) {
  color: var(--color-error, #dc2626);
}
</style>
