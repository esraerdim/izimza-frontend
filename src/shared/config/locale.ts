export const SUPPORTED_LOCALES = ['tr', 'en'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_STORAGE_KEY = 'izimza_locale'
