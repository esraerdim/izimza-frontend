import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDocumentsStore } from '@/entities/document'
import { BYTES_PER_MB, MAX_UPLOAD_SIZE_MB } from '@/shared/config'
import { devError } from '@/shared/lib'

type UploadResult = { ok: true; successMessage: string } | { ok: false; errorKey: string }


export const useDashboardUpload = () => {
  const router = useRouter()
  const { t } = useI18n()
  const documentsStore = useDocumentsStore()

  const uploadFile = async (file: File): Promise<UploadResult> => {
    const fileSizeMb = Number((file.size / BYTES_PER_MB).toFixed(2))

    if (fileSizeMb > MAX_UPLOAD_SIZE_MB) {
      return { ok: false, errorKey: 'dashboard.secondRow.fileTooLarge' }
    }

    try {
      const document = await documentsStore.upload(file)
      await router.push({ name: 'sign', query: { docId: String(document.id) } })
      return {
        ok: true,
        successMessage: t('dashboard.secondRow.uploadSuccess', { name: file.name }),
      }
    } catch (error) {
      devError('dashboard.uploadFile', error)
      return { ok: false, errorKey: 'dashboard.secondRow.uploadError' }
    }
  }

  return { uploadFile }
}
