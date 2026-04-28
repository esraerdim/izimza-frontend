import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, type AuthUser } from '../api/auth.api'
import { extractApiErrorMessage } from '../../../shared/lib/api-error'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const errorMessage = ref('')
  let fetchMePromise: Promise<void> | null = null

  const isAuthenticated = computed(() => Boolean(user.value))

  const login = async (email: string, password: string) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await authApi.login({ email, password })
      user.value = response.user
      isInitialized.value = true
      return true
    } catch (error: unknown) {
      errorMessage.value = extractApiErrorMessage(error, 'Giris yapilirken bir hata olustu.')
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
        errorMessage.value = ''
      } catch {
        user.value = null
      } finally {
        isInitialized.value = true
      }
    })()

    await fetchMePromise
    fetchMePromise = null
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      errorMessage.value = ''
      isInitialized.value = true
    }
  }

  return {
    user,
    isLoading,
    isInitialized,
    errorMessage,
    isAuthenticated,
    login,
    fetchMe,
    logout,
  }
})
