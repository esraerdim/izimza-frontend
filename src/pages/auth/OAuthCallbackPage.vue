<template>
  <section class="oauth-callback-page">
    <p class="eyebrow">{{ t('oauth.kicker') }}</p>
    <h2>{{ t('oauth.title') }}</h2>
    <p class="description">{{ message }}</p>
    <p v-if="errorMessage" class="error-text" role="alert">{{ errorMessage }}</p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOAuthCallback } from '@/features/auth'

const { t } = useI18n()
const { message, errorMessage } = useOAuthCallback()
</script>

<style scoped>
.oauth-callback-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: var(--space-6);
}

.oauth-callback-page .eyebrow {
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-brand-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.oauth-callback-page h2 {
  font-size: 24px;
  margin-bottom: 12px;
}

.oauth-callback-page .description {
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.oauth-callback-page .error-text {
  color: var(--color-error, #dc2626);
  margin-top: 8px;
}
</style>
