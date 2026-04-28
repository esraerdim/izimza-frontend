import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TOKEN_KEY = 'izimza_access_token'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  const setToken = (token: string) => {
    accessToken.value = token
    localStorage.setItem(TOKEN_KEY, token)
  }

  const clearToken = () => {
    accessToken.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return {
    accessToken,
    isAuthenticated,
    setToken,
    clearToken,
  }
})
