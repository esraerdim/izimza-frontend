<template>
  <section class="login-page">
    <div class="login-page__shell">
      <aside class="login-page__showcase">
        <img class="login-page__brand-logo" src="/icons.svg" alt="iZimza" />
        <h1>{{ t('auth.showcaseTitle') }}</h1>
        <p>{{ t('auth.showcaseDescription') }}</p>
      </aside>

      <div class="login-page__card">
        <h2 class="login-page__title">{{ t('auth.loginTitle') }}</h2>
        <p class="login-page__description">{{ t('auth.loginDescription') }}</p>

        <form class="login-page__form" @submit.prevent="submitLogin">
          <FormField :label="t('auth.emailLabel')">
            <BaseInput
              v-model="form.email"
              type="email"
              :placeholder="t('auth.emailPlaceholder')"
              autocomplete="email"
              autofocus
              required
            />
          </FormField>

          <FormField :label="t('auth.password')">
            <BaseInput
              v-model="form.password"
              type="password"
              :placeholder="t('auth.passwordPlaceholder')"
              autocomplete="current-password"
              required
            />
          </FormField>

          <BaseButton type="submit" :disabled="authStore.isLoading" full-width>
            {{ authStore.isLoading ? t('auth.loggingIn') : t('auth.loginButton') }}
          </BaseButton>
        </form>

        <div v-if="googleSignIn.isAvailable" class="login-page__divider">
          <span>{{ t('auth.divider') }}</span>
        </div>

        <GoogleSignInButton
          v-if="googleSignIn.isAvailable"
          :label="t('auth.signInWithGoogle')"
          :disabled="authStore.isLoading"
          @click="onGoogleClick"
        />

        <p class="login-page__note">{{ t('auth.secureNote') }}</p>
        <p v-if="errorMessage" class="login-page__error" role="alert">{{ errorMessage }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useGoogleSignIn } from '@/features/auth'
import { BaseButton, BaseInput, FormField, GoogleSignInButton } from '@/shared/ui'

const router = useRouter()
const authStore = useAuthStore()
const googleSignIn = useGoogleSignIn()
const { t } = useI18n()

const form = reactive({
  email: import.meta.env.DEV ? (import.meta.env.VITE_DEMO_EMAIL ?? '') : '',
  password: import.meta.env.DEV ? (import.meta.env.VITE_DEMO_PASSWORD ?? '') : '',
})

const errorMessage = computed(() => {
  if (googleSignIn.errorKey.value) return t(googleSignIn.errorKey.value)
  if (authStore.errorMessage) return t(authStore.errorMessage)
  return ''
})

const clearAllErrors = () => {
  authStore.clearError()
  googleSignIn.clearError()
}

const submitLogin = async () => {
  clearAllErrors()
  const success = await authStore.login(form.email, form.password)
  if (success) {
    await router.push({ name: 'dashboard' })
  }
}

const onGoogleClick = async () => {
  clearAllErrors()
  await googleSignIn.signIn()
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(
      900px 520px at 18% 88%,
      color-mix(in srgb, var(--color-brand-primary) 38%, transparent),
      transparent 72%
    ),
    radial-gradient(
      760px 420px at 84% 14%,
      color-mix(in srgb, var(--color-brand-secondary) 30%, transparent),
      transparent 70%
    ),
    linear-gradient(
      140deg,
      color-mix(in srgb, var(--color-brand-primary) 22%, var(--color-brand-ink)) 0%,
      color-mix(in srgb, var(--color-brand-secondary) 26%, var(--color-brand-ink)) 42%,
      var(--color-brand-ink) 100%
    );
}

.login-page__shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: min(960px, 100%);
  background: var(--color-surface-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
}

.login-page__showcase {
  background:
    radial-gradient(
      480px 260px at 12% 88%,
      color-mix(in srgb, var(--color-brand-secondary) 34%, transparent),
      transparent 72%
    ),
    radial-gradient(
      420px 220px at 88% 12%,
      color-mix(in srgb, var(--color-brand-primary) 26%, transparent),
      transparent 70%
    ),
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--color-brand-primary) 40%, #0b1238) 0%,
      color-mix(in srgb, var(--color-brand-secondary) 48%, #101a46) 44%,
      color-mix(in srgb, var(--color-brand-primary) 30%, #101a46) 100%
    );
  color: var(--color-text-on-brand);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.login-page__brand-logo {
  width: 140px;
  filter: brightness(0) invert(1);
  margin-bottom: 12px;
}

.login-page__showcase h1 {
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
  margin: 0;
  line-height: 1.3;
}

.login-page__showcase p {
  margin: 0;
  font-size: 14px;
  opacity: 0.92;
  line-height: 1.55;
}

.login-page__card {
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-page__title {
  font-size: 22px;
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--color-text-primary);
}

.login-page__description {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-page__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-page__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 4px 0;
}

.login-page__divider::before,
.login-page__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border-soft);
}

.login-page__note {
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}

.login-page__error {
  font-size: 13px;
  color: var(--color-danger);
  margin: 0;
  text-align: center;
}

@media (max-width: 720px) {
  .login-page__shell {
    grid-template-columns: 1fr;
  }
  .login-page__showcase {
    padding: 32px 24px;
  }
  .login-page__card {
    padding: 32px 24px;
  }
}
</style>
