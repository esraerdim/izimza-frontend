<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
    label?: string
  }>(),
  {
    max: 100,
    tone: 'brand',
    label: '',
  },
)

const percent = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<template>
  <div
    class="progress"
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-label="label || undefined"
  >
    <span
      class="progress__bar"
      :class="`progress__bar--${tone}`"
      :style="{ width: `${percent}%` }"
    ></span>
  </div>
</template>

<style scoped>
.progress {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--color-border-soft);
  overflow: hidden;
}

.progress__bar {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 0.2s ease;
}

.progress__bar--brand {
  background: linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-secondary));
}

.progress__bar--success {
  background: var(--color-success, #10b981);
}

.progress__bar--warning {
  background: #f59e0b;
}

.progress__bar--danger {
  background: var(--color-error, #dc2626);
}

.progress__bar--neutral {
  background: var(--color-text-secondary);
}
</style>
