import { AxiosError } from 'axios'
import type { ApiErrorPayload } from '../types/api'

export const extractApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorPayload | undefined)?.message ?? fallbackMessage
  }
  return fallbackMessage
}
