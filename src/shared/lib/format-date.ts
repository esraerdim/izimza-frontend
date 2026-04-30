import { useI18n } from 'vue-i18n'

const LOCALE_MAP: Record<string, string> = {
  tr: 'tr-TR',
  en: 'en-US',
}

const resolveBcp47 = (locale: string): string => LOCALE_MAP[locale] ?? locale


export const useFormatDate = () => {
  const { locale } = useI18n()

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString(resolveBcp47(locale.value), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatRelativeShort = (value: string) =>
    new Date(value).toLocaleString(resolveBcp47(locale.value), {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatTimestampLabel = (value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value)
    return date.toLocaleString(resolveBcp47(locale.value))
  }

  return {
    formatDateTime,
    formatRelativeShort,
    formatTimestampLabel,
  }
}
