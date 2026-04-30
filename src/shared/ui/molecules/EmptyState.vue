<script setup lang="ts">
import Icon from '../atoms/Icon.vue'
import type { IconName } from '../atoms/icon-types'

defineProps<{
  
  icon?: IconName
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state" role="status">
    <Icon v-if="icon" :name="icon" :size="40" class="empty-state__icon" />
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__desc">{{ description }}</p>
    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-2);
  padding: var(--space-7) var(--space-5);
  color: var(--color-text-secondary);
}

.empty-state__icon {
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.empty-state__title {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.empty-state__desc {
  font-size: 13px;
  margin: 0;
  max-width: 320px;
}

.empty-state__actions {
  margin-top: var(--space-3);
}
</style>
