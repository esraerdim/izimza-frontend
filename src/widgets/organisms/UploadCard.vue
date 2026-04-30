<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { BaseCard, BasePill, DropzoneChips, FileUploadDropzone } from '@/shared/ui'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    badge?: string
    dropTitle: string
    dropSubtitle: string
    statusText?: string
    isPulse?: boolean
    isLarge?: boolean
    bare?: boolean

    asideActive?: boolean
  }>(),
  {
    subtitle: '',
    badge: '',
    statusText: '',
    isPulse: false,
    isLarge: false,
    bare: false,
    asideActive: undefined,
  },
)

const emit = defineEmits<{
  (event: 'file-selected', file: File): void
}>()

const slots = useSlots()
const hasAside = computed(() =>
  props.asideActive !== undefined ? props.asideActive : Boolean(slots.aside),
)
</script>

<template>
  <section v-if="bare" class="upload-card upload-card--bare">
    <header class="upload-card__head">
      <div>
        <h2 class="upload-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="upload-card__sub">{{ subtitle }}</p>
      </div>
      <BasePill v-if="badge" tone="brand">{{ badge }}</BasePill>
    </header>

    <div :class="{ 'upload-card__row': hasAside }">
      <FileUploadDropzone
        :title="dropTitle"
        :subtitle="dropSubtitle"
        :status-text="statusText"
        :is-pulse="isPulse"
        :is-large="isLarge"
        :full-height="hasAside"
        @file-selected="emit('file-selected', $event)"
      >
        <template #footer>
          <DropzoneChips />
        </template>
      </FileUploadDropzone>
      <slot name="aside" />
    </div>
  </section>
  <BaseCard v-else padding="md" as="section" class="upload-card">
    <header class="upload-card__head">
      <div>
        <h2 class="upload-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="upload-card__sub">{{ subtitle }}</p>
      </div>
      <BasePill v-if="badge" tone="brand">{{ badge }}</BasePill>
    </header>

    <div :class="{ 'upload-card__row': hasAside }">
      <FileUploadDropzone
        :title="dropTitle"
        :subtitle="dropSubtitle"
        :status-text="statusText"
        :is-pulse="isPulse"
        :is-large="isLarge"
        :full-height="hasAside"
        @file-selected="emit('file-selected', $event)"
      >
        <template #footer>
          <DropzoneChips />
        </template>
      </FileUploadDropzone>
      <slot name="aside" />
    </div>
  </BaseCard>
</template>

<style scoped>
.upload-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.upload-card__title {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--color-text-primary);
}

.upload-card__sub {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.upload-card__row {
  display: grid;
  grid-template-columns: minmax(260px, 40%) minmax(300px, 1fr);
  gap: 20px;
  align-items: stretch;
}

.upload-card--bare {
  padding: 0;
}

@media (max-width: 720px) {
  .upload-card__row {
    grid-template-columns: 1fr;
  }
}
</style>
