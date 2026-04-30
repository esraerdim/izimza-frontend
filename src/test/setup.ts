import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'tr',
  fallbackLocale: 'tr',
  messages: { tr: {}, en: {} },
})

config.global.plugins = [i18n]
