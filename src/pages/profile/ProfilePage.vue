<script setup lang="ts">
import { computed, ref } from 'vue'

const profileForm = ref({
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  phone: '+90 555 123 45 67',
})

const profileMessage = ref('')
const securityMessage = ref('')
const showPasswordAccordion = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const saveProfile = () => {
  profileMessage.value = 'Profil bilgileri güncellendi.'
}

const onChangePassword = () => {
  showPasswordAccordion.value = !showPasswordAccordion.value
  securityMessage.value = ''
}

const hasMinLength = computed(() => passwordForm.value.newPassword.length >= 8)
const hasUppercase = computed(() => /[A-ZÇĞİÖŞÜ]/.test(passwordForm.value.newPassword))
const hasNumberOrSymbol = computed(() => /[\d\W_]/.test(passwordForm.value.newPassword))

const strengthScore = computed(() => {
  let score = 0
  if (hasMinLength.value) score += 1
  if (hasUppercase.value) score += 1
  if (hasNumberOrSymbol.value) score += 1
  return score
})

const strengthPercent = computed(() => Math.min(100, Math.round((strengthScore.value / 3) * 100)))

const strengthLabel = computed(() => {
  if (!passwordForm.value.newPassword) return ''
  if (strengthScore.value <= 1) return 'Şifre çok zayıf'
  if (strengthScore.value === 2) return 'Şifre orta seviyede'
  return 'Şifre güçlü'
})

const strengthTone = computed(() => {
  if (!passwordForm.value.newPassword) return 'idle'
  if (strengthScore.value <= 1) return 'weak'
  if (strengthScore.value === 2) return 'medium'
  return 'strong'
})

const livePasswordMismatch = computed(() => {
  const { newPassword, confirmPassword } = passwordForm.value
  if (!newPassword || !confirmPassword) return false
  return newPassword !== confirmPassword
})

const cancelPasswordChange = () => {
  showPasswordAccordion.value = false
  securityMessage.value = ''
  passwordForm.value.currentPassword = ''
  passwordForm.value.newPassword = ''
  passwordForm.value.confirmPassword = ''
}

const submitPasswordChange = () => {
  securityMessage.value = ''
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    securityMessage.value = 'Lütfen tüm şifre alanlarını doldurun.'
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    securityMessage.value = 'Yeni şifre en az 8 karakter olmalıdır.'
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    securityMessage.value = 'Yeni şifre alanları eşleşmiyor.'
    return
  }

  securityMessage.value = 'Şifreniz başarıyla güncellendi.'
  passwordForm.value.currentPassword = ''
  passwordForm.value.newPassword = ''
  passwordForm.value.confirmPassword = ''
  showPasswordAccordion.value = false
}
</script>

<template>
  <section class="page profile-page">
    <h1 class="profile-title">Hesap Ayarları</h1>
    <p class="profile-sub">Kişisel bilgilerinizi ve güvenlik tercihlerinizi buradan yönetin.</p>

    <section class="card profile-card">
      <div class="profile-card-head">
        <span class="profile-icon profile-icon-user">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="M20 21a8 8 0 0 0-16 0"></path>
            <circle cx="12" cy="8" r="4"></circle>
          </svg>
        </span>
        <h2 class="profile-card-title">Kişisel Bilgiler</h2>
      </div>

      <div class="profile-grid">
        <label class="field">
          <span>Ad</span>
          <input v-model="profileForm.firstName" type="text" />
        </label>

        <label class="field">
          <span>Soyad</span>
          <input v-model="profileForm.lastName" type="text" />
        </label>

        <label class="field profile-full">
          <span>Telefon</span>
          <input v-model="profileForm.phone" type="tel" />
        </label>
      </div>

      <div class="profile-actions">
        <button type="button" class="btn-primary profile-save-btn" @click="saveProfile">Değişiklikleri Kaydet</button>
      </div>
      <p v-if="profileMessage" class="profile-note">{{ profileMessage }}</p>
    </section>

    <section class="card profile-card">
      <div class="profile-card-head">
        <span class="profile-icon profile-icon-lock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <rect x="4" y="11" width="16" height="10" rx="2"></rect>
            <path d="M8 11V8a4 4 0 1 1 8 0v3"></path>
          </svg>
        </span>
        <h2 class="profile-card-title">Güvenlik</h2>
      </div>

      <div class="profile-security-row">
        <div>
          <p class="profile-security-title">Hesap Şifresi</p>
          <p class="profile-security-sub">Hesabınızın güvenliği için şifrenizi düzenli aralıklarla güncelleyin.</p>
        </div>
        <button type="button" class="profile-outline-btn" @click="onChangePassword">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
            <circle cx="8" cy="14" r="3"></circle>
            <path d="M11 14h9"></path>
            <path d="M17 14v-2"></path>
            <path d="M20 14v-2"></path>
          </svg>
          {{ showPasswordAccordion ? 'Şifre Panelini Kapat' : 'Şifre Değiştir' }}
        </button>
      </div>

      <div v-if="showPasswordAccordion" class="profile-password-accordion">
        <div class="profile-grid profile-single-col">
          <label class="field">
            <span>Mevcut Şifre</span>
            <input v-model="passwordForm.currentPassword" type="password" autocomplete="current-password" />
          </label>
          <label class="field">
            <span>Yeni Şifre</span>
            <input v-model="passwordForm.newPassword" type="password" autocomplete="new-password" />
          </label>
          <div v-if="passwordForm.newPassword" class="profile-password-strength">
            <div class="profile-strength-track">
              <span :class="`tone-${strengthTone}`" :style="{ width: `${strengthPercent}%` }"></span>
            </div>
            <p class="profile-strength-label" :class="`tone-${strengthTone}`">
              {{ strengthLabel }}
            </p>
          </div>
          <label class="field">
            <span>Yeni Şifre (Tekrar)</span>
            <input v-model="passwordForm.confirmPassword" type="password" autocomplete="new-password" />
          </label>
        </div>

        <div class="profile-password-rules">
          <p>Şifre Gereksinimleri</p>
          <ul>
            <li :class="{ done: hasMinLength }">En az 8 karakter</li>
            <li :class="{ done: hasUppercase }">En az bir büyük harf</li>
            <li :class="{ done: hasNumberOrSymbol }">En az bir rakam veya sembol</li>
          </ul>
        </div>
        <p v-if="livePasswordMismatch" class="profile-note">Yeni şifre alanları eşleşmiyor.</p>
        <div class="profile-password-actions">
          <button type="button" class="btn-primary" @click="submitPasswordChange">Şifreyi Güncelle</button>
          <button type="button" class="profile-cancel-btn" @click="cancelPasswordChange">İptal</button>
        </div>
      </div>

      <p v-if="securityMessage" class="profile-note">{{ securityMessage }}</p>
    </section>

    <p class="profile-help">
      Hesabınızla ilgili daha fazla yardıma mı gereksiniminiz var?
      <a href="#">Destek ekibimizle</a> iletişime geçin.
    </p>
  </section>
</template>
