<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    closeOnOutsideClick?: boolean
    closeOnEscape?: boolean
    align?: 'left' | 'right'
  }>(),
  {
    closeOnOutsideClick: true,
    closeOnEscape: true,
    align: 'right',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const getMenuItems = (): HTMLElement[] => {
  if (!panelRef.value) return []
  return Array.from(
    panelRef.value.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'),
  )
}

const focusItemAt = (index: number) => {
  const items = getMenuItems()
  if (!items.length) return
  const target = items[(index + items.length) % items.length]
  target.focus()
}

const onWindowClick = (event: MouseEvent) => {
  if (!props.closeOnOutsideClick) return
  const target = event.target as Node
  if (rootRef.value && !rootRef.value.contains(target)) {
    emit('close')
  }
}

const onKeyDown = (event: KeyboardEvent) => {
  if (props.closeOnEscape && event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
    return
  }
  if (!panelRef.value) return
  const items = getMenuItems()
  if (!items.length) return
  const currentIndex = items.findIndex((item) => item === document.activeElement)
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusItemAt(currentIndex + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusItemAt(currentIndex - 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusItemAt(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusItemAt(items.length - 1)
  }
}

const attachListeners = () => {
  window.addEventListener('click', onWindowClick)
  window.addEventListener('keydown', onKeyDown)
}

const detachListeners = () => {
  window.removeEventListener('click', onWindowClick)
  window.removeEventListener('keydown', onKeyDown)
}

watch(
  () => props.open,
  async (next) => {
    if (next) {
      attachListeners()
      await nextTick()
      focusItemAt(0)
    } else {
      detachListeners()
    }
  },
  { immediate: true },
)

onBeforeUnmount(detachListeners)
</script>

<template>
  <div ref="rootRef" class="dropdown">
    <slot name="trigger" />
    <transition name="dropdown-fade">
      <div
        v-if="open"
        ref="panelRef"
        class="dropdown__panel"
        :class="`dropdown__panel--${align}`"
        role="menu"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__panel {
  position: absolute;
  top: calc(100% + 6px);
  min-width: 180px;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
  box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.18);
  padding: 6px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown__panel--right {
  right: 0;
}

.dropdown__panel--left {
  left: 0;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
