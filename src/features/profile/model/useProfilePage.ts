import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth'
import { PASSWORD_MIN_LENGTH } from '@/shared/config'

export const useProfilePage = () => {
  const authStore = useAuthStore()
  const { t } = useI18n()

  const profileForm = ref({
    firstName: '',
    lastName: '',
    phone: '',
  })

  const profileMessage = ref('')
  const securityMessage = ref('')
  const showPasswordAccordion = ref(false)
  const isSavingProfile = ref(false)
  const isSavingPassword = ref(false)
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const oauthPasswordTooltip = computed(() => t('profilePage.oauthPasswordTooltip'))
  const isOAuthUser = computed(() => Boolean(authStore.user?.isOAuthUser))

  watch(
    () => authStore.user,
    (user) => {
      if (!user) return
      profileForm.value.firstName = user.firstName ?? ''
      profileForm.value.lastName = user.lastName ?? ''
      profileForm.value.phone = user.phone ?? ''
    },
    { immediate: true },
  )

  watch(isOAuthUser, (value) => {
    if (value) {
      showPasswordAccordion.value = false
    }
  })

  const saveProfile = async (): Promise<boolean> => {
    profileMessage.value = ''
    if (!profileForm.value.firstName.trim() || !profileForm.value.lastName.trim()) {
      profileMessage.value = t('profilePage.requiredNameError')
      return false
    }

    isSavingProfile.value = true
    try {
      const success = await authStore.updateProfile({
        firstName: profileForm.value.firstName.trim(),
        lastName: profileForm.value.lastName.trim(),
        phone: profileForm.value.phone.trim(),
      })

      profileMessage.value = success
        ? t('profilePage.saveSuccess')
        : t(authStore.errorMessage || 'profilePage.saveError')
      return success
    } finally {
      isSavingProfile.value = false
    }
  }

  const onChangePassword = () => {
    if (isOAuthUser.value) return
    showPasswordAccordion.value = !showPasswordAccordion.value
    securityMessage.value = ''
  }

  const hasMinLength = computed(() => passwordForm.value.newPassword.length >= PASSWORD_MIN_LENGTH)
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
    if (strengthScore.value <= 1) return t('profilePage.strengthWeak')
    if (strengthScore.value === 2) return t('profilePage.strengthMedium')
    return t('profilePage.strengthStrong')
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

  
  const highlightPasswordMismatch = ref(false)
  
  const passwordUpdateButtonShake = ref(false)

  watch(livePasswordMismatch, (mismatch) => {
    if (!mismatch) highlightPasswordMismatch.value = false
  })

  const shakePasswordSubmitButton = () => {
    passwordUpdateButtonShake.value = true
    globalThis.setTimeout(() => {
      passwordUpdateButtonShake.value = false
    }, 480)
  }

  watch(showPasswordAccordion, (open) => {
    if (!open) {
      highlightPasswordMismatch.value = false
      passwordUpdateButtonShake.value = false
    }
  })

  const cancelPasswordChange = () => {
    showPasswordAccordion.value = false
    securityMessage.value = ''
    highlightPasswordMismatch.value = false
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  }

  const submitPasswordChange = async () => {
    securityMessage.value = ''
    const { currentPassword, newPassword, confirmPassword } = passwordForm.value

    if (!currentPassword || !newPassword || !confirmPassword) {
      securityMessage.value = t('profilePage.fillAllPasswordFields')
      return
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      securityMessage.value = t('profilePage.passwordMinLengthError')
      return
    }

    if (newPassword !== confirmPassword) {
      highlightPasswordMismatch.value = true
      shakePasswordSubmitButton()
      return
    }

    highlightPasswordMismatch.value = false
    isSavingPassword.value = true
    try {
      const success = await authStore.changePassword({ currentPassword, newPassword })
      if (success) {
        securityMessage.value = t('profilePage.passwordUpdateSuccess')
        passwordForm.value.currentPassword = ''
        passwordForm.value.newPassword = ''
        passwordForm.value.confirmPassword = ''
        showPasswordAccordion.value = false
        return
      }
      securityMessage.value = t(authStore.errorMessage || 'errors.passwordChangeFailed')
    } finally {
      isSavingPassword.value = false
    }
  }

  return {
    profileForm,
    profileMessage,
    securityMessage,
    showPasswordAccordion,
    passwordForm,
    oauthPasswordTooltip,
    isOAuthUser,
    isSavingProfile,
    isSavingPassword,
    saveProfile,
    onChangePassword,
    hasMinLength,
    hasUppercase,
    hasNumberOrSymbol,
    strengthPercent,
    strengthLabel,
    strengthTone,
    livePasswordMismatch,
    highlightPasswordMismatch,
    passwordUpdateButtonShake,
    cancelPasswordChange,
    submitPasswordChange,
  }
}
