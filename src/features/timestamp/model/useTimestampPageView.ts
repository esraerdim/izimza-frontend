import { computed, ref } from 'vue'
import { BYTES_PER_MB } from '@/shared/config'

type TimestampCompletionActions = {
  sendToMe: (payload: { fileName: string; previewUrl: string }) => void
  downloadStamped: (payload: { fileName: string; previewUrl: string }) => void
  sendToRecipient: (payload: { fileName: string; previewUrl: string }, recipient: string) => void
}

type RecipientState = {
  draft: { value: string }
  close: () => void
  isValid: () => boolean
  trimmedRecipient: () => string
}

type Options = {
  remainingCredits: () => number
  creditUse: number
  isUploaded: () => boolean
  isStamping: () => boolean
  isCompletionOpen: () => boolean
  selectedFile: () => File | null
  previewUrl: () => string
  completion: TimestampCompletionActions
  recipient: RecipientState
}

export const useTimestampPageView = (options: Options) => {
  const recipientInvalid = ref(false)

  const creditsRemain = computed(() => Math.max(0, options.remainingCredits()))
  const showStampDock = computed(
    () =>
      Boolean(options.selectedFile()) &&
      options.isUploaded() &&
      !options.isStamping() &&
      !options.isCompletionOpen(),
  )

  const eqBarStyle = (index: number) => ({
    animationDelay: `${(index - 1) * 0.09}s`,
  })

  const formatFileSize = (sizeBytes: number) => (sizeBytes / BYTES_PER_MB).toFixed(2)

  const onSendToMe = () => {
    const file = options.selectedFile()
    if (!file) return
    options.completion.sendToMe({ fileName: file.name, previewUrl: options.previewUrl() })
  }

  const onDownload = () => {
    const file = options.selectedFile()
    if (!file) return
    options.completion.downloadStamped({
      fileName: file.name,
      previewUrl: options.previewUrl(),
    })
  }

  const onRecipientInput = (value: string) => {
    options.recipient.draft.value = value
    if (recipientInvalid.value && options.recipient.isValid()) recipientInvalid.value = false
  }

  const onRecipientCancel = () => {
    recipientInvalid.value = false
    options.recipient.close()
  }

  const onConfirmRecipient = () => {
    const file = options.selectedFile()
    if (!file) {
      onRecipientCancel()
      return
    }
    if (!options.recipient.isValid()) {
      recipientInvalid.value = true
      return
    }
    options.completion.sendToRecipient(
      { fileName: file.name, previewUrl: options.previewUrl() },
      options.recipient.trimmedRecipient(),
    )
    recipientInvalid.value = false
    options.recipient.close()
  }

  return {
    recipientInvalid,
    creditsRemain,
    showStampDock,
    eqBarStyle,
    formatFileSize,
    onSendToMe,
    onDownload,
    onRecipientInput,
    onRecipientCancel,
    onConfirmRecipient,
  }
}
