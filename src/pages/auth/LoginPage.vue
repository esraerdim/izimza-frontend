<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../features/auth'
import { isOAuthConfigured, startOAuthLogin } from '../../shared/lib'
import { BaseButton, BaseInput, FormField } from '../../shared/ui'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: 'demo@izimza.com',
  password: 'Demo123!',
})

const submitLogin = async () => {
  const success = await authStore.login(form.email, form.password)
  if (success) {
    await router.push({ name: 'dashboard' })
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_GSI_CLIENT_ID ?? ''
const oauthEnabled = isOAuthConfigured()
const showGoogleButton = oauthEnabled || Boolean(googleClientId)

const submitOAuthLogin = async () => {
  authStore.errorMessage = ''
  if (!oauthEnabled) {
    authStore.errorMessage =
      'Google butonu aktif, ancak OAuth ayarı eksik: VITE_OAUTH_CLIENT_ID ve VITE_OAUTH_AUTHORIZE_URL gerekli.'
    return
  }
  try {
    // Prevent carrying previous demo session into OAuth flow.
    await authStore.logout()
    await startOAuthLogin()
  } catch (error) {
    authStore.errorMessage = error instanceof Error ? error.message : 'OAuth girisi başlatılamadı.'
  }
}
</script>

<template>
  <section class="page login-page">
    <p class="eyebrow">Izimza Case</p>
    <h2>Giris Yap</h2>
    <p class="description">Demo account ile giris yapip tum fake API akislarini test edebilirsin.</p>

    <form class="login-form" @submit.prevent="submitLogin">
      <FormField label="Email">
        <BaseInput v-model="form.email" type="email" placeholder="demo@izimza.com" required />
      </FormField>

      <FormField label="Sifre">
        <BaseInput v-model="form.password" type="password" placeholder="Demo123!" required />
      </FormField>

      <BaseButton type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Giris yapiliyor...' : 'Giris Yap' }}
      </BaseButton>

      <button v-if="showGoogleButton" type="button" class="gsi-material-button" :disabled="authStore.isLoading" @click="submitOAuthLogin">
        <div class="gsi-material-button-state"></div>
        <div class="gsi-material-button-content-wrapper">
          <div class="gsi-material-button-icon">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span class="gsi-material-button-contents">Sign in with Google</span>
          <span style="display: none">Google ile Giriş Yap</span>
        </div>
      </button>
    </form>

    <p v-if="authStore.errorMessage" class="error-text">{{ authStore.errorMessage }}</p>
  </section>
</template>
