<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
    radius?: string
  }>(),
  {
    width: '100%',
    height: '12px',
    radius: '6px',
  },
)
</script>

<template>
  <span
    class="skeleton-bar"
    aria-hidden="true"
    :style="{ width, height, borderRadius: radius }"
  ></span>
</template>

<style scoped>
.skeleton-bar {
  display: inline-block;
  background: linear-gradient(
    90deg,
    var(--color-border-soft) 0%,
    var(--color-surface-row-hover) 50%,
    var(--color-border-soft) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
