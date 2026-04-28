<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: 'primary' | 'secondary'
  }>(),
  {
    type: 'button',
    disabled: false,
    variant: 'primary',
  },
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="variant === 'primary' ? 'btn-primary' : 'btn-secondary'">
    <slot />
  </button>
</template>
