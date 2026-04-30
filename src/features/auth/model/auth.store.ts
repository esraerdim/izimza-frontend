import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { AxiosError } from 'axios'
import {
  authApi,
  type AuthUser,
  type ChangePasswordPayload,
  type UpdateProfilePayload,
} from '@/features/auth/api/auth.api'
import { devError, extractApiErrorMessage } from '@/shared/lib'

const FALLBACK_LOGIN_KEY = 'errors.loginFailed'
const FALLBACK_OAUTH_KEY = 'errors.oauthLoginFailed'
const FALLBACK_PROFILE_KEY = 'errors.profileUpdateFailed'
const FALLBACK_PASSWORD_KEY = 'errors.passwordChangeFailed'


export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const errorMessage = ref('')
  let fetchMePromise: Promise<void> | null = null

  const isAuthenticated = computed(() => Boolean(user.value))

  const clearError = () => {
    errorMessage.value = ''
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    clearError()

    try {
      const response = await authApi.login({ email, password })
      user.value = response.user
      isInitialized.value = true
      return true
    } catch (error: unknown) {
      errorMessage.value = extractApiErrorMessage(error, FALLBACK_LOGIN_KEY)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const loginWithOAuthProfile = async (payload: {
    email: string
    firstName?: string
    lastName?: string
  }) => {
    isLoading.value = true
    clearError()
    try {
      const response = await authApi.oauthLogin(payload)
      user.value = response.user
      isInitialized.value = true
      return true
    } catch (error: unknown) {
      errorMessage.value = extractApiErrorMessage(error, FALLBACK_OAUTH_KEY)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const fetchMe = async () => {
    if (fetchMePromise) return fetchMePromise

    fetchMePromise = (async () => {
      try {
        user.value = await authApi.me()
        clearError()
      } catch (error) {
        devError('auth.fetchMe', error)
        user.value = null
      } finally {
        isInitialized.value = true
      }
    })()

    try {
      await fetchMePromise
    } finally {
      fetchMePromise = null
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      devError('auth.logout', error)
    } finally {
      user.value = null
      clearError()
      isInitialized.value = true
    }
  }

  const updateProfile = async (payload: UpdateProfilePayload) => {
    isLoading.value = true
    clearError()
    try {
      const updatedUser = await authApi.updateProfile(payload)
      user.value = updatedUser
      return true
    } catch (error: unknown) {
      errorMessage.value = extractApiErrorMessage(error, FALLBACK_PROFILE_KEY)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (payload: ChangePasswordPayload) => {
    isLoading.value = true
    clearError()
    try {
      await authApi.changePassword(payload)
      return true
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        errorMessage.value = 'errors.passwordEndpointNotFound'
        return false
      }
      errorMessage.value = extractApiErrorMessage(error, FALLBACK_PASSWORD_KEY)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    isInitialized,
    errorMessage,
    isAuthenticated,
    clearError,
    login,
    loginWithOAuthProfile,
    fetchMe,
    logout,
    updateProfile,
    changePassword,
  }
})
