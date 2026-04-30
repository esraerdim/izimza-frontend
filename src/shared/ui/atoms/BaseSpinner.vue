<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
    label?: string
  }>(),
  {
    size: 24,
    label: '',
  },
)
</script>

<template>
  <span
    class="spinner"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="status"
    :aria-label="label || undefined"
  >
    <span class="spinner__ring"></span>
  </span>
</template>

<style scoped>
.spinner {
  display: inline-grid;
  place-items: center;
}

.spinner__ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--color-border-soft);
  border-top-color: var(--color-brand-primary);
  animation: spinner-rotate 0.8s linear infinite;
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
