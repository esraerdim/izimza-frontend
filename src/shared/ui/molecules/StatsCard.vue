<script setup lang="ts">
type MetricSkin = 'metric-brand' | 'metric-coral' | 'metric-sage' | 'metric-amber'
type MetricIcon = 'sign' | 'archive' | 'credit' | 'box'

withDefaults(
  defineProps<{
    title: string
    value: string | number
    subtitle: string
    trendText?: string
    skin?: MetricSkin
    icon?: MetricIcon
  }>(),
  {
    trendText: '',
    skin: 'metric-brand',
    icon: 'sign',
  },
)
</script>

<template>
  <article class="metric" :class="skin">
    <div class="metric-head">
      <span class="metric-label">{{ title }}</span>
      <span class="metric-icon" aria-hidden="true">
        <svg
          v-if="icon === 'sign'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="16"
          height="16"
        >
          <path d="M14 4l6 6-11 11H3v-6z"></path>
          <path d="M13 5l6 6"></path>
        </svg>

        <svg
          v-else-if="icon === 'archive'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="16"
          height="16"
        >
          <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path>
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>
        </svg>

        <svg
          v-else-if="icon === 'credit'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="16"
          height="16"
        >
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3H9.5a1.5 1.5 0 0 0 0 3H14"></path>
        </svg>

        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="16"
          height="16"
        >
          <rect x="3" y="4" width="18" height="4" rx="1"></rect>
          <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"></path>
          <path d="M10 12h4"></path>
        </svg>
      </span>
    </div>

    <div class="metric-value">{{ value }}</div>
    <div class="metric-sub">{{ subtitle }}</div>
    <div v-if="trendText" class="metric-trend">{{ trendText }}</div>
  </article>
</template>
