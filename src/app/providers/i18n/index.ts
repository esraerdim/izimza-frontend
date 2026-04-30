import { createI18n } from 'vue-i18n'
import { tr } from './locales/tr'
import { en } from './locales/en'
import { LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, type AppLocale } from '@/shared/config'

export { SUPPORTED_LOCALES, type AppLocale } from '@/shared/config'

const messages = { tr, en }

const resolveInitialLocale = (): AppLocale => {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && SUPPORTED_LOCALES.includes(stored as AppLocale)) {
    return stored as AppLocale
  }
  return 'tr'
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: 'tr',
  messages,
})

export const setLocale = (locale: AppLocale) => {
  i18n.global.locale.value = locale
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
