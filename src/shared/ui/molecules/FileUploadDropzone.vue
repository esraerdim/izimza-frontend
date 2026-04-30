<script setup lang="ts">
import { ref } from 'vue'
import Icon from '../atoms/Icon.vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    accept?: string
    statusText?: string
    isLarge?: boolean
    isPulse?: boolean
    disabled?: boolean
    iconSize?: number
    fullHeight?: boolean
  }>(),
  {
    accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg',
    statusText: '',
    isLarge: false,
    isPulse: false,
    disabled: false,
    iconSize: 28,
    fullHeight: false,
  },
)

const emit = defineEmits<{
  (event: 'file-selected', file: File): void
}>()

const isDragOver = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const openFilePicker = () => {
  if (props.disabled) return
  fileInputRef.value?.click()
}

const onDragOver = (event: DragEvent) => {
  if (props.disabled) return
  event.preventDefault()
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (event: DragEvent) => {
  if (props.disabled) return
  event.preventDefault()
  isDragOver.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (droppedFile) emit('file-selected', droppedFile)
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) emit('file-selected', selectedFile)
  target.value = ''
}
</script>

<template>
  <section
    class="dropzone"
    :class="{
      'dropzone--large': isLarge,
      'dropzone--pulse': isPulse,
      'dropzone--dragover': isDragOver,
      'dropzone--disabled': disabled,
      'dropzone--full-height': fullHeight,
    }"
    role="button"
    tabindex="0"
    @dragover="onDragOver"
    @dragenter="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="openFilePicker"
    @keydown.enter.prevent="openFilePicker"
    @keydown.space.prevent="openFilePicker"
  >
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      hidden
      :disabled="disabled"
      @change="onFileSelected"
    />
    <div class="dropzone__icon" aria-hidden="true">
      <Icon name="upload-cloud" :size="iconSize" :stroke-width="1.6" />
    </div>
    <div class="dropzone__title">{{ title }}</div>
    <div class="dropzone__sub">{{ subtitle }}</div>
    <p v-if="statusText" class="dropzone__status">{{ statusText }}</p>
    <slot name="footer" />
  </section>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  border: 2px dashed var(--color-border-dashed);
  border-radius: var(--radius-lg);
  background: var(--color-surface-empty);
  text-align: center;
  cursor: pointer;
  transition:
    background 0.18s,
    border-color 0.18s,
    transform 0.12s ease;
  outline: none;
}

.dropzone:hover,
.dropzone:focus-visible,
.dropzone--dragover {
  border-color: var(--color-brand-primary);
  background: var(--color-brand-tint);
}

.dropzone--large {
  padding: 56px 24px;
}

.dropzone--pulse {
  animation: dropzone-pulse 1.6s ease-in-out infinite;
}

.dropzone--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropzone--full-height {
  height: 100%;
}

.dropzone__icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dropzone__title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: 15px;
}

.dropzone__sub {
  font-size: 12px;
  color: var(--color-text-muted);
}

.dropzone__status {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: var(--color-brand-primary);
  font-weight: var(--font-weight-medium);
}

@keyframes dropzone-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.005);
  }
}
</style>
