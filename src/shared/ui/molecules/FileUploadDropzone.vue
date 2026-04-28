<script setup lang="ts">
import { ref } from 'vue'

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
  }>(),
  {
    accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg',
    statusText: '',
    isLarge: false,
    isPulse: false,
    disabled: false,
    iconSize: 22,
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
    class="drop"
    :class="{ 'drop-large': isLarge, pulse: isPulse, 'is-dragover': isDragOver, 'is-disabled': disabled }"
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
    <input ref="fileInputRef" type="file" :accept="accept" hidden :disabled="disabled" @change="onFileSelected" />
    <div class="drop-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" :width="iconSize" :height="iconSize">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <path d="M17 8l-5-5-5 5"></path>
        <path d="M12 3v12"></path>
      </svg>
    </div>
    <div class="drop-title">{{ title }}</div>
    <div class="drop-sub">{{ subtitle }}</div>
    <p v-if="statusText" class="drop-status">{{ statusText }}</p>
    <slot name="footer" />
  </section>
</template>
