<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../features/auth'
import { clearOAuthPkceData, getOAuthPkceData } from '../../shared/lib'

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

const router = useRouter()
const authStore = useAuthStore()
const message = ref('OAuth doğrulaması tamamlanıyor...')
const errorMessage = ref('')

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

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')
  const error = params.get('error')

  if (error) {
    errorMessage.value = 'OAuth sağlayıcı girişini iptal etti veya hata döndü.'
    return
  }

  const { savedState, verifier } = getOAuthPkceData()
  if (!code || !state || !savedState || !verifier || savedState !== state) {
    errorMessage.value = 'OAuth callback doğrulaması başarısız.'
    return
  }

  try {
    const tokenUrl = import.meta.env.VITE_OAUTH_TOKEN_URL ?? ''
    const userInfoUrl = import.meta.env.VITE_OAUTH_USERINFO_URL ?? ''
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID ?? ''
    const redirectUri =
      import.meta.env.VITE_OAUTH_REDIRECT_URI ?? `${window.location.origin}/auth/callback`

    if (!tokenUrl || !userInfoUrl || !clientId) {
      throw new Error('OAuth environment değişkenleri eksik.')
    }

    message.value = 'Token alınıyor...'
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
      throw new Error('Token exchange başarısız.')
    }
    const tokenData = (await tokenResponse.json()) as TokenResponse

    message.value = 'Profil bilgileri alınıyor...'
    const profileResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
    if (!profileResponse.ok) {
      throw new Error('UserInfo endpoint başarısız.')
    }
    const profile = (await profileResponse.json()) as UserInfoResponse
    const email = profile.email?.trim().toLowerCase()
    if (!email) {
      throw new Error('OAuth profili email dönmedi.')
    }

    const names = parseName(profile)
    const success = await authStore.loginWithOAuthProfile({
      email,
      firstName: names.firstName || undefined,
      lastName: names.lastName || undefined,
    })

    if (!success) {
      throw new Error(authStore.errorMessage || 'OAuth login başarısız.')
    }

    clearOAuthPkceData()
    await router.replace({ name: 'dashboard' })
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'OAuth doğrulama sırasında bir hata oluştu.'
  } finally {
    clearOAuthPkceData()
  }
})
</script>

<template>
  <section class="page login-page">
    <p class="eyebrow">OAuth2</p>
    <h2>Giriş Doğrulanıyor</h2>
    <p class="description">{{ message }}</p>
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  </section>
</template>
