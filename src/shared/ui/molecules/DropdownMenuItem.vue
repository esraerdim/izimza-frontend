<script setup lang="ts">
import Icon from '../atoms/Icon.vue'
import type { IconName } from '../atoms/icon-types'

withDefaults(
  defineProps<{
    label: string
    icon?: IconName
    
    tone?: 'default' | 'danger'
    disabled?: boolean
  }>(),
  { icon: undefined, tone: 'default', disabled: false },
)

const emit = defineEmits<{ (e: 'select'): void }>()

const onClick = (event: MouseEvent) => {
  event.preventDefault()
  emit('select')
}
</script>

<template>
  <button
    type="button"
    role="menuitem"
    class="dropdown-menu-item"
    :class="{ 'dropdown-menu-item--danger': tone === 'danger' }"
    :disabled="disabled"
    @click="onClick"
  >
    <Icon v-if="icon" :name="icon" :size="16" />
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: 0;
  font: inherit;
  color: var(--color-text-primary);
  cursor: pointer;
  text-align: left;
  border-radius: var(--radius-sm);
  transition:
    background 0.15s,
    color 0.15s;
}

.dropdown-menu-item:hover:not(:disabled),
.dropdown-menu-item:focus-visible {
  background: var(--color-surface-row-hover);
  outline: none;
}

.dropdown-menu-item:disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.dropdown-menu-item--danger {
  color: var(--color-danger);
}
.dropdown-menu-item--danger:hover:not(:disabled) {
  background: var(--color-error-soft);
  color: var(--color-error);
}
</style>
