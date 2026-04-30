<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BaseButton, BaseInput, BaseModal, FormField } from '@/shared/ui'

const props = defineProps<{
  open: boolean
  modelValue: string
  
  invalid?: boolean
  title?: string
  description?: string
  label?: string
  placeholder?: string
  errorMessage?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'cancel'): void
  (event: 'confirm'): void
}>()

const { t } = useI18n()

const resolvedTitle = computed(() => props.title ?? t('timestampPage.recipientDialog.title'))
const resolvedDescription = computed(
  () => props.description ?? t('timestampPage.recipientDialog.description'),
)
const resolvedLabel = computed(() => props.label ?? t('timestampPage.recipientDialog.label'))
const resolvedPlaceholder = computed(
  () => props.placeholder ?? t('timestampPage.recipientDialog.placeholder'),
)
const resolvedError = computed(
  () => props.errorMessage ?? t('timestampPage.recipientDialog.invalidEmail'),
)

const onSubmit = () => emit('confirm')
const onUpdate = (value: string) => emit('update:modelValue', value)
</script>

<template>
  <BaseModal
    :open="open"
    backdrop-class="modal-back"
    panel-class="modal recipient-dialog"
    :aria-label="resolvedTitle"
    @close="emit('cancel')"
  >
    <form class="recipient-dialog-form" novalidate @submit.prevent="onSubmit">
      <h3 class="modal-title">{{ resolvedTitle }}</h3>
      <p class="modal-sub">{{ resolvedDescription }}</p>

      <FormField :label="resolvedLabel" :error="invalid ? resolvedError : ''">
        <BaseInput
          :model-value="props.modelValue"
          type="email"
          :placeholder="resolvedPlaceholder"
          autofocus
          required
          :aria-invalid="invalid || undefined"
          @update:model-value="onUpdate"
        />
      </FormField>

      <div class="recipient-dialog-actions">
        <BaseButton type="button" variant="secondary" @click="emit('cancel')">
          {{ t('timestampPage.recipientDialog.cancel') }}
        </BaseButton>
        <BaseButton type="submit">
          {{ t('timestampPage.recipientDialog.confirm') }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.recipient-dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recipient-dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 4px;
}
</style>
