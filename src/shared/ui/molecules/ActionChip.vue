<script setup lang="ts">
import Icon from '../atoms/Icon.vue'
import type { IconName } from '../atoms/icon-types'

defineProps<{
  label: string
  icon: IconName
}>()
</script>

<template>
  <span class="chip">
    <Icon :name="icon" :size="12" :stroke-width="1.6" />
    {{ label }}
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  background: var(--color-surface-row-hover);
  color: var(--color-brand-primary);
}
</style>
