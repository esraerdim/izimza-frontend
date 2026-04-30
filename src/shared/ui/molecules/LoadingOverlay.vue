<script setup lang="ts">
import BaseSpinner from '../atoms/BaseSpinner.vue'

defineProps<{
  visible: boolean
  label?: string
}>()
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="loading-overlay" role="status" aria-live="polite">
      <BaseSpinner />
      <span v-if="label" class="loading-overlay__label">{{ label }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(2px);
  border-radius: inherit;
  z-index: 5;
}

.loading-overlay__label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
