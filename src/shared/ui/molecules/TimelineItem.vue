<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  tone: 'brand' | 'sage' | 'coral' | 'amber'
}>()
</script>

<template>
  <li class="timeline-item">
    <span class="timeline-item__dot" :class="`tone-${tone}`"></span>
    <div class="timeline-item__body">
      <div class="timeline-item__title">{{ title }}</div>
      <div class="timeline-item__sub">{{ subtitle }}</div>
    </div>
  </li>
</template>

<style scoped>
.timeline-item {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 10px 0;
  list-style: none;
}

.timeline-item__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.timeline-item__dot.tone-brand {
  background: var(--color-brand-primary);
}
.timeline-item__dot.tone-sage {
  background: var(--color-sage);
}
.timeline-item__dot.tone-coral {
  background: var(--color-coral);
}
.timeline-item__dot.tone-amber {
  background: var(--color-amber);
}

.timeline-item__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-item__title {
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: var(--ink);
}

.timeline-item__sub {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
