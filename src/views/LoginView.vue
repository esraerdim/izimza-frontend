<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: 'demo@izimza.com',
  password: 'Demo123!',
})

const submitLogin = async () => {
  const success = await authStore.login(form.email, form.password)
  if (success) {
    router.push({ name: 'dashboard' })
  }
}
</script>

<template>
  <section class="page login-page">
    <p class="eyebrow">Izimza Case</p>
    <h2>Giris Yap</h2>
    <p class="description">Demo account ile giris yapip tum fake API akislarini test edebilirsin.</p>

    <form class="login-form" @submit.prevent="submitLogin">
      <label class="field">
        <span>Email</span>
        <input v-model="form.email" type="email" placeholder="demo@izimza.com" required />
      </label>

      <label class="field">
        <span>Sifre</span>
        <input v-model="form.password" type="password" placeholder="Demo123!" required />
      </label>

      <button class="btn-primary" type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Giris yapiliyor...' : 'Giris Yap' }}
      </button>
    </form>

    <p v-if="authStore.errorMessage" class="error-text">{{ authStore.errorMessage }}</p>
  </section>
</template>
