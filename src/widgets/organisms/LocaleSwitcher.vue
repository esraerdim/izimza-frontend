<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, type AppLocale } from '@/shared/config'
import { DropdownMenu, DropdownMenuItem, Icon } from '@/shared/ui'

const { t, locale } = useI18n()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const choose = (value: AppLocale) => {
  locale.value = value
  localStorage.setItem(LOCALE_STORAGE_KEY, value)
  close()
}
</script>

<template>
  <DropdownMenu :open="isOpen" align="right" @close="close">
    <template #trigger>
      <button
        type="button"
        class="locale-trigger"
        :aria-label="t('common.language')"
        :aria-expanded="isOpen"
        aria-haspopup="menu"
        @click="toggle"
      >
        <Icon name="globe" :size="16" />
        <span>{{ String(locale).toUpperCase() }}</span>
        <Icon name="chevron-down" :size="14" />
      </button>
    </template>
    <DropdownMenuItem
      v-for="option in SUPPORTED_LOCALES"
      :key="option"
      :label="option.toUpperCase()"
      :icon="option === (locale as AppLocale) ? 'check' : undefined"
      @select="choose(option)"
    />
  </DropdownMenu>
</template>

<style scoped>
.locale-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  font: inherit;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.locale-trigger:hover {
  background: var(--color-surface-row-hover);
}

.locale-trigger:focus-visible {
  outline: none;
  box-shadow: var(--ring-brand);
}
</style>
