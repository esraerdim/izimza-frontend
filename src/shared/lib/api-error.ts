import { AxiosError } from 'axios'


export const extractApiErrorMessage = (error: unknown, fallbackKey: string): string => {
  if (error instanceof AxiosError) {
    const backendMessage = error.response?.data?.message
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage
    }

    const status = error.response?.status
    if (status === 401) return 'errors.unauthorized'
    if (status === 413) return 'errors.fileTooLarge'
    if (status === 408) return 'errors.timeout'
    if (typeof status === 'number' && status >= 500) return 'errors.server'
  }
  return fallbackKey
}
