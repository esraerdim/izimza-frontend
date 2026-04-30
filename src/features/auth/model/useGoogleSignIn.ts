import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from './auth.store'

const GOOGLE_GSI_SCRIPT_ID = 'google-identity-service-script'
const GOOGLE_GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client'
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

type GoogleUserInfo = {
  email?: string
  given_name?: string
  family_name?: string
  name?: string
}

type GoogleTokenResponse = {
  access_token?: string
  error?: string
}

type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void
}

type GoogleOAuth2InitOptions = {
  client_id: string
  scope: string
  prompt?: string
  callback: (response: GoogleTokenResponse) => void
}

type GoogleAccountsApi = {
  accounts?: {
    oauth2?: {
      initTokenClient: (options: GoogleOAuth2InitOptions) => GoogleTokenClient
    }
  }
}

declare global {
  interface Window {
    google?: GoogleAccountsApi
  }
}

class GoogleSignInError extends Error {
  errorKey: string

  constructor(errorKey: string) {
    super(errorKey)
    this.errorKey = errorKey
  }
}

const loadGoogleIdentityScript = () =>
  new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_GSI_SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      if (window.google) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new GoogleSignInError('auth.errors.googleScriptLoadFailed')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_GSI_SCRIPT_ID
    script.src = GOOGLE_GSI_SCRIPT_URL
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new GoogleSignInError('auth.errors.googleScriptLoadFailed'))
    document.head.appendChild(script)
  })

const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) {
    throw new GoogleSignInError('auth.errors.googleProfileFailed')
  }
  return (await response.json()) as GoogleUserInfo
}


export const useGoogleSignIn = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useI18n()

  const clientId = import.meta.env.VITE_GOOGLE_GSI_CLIENT_ID ?? ''
  const isAvailable = Boolean(clientId)
  const isReady = ref(false)
  const errorKey = ref('')

  let tokenClient: GoogleTokenClient | null = null

  const setError = (key: string) => {
    errorKey.value = key
  }

  const clearError = () => {
    errorKey.value = ''
  }

  const signIn = async () => {
    clearError()
    if (!isAvailable) {
      setError('auth.errors.missingGoogleClientId')
      return
    }

    if (!isReady.value || !tokenClient) {
      setError('auth.errors.googleSdkNotReady')
      return
    }

    await authStore.logout()
    tokenClient.requestAccessToken({ prompt: 'select_account' })
  }

  const handleTokenResponse = async (tokenResponse: GoogleTokenResponse) => {
    if (tokenResponse.error || !tokenResponse.access_token) {
      setError('auth.errors.googleAccessDenied')
      return
    }
    try {
      const profile = await fetchGoogleUserInfo(tokenResponse.access_token)
      const email = profile.email?.trim().toLowerCase()
      if (!email) {
        setError('auth.errors.googleEmailMissing')
        return
      }

      const fallbackLast = t('auth.defaultLastName')
      const success = await authStore.loginWithOAuthProfile({
        email,
        firstName: profile.given_name ?? profile.name?.split(' ')[0] ?? 'Google',
        lastName:
          profile.family_name ?? profile.name?.split(' ').slice(1).join(' ') ?? fallbackLast,
      })

      if (success) {
        await router.push({ name: 'dashboard' })
      }
    } catch (caught) {
      const key =
        caught instanceof GoogleSignInError ? caught.errorKey : 'auth.errors.googleProfileFailed'
      setError(key)
    }
  }

  onMounted(async () => {
    if (!isAvailable) return
    try {
      await loadGoogleIdentityScript()
      const oauth2 = window.google?.accounts?.oauth2
      if (!oauth2) {
        throw new GoogleSignInError('auth.errors.googleSdkInitFailed')
      }

      tokenClient = oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid profile email',
        prompt: 'select_account',
        callback: handleTokenResponse,
      })

      isReady.value = true
    } catch (caught) {
      const key =
        caught instanceof GoogleSignInError
          ? caught.errorKey
          : 'auth.errors.googleIntegrationFailed'
      setError(key)
    }
  })

  return {
    isAvailable,
    isReady,
    errorKey,
    signIn,
    clearError,
  }
}
