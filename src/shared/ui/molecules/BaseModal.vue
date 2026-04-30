<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    backdropClass?: string
    panelClass?: string
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    ariaLabel?: string
  }>(),
  {
    backdropClass: 'modal-backdrop',
    panelClass: 'modal-panel',
    closeOnBackdrop: true,
    closeOnEscape: true,
    ariaLabel: '',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)
let lastFocusedElement: HTMLElement | null = null

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const getFocusableElements = (): HTMLElement[] => {
  if (!panelRef.value) return []
  return Array.from(panelRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

const focusFirstElement = () => {
  const elements = getFocusableElements()
  if (elements.length > 0) {
    elements[0].focus()
    return
  }
  panelRef.value?.setAttribute('tabindex', '-1')
  panelRef.value?.focus()
}

const onBackdropClick = () => {
  if (props.closeOnBackdrop) emit('close')
}

const trapTab = (event: KeyboardEvent) => {
  const elements = getFocusableElements()
  if (elements.length === 0) {
    event.preventDefault()
    return
  }
  const first = elements[0]
  const last = elements[elements.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    emit('close')
    return
  }
  if (event.key === 'Tab') {
    trapTab(event)
  }
}

watch(
  () => props.open,
  async (next) => {
    if (next) {
      lastFocusedElement = document.activeElement as HTMLElement | null
      window.addEventListener('keydown', onKeyDown)
      await nextTick()
      focusFirstElement()
    } else {
      window.removeEventListener('keydown', onKeyDown)
      lastFocusedElement?.focus?.()
      lastFocusedElement = null
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        :class="['base-modal__backdrop', backdropClass]"
        role="presentation"
        @click.self="onBackdropClick"
      >
        <div
          ref="panelRef"
          :class="['base-modal__panel', panelClass]"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel || undefined"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.base-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.base-modal__panel {
  position: relative;
  isolation: isolate;
  background: var(--color-surface-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: min(560px, 100%);
  max-height: 90vh;
  overflow: auto;
  outline: none;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-active .base-modal__panel,
.modal-leave-active .base-modal__panel {
  transition: transform 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .base-modal__panel,
.modal-leave-to .base-modal__panel {
  transform: translateY(8px);
}
</style>
