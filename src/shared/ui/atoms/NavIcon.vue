<script setup lang="ts">
type NavIconName = 'home' | 'sign' | 'clock' | 'archive'

export type { NavIconName }

defineProps<{
  name: NavIconName
}>()
</script>

<template>
  <svg
    v-if="name === 'home'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="18"
    height="18"
  >
    <path d="M3 11l9-8 9 8"></path>
    <path d="M5 9v11h14V9"></path>
    <path d="M10 20v-6h4v6"></path>
  </svg>

  <svg
    v-else-if="name === 'sign'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="18"
    height="18"
  >
    <path d="M14 4l6 6-11 11H3v-6z"></path>
    <path d="M13 5l6 6"></path>
  </svg>

  <svg
    v-else-if="name === 'clock'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="18"
    height="18"
  >
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M12 7v5l3 2"></path>
  </svg>

  <svg
    v-else
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="18"
    height="18"
  >
    <rect x="3" y="4" width="18" height="4" rx="1"></rect>
    <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"></path>
    <path d="M10 12h4"></path>
  </svg>
</template>
