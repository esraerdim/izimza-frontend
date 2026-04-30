import { ref } from 'vue'
import { toAbsolutePreviewUrl } from '@/shared/lib'

export const usePreviewUrl = () => {
  const previewUrl = ref('')

  const clearPreviewUrl = () => {
    if (previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = ''
  }

  const setPreviewFromUpload = (remotePreviewUrl: string | undefined, file: File) => {
    previewUrl.value = toAbsolutePreviewUrl(remotePreviewUrl) || URL.createObjectURL(file)
  }

  return {
    previewUrl,
    clearPreviewUrl,
    setPreviewFromUpload,
  }
}
