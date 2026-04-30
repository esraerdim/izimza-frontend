import { http } from '@/shared/api'

const FALLBACK_BASE_URL = 'http://localhost:3001'

const resolveApiBaseUrl = () => {
  const configuredBase = http.defaults.baseURL
  if (typeof configuredBase === 'string' && configuredBase.length > 0) return configuredBase
  return FALLBACK_BASE_URL
}

export const toAbsolutePreviewUrl = (rawUrl?: string) => {
  if (!rawUrl) return ''
  if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('blob:')) return rawUrl
  const apiBaseUrl = resolveApiBaseUrl()
  if (rawUrl.startsWith('/')) return `${apiBaseUrl}${rawUrl}`
  return `${apiBaseUrl}/${rawUrl}`
}

export const downloadFromUrl = (url: string, filename: string) => {
  const link = window.document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.click()
}
