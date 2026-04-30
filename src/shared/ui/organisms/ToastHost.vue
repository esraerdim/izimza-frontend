<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib'
import IconButton from '../atoms/IconButton.vue'

const { toasts, dismiss } = useToast()
const { t } = useI18n()
</script>

<template>
  <Teleport to="body">
    <div class="toast-host" role="region" aria-live="polite" :aria-label="t('shell.notifications')">
      <transition-group name="toast" tag="ul" class="toast-host__stack">
        <li
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-host__toast"
          :class="`toast-host__toast--${toast.tone}`"
          role="status"
        >
          <span class="toast-host__message">{{ toast.message }}</span>
          <IconButton
            icon="close"
            :label="t('shell.dismissNotification')"
            :icon-size="14"
            variant="ghost"
            @click="dismiss(toast.id)"
          />
        </li>
      </transition-group>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-host {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 200;
  pointer-events: none;
}

.toast-host__stack {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.toast-host__toast {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-soft);
  box-shadow: var(--shadow-md);
  min-width: 240px;
  max-width: 360px;
  font-size: 13px;
  color: var(--color-text-primary);
}

.toast-host__toast--success {
  border-left: 3px solid var(--color-success);
}

.toast-host__toast--error {
  border-left: 3px solid var(--color-danger);
}

.toast-host__toast--info {
  border-left: 3px solid var(--color-info);
}

.toast-host__message {
  flex: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.18s,
    opacity 0.18s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
