<script setup lang="ts">
import Icon from '../atoms/Icon.vue'

defineProps<{
  modelValue: string
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  collapseOnMobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') emit('submit')
}
</script>

<template>
  <label class="search-input" :class="{ 'search-input--mobile-hidden': collapseOnMobile }">
    <Icon name="search" :size="16" class="search-input__icon" aria-hidden="true" />
    <input
      class="search-input__field"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel || placeholder || 'Search'"
      :disabled="disabled"
      @input="onInput"
      @keydown="onKeydown"
    />
  </label>
</template>

<style scoped>
.search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  min-width: 220px;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.search-input:focus-within {
  border-color: var(--color-brand-primary);
  box-shadow: var(--ring-brand);
}

.search-input__icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.search-input__field {
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  color: inherit;
  width: 100%;
}

.search-input__field::placeholder {
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .search-input--mobile-hidden {
    display: none;
  }
}
</style>
