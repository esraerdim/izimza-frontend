<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  tone: 'brand' | 'sage' | 'coral' | 'amber'
}>()
</script>

<template>
  <li>
    <span class="ts-dot" :class="tone"></span>
    <div>
      <div class="ts-title">{{ title }}</div>
      <div class="ts-sub">{{ subtitle }}</div>
    </div>
  </li>
</template>
