import type { App } from 'vue'
import { i18n } from './i18n'
import { useToast } from '@/shared/lib/toast'
import { devError } from '@/shared/lib/logger'

const tr = (key: string) => {
  const result = i18n.global.t(key)
  return result === key ? 'Something went wrong.' : result
}


export const registerGlobalErrorHandler = (app: App) => {
  app.config.errorHandler = (error, _instance, info) => {
    devError(`vue.errorHandler [${info}]`, error)
    try {
      useToast().error(tr('errors.unexpected'))
    } catch {
      
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      devError('window.unhandledrejection', event.reason)
    })
    window.addEventListener('error', (event) => {
      devError('window.error', event.error || event.message)
    })
  }
}
