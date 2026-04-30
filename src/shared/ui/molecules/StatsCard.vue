<script setup lang="ts">
import Icon from '../atoms/Icon.vue'
import type { IconName } from '../atoms/icon-types'

type MetricSkin = 'metric-brand' | 'metric-coral' | 'metric-sage' | 'metric-amber'

const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    subtitle: string
    trendText?: string
    variant?: MetricSkin
    skin?: MetricSkin
    icon?: IconName
  }>(),
  {
    trendText: '',
    variant: 'metric-brand',
    skin: undefined,
    icon: 'sign',
  },
)
</script>

<template>
  <article class="stats-card" :class="`stats-card--${props.variant ?? props.skin}`">
    <header class="stats-card__head">
      <span class="stats-card__label">{{ title }}</span>
      <span class="stats-card__icon" aria-hidden="true">
        <Icon :name="icon" :size="16" />
      </span>
    </header>

    <div class="stats-card__value">{{ value }}</div>
    <div class="stats-card__sub">{{ subtitle }}</div>
    <div v-if="trendText" class="stats-card__trend">{{ trendText }}</div>
  </article>
</template>

<style scoped>
.stats-card {
  --stats-accent: var(--color-brand-primary);
  --stats-blob: rgba(90, 87, 255, 0.11);
  --stats-blob-far: rgba(90, 87, 255, 0.055);
  --stats-trend-bg: var(--color-brand-soft);
  --stats-trend-fg: var(--color-brand-primary);

  isolation: isolate;
  background-color: var(--color-surface-card);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--stats-accent);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  z-index: 2;
}

.stats-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  background:
    radial-gradient(ellipse 92% 72% at 108% -6%, var(--stats-blob), transparent 56%),
    radial-gradient(ellipse 68% 56% at -10% 108%, var(--stats-blob-far), transparent 52%);
}

.stats-card > * {
  position: relative;
  z-index: 3;
}

.stats-card:hover {
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .stats-card {
    transition: none;
  }

  .stats-card:hover {
    transform: none;
  }
}

.stats-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stats-card__label {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.stats-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.stats-card__value {
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.1;
}

.stats-card__sub {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stats-card__trend {
  align-self: flex-start;
  margin-top: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
  color: var(--stats-trend-fg);
  background: var(--stats-trend-bg);
}

.stats-card--metric-brand .stats-card__icon {
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
}

.stats-card--metric-coral {
  --stats-accent: #e85d7a;
  --stats-blob: rgba(249, 115, 115, 0.12);
  --stats-blob-far: rgba(232, 93, 122, 0.05);
  --stats-trend-bg: var(--color-coral-soft);
  --stats-trend-fg: #c73e5a;
}

.stats-card--metric-coral .stats-card__icon {
  background: var(--color-coral-soft);
  color: var(--color-coral);
}

.stats-card--metric-sage {
  --stats-accent: #0d9f63;
  --stats-blob: rgba(22, 163, 74, 0.11);
  --stats-blob-far: rgba(13, 159, 99, 0.048);
  --stats-trend-bg: var(--color-sage-soft);
  --stats-trend-fg: #15803d;
}

.stats-card--metric-sage .stats-card__icon {
  background: var(--color-sage-soft);
  color: var(--color-sage);
}

.stats-card--metric-amber {
  --stats-accent: #d97706;
  --stats-blob: rgba(245, 158, 11, 0.13);
  --stats-blob-far: rgba(217, 119, 6, 0.048);
  --stats-trend-bg: var(--color-amber-soft);
  --stats-trend-fg: #b45309;
}

.stats-card--metric-amber .stats-card__icon {
  background: var(--color-amber-soft);
  color: var(--color-amber);
}
</style>
