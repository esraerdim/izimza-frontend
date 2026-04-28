<script setup lang="ts">
defineProps<{
  label: string
  icon: 'sign' | 'stamp' | 'share'
}>()
</script>

<template>
  <span class="chip">
    <svg
      v-if="icon === 'sign'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="12"
      height="12"
    >
      <path d="M14 4l6 6-11 11H3v-6z"></path>
      <path d="M13 5l6 6"></path>
    </svg>
    <svg
      v-else-if="icon === 'stamp'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="12"
      height="12"
    >
      <path d="M5 21h14"></path>
      <path d="M9 17h6l1.5-3a4 4 0 0 0-1-5L14 7V5a2 2 0 1 0-4 0v2L7.5 9a4 4 0 0 0-1 5z"></path>
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="12"
      height="12"
    >
      <path d="M22 2L11 13"></path>
      <path d="M22 2l-7 20-4-9-9-4z"></path>
    </svg>
    {{ label }}
  </span>
</template>
