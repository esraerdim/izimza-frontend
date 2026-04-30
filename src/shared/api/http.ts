import axios, { AxiosError } from 'axios'
import { HTTP_DEFAULT_TIMEOUT_MS } from '@/shared/config'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  timeout: HTTP_DEFAULT_TIMEOUT_MS,
  withCredentials: true,
})

type UnauthorizedHandler = () => void | Promise<void>

let unauthorizedHandler: UnauthorizedHandler = () => {}

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler
}

const AUTH_PATHS_PATTERN = /\/api\/auth\/(login|me|oauth-login|logout)/

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''

    if (status === 401 && !AUTH_PATHS_PATTERN.test(requestUrl)) {
      void unauthorizedHandler()
    }

    return Promise.reject(error)
  },
)
