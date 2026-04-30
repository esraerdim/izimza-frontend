<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BaseButton, BaseModal } from '@/shared/ui'

const props = withDefaults(
  defineProps<{
    open: boolean
    fileName: string
    loading?: boolean
  }>(),
  { loading: false },
)

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const { t } = useI18n()

const onClose = () => {
  if (props.loading) return
  emit('close')
}
</script>

<template>
  <BaseModal
    :open="open"
    :close-on-backdrop="!loading"
    :close-on-escape="!loading"
    panel-class="document-delete-confirm-modal__panel"
    :aria-label="t('documents.deleteConfirm.title')"
    @close="onClose"
  >
    <div class="document-delete-confirm">
      <h3 class="document-delete-confirm__title">{{ t('documents.deleteConfirm.title') }}</h3>
      <p class="document-delete-confirm__msg">
        {{ t('documents.deleteConfirm.message', { name: fileName }) }}
      </p>
      <div class="document-delete-confirm__actions">
        <BaseButton variant="ghost" size="sm" :disabled="loading" @click="onClose">
          {{ t('documents.deleteConfirm.cancel') }}
        </BaseButton>
        <BaseButton size="sm" :disabled="loading" @click="emit('confirm')">
          {{ loading ? t('documents.deleteConfirm.working') : t('documents.deleteConfirm.confirm') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.document-delete-confirm {
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-8) var(--space-8) var(--space-7);
}

.document-delete-confirm__title {
  margin: 0 0 var(--space-5) 0;
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.35;
}

.document-delete-confirm__msg {
  margin: 0 0 var(--space-7) 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.document-delete-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding-top: var(--space-2);
}
</style>

<style>

.base-modal__panel.document-delete-confirm-modal__panel {
  width: min(440px, calc(100vw - 40px));
}
</style>
