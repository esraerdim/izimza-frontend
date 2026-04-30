import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from './auth.store'
import { clearOAuthPkceData, getOAuthPkceData } from '@/shared/lib'

type TokenResponse = {
  access_token: string
  id_token?: string
}

type UserInfoResponse = {
  email?: string
  given_name?: string
  family_name?: string
  name?: string
}

const parseName = (profile: UserInfoResponse) => {
  if (profile.given_name || profile.family_name) {
    return {
      firstName: profile.given_name ?? '',
      lastName: profile.family_name ?? '',
    }
  }

  const fullName = (profile.name ?? '').trim()
  if (!fullName) return { firstName: '', lastName: '' }
  const [firstName, ...rest] = fullName.split(' ')
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

class OAuthCallbackError extends Error {
  messageKey: string

  constructor(messageKey: string) {
    super(messageKey)
    this.messageKey = messageKey
  }
}

export const useOAuthCallback = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const { t } = useI18n()
  const messageKey = ref('oauth.verifying')
  const errorKey = ref('')

  
  
  const message = computed(() => t(messageKey.value))
  const errorMessage = computed(() => (errorKey.value ? t(errorKey.value) : ''))

  onMounted(async () => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const providerError = params.get('error')

    if (providerError) {
      errorKey.value = 'oauth.providerError'
      return
    }

    const { savedState, verifier } = getOAuthPkceData()
    if (!code || !state || !savedState || !verifier || savedState !== state) {
      errorKey.value = 'oauth.callbackInvalid'
      return
    }

    try {
      const tokenUrl = import.meta.env.VITE_OAUTH_TOKEN_URL ?? ''
      const userInfoUrl = import.meta.env.VITE_OAUTH_USERINFO_URL ?? ''
      const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID ?? ''
      const redirectUri =
        import.meta.env.VITE_OAUTH_REDIRECT_URI ?? `${window.location.origin}/auth/callback`

      if (!tokenUrl || !userInfoUrl || !clientId) {
        throw new OAuthCallbackError('oauth.envMissing')
      }

      messageKey.value = 'oauth.fetchingToken'
      const tokenBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code_verifier: verifier,
        code,
        redirect_uri: redirectUri,
      })

      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenBody.toString(),
      })
      if (!tokenResponse.ok) {
        throw new OAuthCallbackError('oauth.tokenExchangeFailed')
      }
      const tokenData = (await tokenResponse.json()) as TokenResponse

      messageKey.value = 'oauth.fetchingProfile'
      const profileResponse = await fetch(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })
      if (!profileResponse.ok) {
        throw new OAuthCallbackError('oauth.userInfoFailed')
      }
      const profile = (await profileResponse.json()) as UserInfoResponse
      const email = profile.email?.trim().toLowerCase()
      if (!email) {
        throw new OAuthCallbackError('oauth.emailMissing')
      }

      const names = parseName(profile)
      const success = await authStore.loginWithOAuthProfile({
        email,
        firstName: names.firstName || undefined,
        lastName: names.lastName || undefined,
      })

      if (!success) {
        throw new OAuthCallbackError(authStore.errorMessage || 'oauth.loginFailed')
      }

      clearOAuthPkceData()
      await router.replace({ name: 'dashboard' })
    } catch (caught) {
      const fallback = caught instanceof OAuthCallbackError ? caught.messageKey : 'oauth.generic'
      errorKey.value = fallback
    } finally {
      clearOAuthPkceData()
    }
  })

  return {
    message,
    errorMessage,
    messageKey,
    errorKey,
  }
}
