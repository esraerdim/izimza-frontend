import { ref } from 'vue'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


export const useRecipientDialog = () => {
  const isOpen = ref(false)
  const draft = ref('')

  const open = () => {
    draft.value = ''
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    draft.value = ''
  }

  const trimmedRecipient = () => draft.value.trim()

  const isValid = () => EMAIL_PATTERN.test(trimmedRecipient())

  return { isOpen, draft, open, close, trimmedRecipient, isValid }
}
