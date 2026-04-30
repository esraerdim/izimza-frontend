<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
  
  error?: string
}>()
</script>

<template>
  <label class="form-field" :class="{ 'form-field--error': Boolean(error) }">
    <span class="form-field__label">{{ label }}</span>
    <slot />
    <small v-if="error" class="form-field__error" role="alert">{{ error }}</small>
    <small v-else-if="hint" class="form-field__hint">{{ hint }}</small>
  </label>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field__label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.form-field__hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

.form-field__error {
  font-size: 12px;
  color: var(--color-danger);
  font-weight: var(--font-weight-medium);
}
</style>
