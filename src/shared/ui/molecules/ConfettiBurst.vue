<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    centered?: boolean
  }>(),
  { count: 18, centered: false },
)

const TONES = ['brand', 'sage', 'coral', 'amber'] as const
type Tone = (typeof TONES)[number]

const pieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  tone: TONES[index % TONES.length] as Tone,
  delay: Math.round(Math.random() * 250) / 1000,
  drift: Math.round(Math.random() * 80 - 40),
  duration: 0.9 + Math.random() * 0.6,
}))
</script>

<template>
  <div class="confetti-burst" :class="{ 'confetti-burst--centered': centered }" aria-hidden="true">
    <span
      v-for="piece in pieces.slice(0, count)"
      :key="piece.id"
      class="confetti-burst__bit"
      :class="`confetti-burst__bit--${piece.tone}`"
      :style="
        {
          '--drift': `${piece.drift}px`,
          '--delay': `${piece.delay}s`,
          '--duration': `${piece.duration}s`,
        } as Record<string, string>
      "
    />
  </div>
</template>

<style scoped>
.confetti-burst {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti-burst--centered {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 140px;
}

.confetti-burst__bit {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 8px;
  height: 14px;
  border-radius: 2px;
  transform: translateX(-50%);
  animation: confetti-fall var(--duration) ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0.9;
}

.confetti-burst__bit--brand {
  background: var(--color-brand-primary);
}
.confetti-burst__bit--sage {
  background: var(--color-sage);
}
.confetti-burst__bit--coral {
  background: var(--color-coral);
}
.confetti-burst__bit--amber {
  background: var(--color-amber);
}

@keyframes confetti-fall {
  0% {
    transform: translate(-50%, 0) rotate(0deg);
    opacity: 0.95;
  }
  100% {
    transform: translate(calc(-50% + var(--drift)), 200px) rotate(380deg);
    opacity: 0;
  }
}
</style>
