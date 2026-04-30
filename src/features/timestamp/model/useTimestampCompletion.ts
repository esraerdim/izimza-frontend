import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { downloadFromUrl, openWebMailCompose, useFormatDate } from '@/shared/lib'

type CompletionContext = {
  fileName: string
  previewUrl: string
}


export const useTimestampCompletion = () => {
  const { t } = useI18n()
  const { formatTimestampLabel } = useFormatDate()

  const isOpen = ref(false)
  const autoArchive = ref(true)
  const completionTimestampLabel = ref('')

  const open = () => {
    autoArchive.value = true
    completionTimestampLabel.value = formatTimestampLabel(new Date())
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const sendToMe = (ctx: CompletionContext) => {
    const subject = t('timestampPage.sendMeSubject', { name: ctx.fileName })
    const body = t('timestampPage.sendMeBody')
    openWebMailCompose(subject, body)
  }

  const sendToRecipient = (ctx: CompletionContext, recipient: string) => {
    const subject = t('timestampPage.sendOtherSubject', { name: ctx.fileName })
    const body = t('timestampPage.sendOtherBody')
    openWebMailCompose(subject, body, recipient)
  }

  const downloadStamped = (ctx: CompletionContext) => {
    if (!ctx.previewUrl || !ctx.fileName) return
    downloadFromUrl(ctx.previewUrl, ctx.fileName)
  }

  return {
    isOpen,
    autoArchive,
    completionTimestampLabel,
    open,
    close,
    sendToMe,
    sendToRecipient,
    downloadStamped,
  }
}
