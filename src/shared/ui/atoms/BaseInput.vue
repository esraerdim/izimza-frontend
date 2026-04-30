<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  
  autofocus?: boolean
  disabled?: boolean
  ariaLabel?: string
  ariaInvalid?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const focusInput = async () => {
  await nextTick()
  inputRef.value?.focus()
}

onMounted(() => {
  if (props.autofocus) focusInput()
})

watch(
  () => props.autofocus,
  (next, prev) => {
    if (next && !prev) focusInput()
  },
)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    ref="inputRef"
    class="base-input"
    :value="modelValue"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :required="required"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :aria-label="ariaLabel || undefined"
    :aria-invalid="ariaInvalid || undefined"
    @input="onInput"
  />
</template>

<style scoped>
.base-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface-card);
  color: var(--ink);
  font-size: 14px;
  font-family: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    background 0.15s;
}

.base-input::placeholder {
  color: var(--color-text-muted);
}

.base-input:focus {
  outline: none;
  border-color: var(--color-brand-primary);
  box-shadow: var(--ring-brand);
}

.base-input[aria-invalid='true'] {
  border-color: var(--color-danger);
}

.base-input[aria-invalid='true']:focus {
  box-shadow: var(--ring-danger);
}

.base-input:disabled {
  background: var(--color-surface-row-hover);
  cursor: not-allowed;
}
</style>
