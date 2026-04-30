<template>
  <section class="profile-page">
    <PageHeader
      :kicker="t('profilePage.settingsKicker')"
      :title="t('profilePage.settingsTitle')"
      :subtitle="t('profilePage.settingsSub')"
    />

    <nav class="profile-page__tabs" :aria-label="t('profilePage.tabsAria')">
      <button
        v-for="tab in tabIds"
        :key="tab"
        type="button"
        class="profile-page__tab"
        :class="{ 'profile-page__tab--active': activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ t(`profilePage.tabs.${tab}`) }}
      </button>
    </nav>

    <div class="profile-page__layout">
      <aside class="profile-page__side" :aria-label="t('profilePage.sideSummaryAria')">
        <div class="profile-page__side-banner" aria-hidden="true" />
        <div class="profile-page__side-body">
          <div class="profile-page__avatar-block">
            <div class="profile-page__avatar" aria-hidden="true">{{ initials }}</div>
          </div>
          <p class="profile-page__side-name">{{ displayName }}</p>
          <p class="profile-page__side-email">{{ authStore.user?.email }}</p>
          <div class="profile-page__badges">
            <BasePill tone="sage">{{ t('profilePage.badgeVerified') }}</BasePill>
            <BasePill tone="brand">{{ t('profilePage.badgeProBeta') }}</BasePill>
          </div>
          <div class="profile-page__stats" role="list">
            <div role="listitem" class="profile-page__stat">
              {{ t('profilePage.statSigns', { n: dashboardStore.stats.totalSigned }) }}
            </div>
            <div role="listitem" class="profile-page__stat">
              {{ t('profilePage.statStamps', { n: dashboardStore.stats.totalTimestamped }) }}
            </div>
            <div role="listitem" class="profile-page__stat">
              {{ t('profilePage.statCredits', { n: dashboardStore.stats.remainingCredits }) }}
            </div>
          </div>
        </div>
      </aside>

      <div class="profile-page__main">
        <template v-if="activeTab === 'profile'">
          <section class="profile-page__section">
            <header class="profile-page__section-head">
              <h2 class="profile-page__section-title">{{ t('profilePage.personalInfo') }}</h2>
              <div class="profile-page__section-actions">
                <template v-if="!isEditingPersonal">
                  <BaseButton variant="ghost" size="sm" @click="isEditingPersonal = true">
                    <Icon name="pen" :size="14" />
                    {{ t('profilePage.edit') }}
                  </BaseButton>
                </template>
                <template v-else>
                  <BaseButton variant="ghost" size="sm" @click="cancelEditPersonal">
                    {{ t('profilePage.cancelEdit') }}
                  </BaseButton>
                  <BaseButton size="sm" :disabled="isSavingProfile" @click="savePersonal">
                    {{ t('profilePage.saveChanges') }}
                  </BaseButton>
                </template>
              </div>
            </header>

            <div class="profile-page__grid">
              <FormField :label="t('profilePage.firstName')">
                <BaseInput
                  v-model="profileForm.firstName"
                  type="text"
                  :disabled="!isEditingPersonal"
                />
              </FormField>
              <FormField :label="t('profilePage.lastName')">
                <BaseInput
                  v-model="profileForm.lastName"
                  type="text"
                  :disabled="!isEditingPersonal"
                />
              </FormField>
              <FormField class="profile-page__full" :label="t('profilePage.email')">
                <BaseInput :model-value="authStore.user?.email ?? ''" type="email" disabled />
              </FormField>
              <FormField class="profile-page__full" :label="t('profilePage.phone')">
                <BaseInput v-model="profileForm.phone" type="tel" :disabled="!isEditingPersonal" />
              </FormField>
            </div>
            <p v-if="profileMessage" class="profile-page__note">{{ profileMessage }}</p>
          </section>

          <section class="profile-page__section">
            <div class="profile-page__password-row">
              <Icon name="shield" :size="20" class="profile-page__password-icon" />
              <div class="profile-page__password-copy">
                <p class="profile-page__password-title">{{ t('profilePage.passwordRowTitle') }}</p>
                <p class="profile-page__password-sub">
                  {{
                    t('profilePage.passwordLastUpdated', {
                      when: t('profilePage.passwordLastUpdatedSample'),
                    })
                  }}
                </p>
              </div>
              <span :title="isOAuthUser ? oauthPasswordTooltip : ''">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  :disabled="isOAuthUser"
                  @click="onChangePassword"
                >
                  {{
                    showPasswordAccordion
                      ? t('profilePage.closePasswordPanel')
                      : t('profilePage.changeShort')
                  }}
                </BaseButton>
              </span>
            </div>
            <p v-if="isOAuthUser" class="profile-page__note">{{ oauthPasswordTooltip }}</p>

            <div v-if="showPasswordAccordion" class="profile-page__accordion">
              <div class="profile-page__grid profile-page__grid--single">
                <FormField :label="t('profilePage.currentPassword')">
                  <BaseInput
                    v-model="passwordForm.currentPassword"
                    type="password"
                    autocomplete="current-password"
                    :aria-invalid="currentPasswordInvalid"
                  />
                </FormField>
                <FormField :label="t('profilePage.newPassword')">
                  <BaseInput
                    v-model="passwordForm.newPassword"
                    type="password"
                    autocomplete="new-password"
                    :aria-invalid="passwordFieldsInvalid"
                  />
                </FormField>
                <div v-if="passwordForm.newPassword" class="profile-page__strength">
                  <ProgressBar
                    :value="strengthPercent"
                    :tone="strengthBarTone"
                    :label="t('profilePage.passwordStrength')"
                  />
                  <p
                    class="profile-page__strength-label"
                    :class="`profile-page__strength-label--${strengthTone}`"
                  >
                    {{ strengthLabel }}
                  </p>
                </div>
                <FormField :label="t('profilePage.confirmPassword')">
                  <BaseInput
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    :aria-invalid="passwordFieldsInvalid"
                  />
                </FormField>
              </div>

              <div class="profile-page__rules">
                <p>{{ t('profilePage.passwordRequirements') }}</p>
                <ul>
                  <li :class="{ 'profile-page__rule--done': hasMinLength }">
                    {{ t('profilePage.requirementMinLength') }}
                  </li>
                  <li :class="{ 'profile-page__rule--done': hasUppercase }">
                    {{ t('profilePage.requirementUppercase') }}
                  </li>
                  <li :class="{ 'profile-page__rule--done': hasNumberOrSymbol }">
                    {{ t('profilePage.requirementNumberOrSymbol') }}
                  </li>
                </ul>
              </div>
              <p v-if="livePasswordMismatch" class="profile-page__note">
                {{ t('profilePage.mismatch') }}
              </p>
              <div class="profile-page__password-actions">
                <BaseButton
                  class="profile-page__password-submit"
                  :class="{ 'profile-page__password-submit--shake': passwordUpdateButtonShake }"
                  :disabled="isSavingPassword"
                  @click="submitPasswordChange"
                >
                  {{
                    isSavingPassword
                      ? t('profilePage.updatingPassword')
                      : t('profilePage.updatePassword')
                  }}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  :disabled="isSavingPassword"
                  @click="cancelPasswordChange"
                >
                  {{ t('profilePage.cancel') }}
                </BaseButton>
              </div>
            </div>
            <p v-if="securityMessage" class="profile-page__note">{{ securityMessage }}</p>
          </section>

          <section class="profile-page__section profile-page__section--last">
            <h2 class="profile-page__section-title profile-page__section-title--solo">
              {{ t('profilePage.preferences') }}
            </h2>
            <label class="profile-page__pref">
              <div>
                <div class="profile-page__pref-label">{{ t('profilePage.prefEmailNotif') }}</div>
              </div>
              <div class="profile-page__switch">
                <input
                  v-model="prefEmailNotif"
                  type="checkbox"
                  class="profile-page__switch-input"
                />
                <span class="profile-page__switch-ui" aria-hidden="true" />
              </div>
            </label>
            <label class="profile-page__pref">
              <div>
                <div class="profile-page__pref-label">{{ t('profilePage.prefMarketing') }}</div>
              </div>
              <div class="profile-page__switch">
                <input v-model="prefMarketing" type="checkbox" class="profile-page__switch-input" />
                <span class="profile-page__switch-ui" aria-hidden="true" />
              </div>
            </label>
          </section>
        </template>

        <div v-else class="profile-page__placeholder">
          <div class="profile-page__ph-icon">
            <Icon :name="placeholderIcon" :size="28" />
          </div>
          <h2 class="profile-page__ph-title">{{ t(`profilePage.tabs.${activeTab}`) }}</h2>
          <p class="profile-page__ph-text">{{ t('profilePage.tabPlaceholder') }}</p>
        </div>
      </div>
    </div>

    <p class="profile-page__help">
      <i18n-t keypath="profilePage.help" tag="span">
        <template #link>
          <a href="#">{{ t('profilePage.supportLink') }}</a>
        </template>
      </i18n-t>
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  BaseButton,
  BaseInput,
  BasePill,
  FormField,
  Icon,
  PageHeader,
  ProgressBar,
} from '@/shared/ui'
import { useAuthStore } from '@/features/auth'
import { useDashboardStore } from '@/features/dashboard'
import { useProfilePage, useProfileViewState } from '@/features/profile'

const { t } = useI18n()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const { tabIds, activeTab, isEditingPersonal, prefEmailNotif, prefMarketing, placeholderIcon } =
  useProfileViewState()

const initials = computed(() => {
  const first = authStore.user?.firstName?.trim()?.[0] ?? ''
  const last = authStore.user?.lastName?.trim()?.[0] ?? ''
  const pair = `${first}${last}`.toUpperCase()
  if (pair) return pair
  return authStore.user?.email?.trim()?.[0]?.toUpperCase() || 'U'
})

const displayName = computed(() => {
  const u = authStore.user
  if (!u) return ''
  const full = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
  return full || u.email
})

const {
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
} = useProfilePage()

const passwordFieldsInvalid = computed(
  () => highlightPasswordMismatch.value && livePasswordMismatch.value,
)
const currentPasswordInvalid = computed(
  () => securityMessage.value === t('profilePage.currentPasswordInvalid'),
)

const strengthBarTone = computed<'danger' | 'warning' | 'success' | 'neutral'>(() => {
  switch (strengthTone.value) {
    case 'weak':
      return 'danger'
    case 'medium':
      return 'warning'
    case 'strong':
      return 'success'
    default:
      return 'neutral'
  }
})

onMounted(() => {
  void dashboardStore.loadStats()
})

const cancelEditPersonal = () => {
  const u = authStore.user
  if (u) {
    profileForm.value.firstName = u.firstName ?? ''
    profileForm.value.lastName = u.lastName ?? ''
    profileForm.value.phone = u.phone ?? ''
  }
  isEditingPersonal.value = false
  profileMessage.value = ''
}

const savePersonal = async () => {
  const ok = await saveProfile()
  if (ok) isEditingPersonal.value = false
}

watch(isOAuthUser, (v) => {
  if (v) showPasswordAccordion.value = false
})
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: min(1480px, 100%);
}

.profile-page__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px;
  margin-bottom: 8px;
  border: 1px solid var(--color-border-soft);
  border-radius: 999px;
  background: var(--color-surface-empty);
}

.profile-page__tab {
  border: 0;
  background: transparent;
  padding: 9px 14px;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.profile-page__tab:hover {
  color: var(--color-text-primary);
}

.profile-page__tab--active {
  background: var(--color-brand-primary);
  color: var(--color-text-on-brand);
  font-weight: var(--font-weight-semibold);
}

.profile-page__layout {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}

.profile-page__side {
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  background: var(--color-surface-card);
  overflow: hidden;
}

.profile-page__side-banner {
  height: 88px;
  background: linear-gradient(180deg, var(--color-brand-tint) 0%, var(--color-brand-soft) 100%);
}

.profile-page__side-body {
  padding: 0 18px 20px;
  text-align: center;
}

.profile-page__avatar-block {
  position: relative;
  width: 88px;
  margin: -42px auto 0;
}

.profile-page__avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    var(--color-brand-primary) 0%,
    var(--color-brand-secondary) 100%
  );
  color: var(--color-text-on-brand);
  font-size: 26px;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--color-surface-card);
  box-shadow: var(--shadow-sm);
}

.profile-page__avatar-edit {
  position: absolute;
  right: -4px;
  bottom: 2px;
  box-shadow: var(--shadow-sm);
}

.profile-page__side-name {
  margin: 14px 0 4px;
  font-size: 17px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.profile-page__side-email {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
  word-break: break-all;
}

.profile-page__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}

.profile-page__stats {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-soft);
  font-size: 12px;
  color: var(--color-text-secondary);
}

.profile-page__stat {
  flex: 1;
  text-align: center;
  padding: 0 8px;
  border-left: 1px solid var(--color-border-soft);
}

.profile-page__stat:first-child {
  border-left: 0;
}

.profile-page__main {
  min-width: 0;
}

.profile-page__section {
  padding: 22px 0;
  border-bottom: 1px solid var(--color-border-soft);
}

.profile-page__section--last {
  border-bottom: 0;
}

.profile-page__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.profile-page__section-title {
  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.profile-page__section-title--solo {
  margin-bottom: 16px;
}

.profile-page__section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.profile-page__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.profile-page__grid--single {
  grid-template-columns: 1fr;
}

.profile-page__full {
  grid-column: 1 / -1;
}

.profile-page__note {
  margin: 12px 0 0 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.profile-page__password-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
}

.profile-page__password-icon {
  flex-shrink: 0;
  color: var(--color-brand-primary);
}

.profile-page__password-copy {
  flex: 1;
  min-width: 0;
}

.profile-page__password-title {
  margin: 0;
  font-weight: var(--font-weight-semibold);
  font-size: 14px;
  color: var(--color-text-primary);
}

.profile-page__password-sub {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.profile-page__accordion {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-page__strength {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-page__strength-label {
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.profile-page__strength-label--weak {
  color: var(--color-danger);
}
.profile-page__strength-label--medium {
  color: var(--color-amber);
}
.profile-page__strength-label--strong {
  color: var(--color-success);
}

.profile-page__rules {
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-surface-empty);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-soft);
}

.profile-page__rules p {
  margin: 0 0 6px 0;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.profile-page__rules ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-page__rules li::before {
  content: '○ ';
  color: var(--color-text-muted);
}

.profile-page__rule--done {
  color: var(--color-success);
}
.profile-page__rule--done::before {
  content: '● ';
  color: var(--color-success);
}

.profile-page__password-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

@keyframes profile-password-submit-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  18% {
    transform: translateX(-7px);
  }
  36% {
    transform: translateX(7px);
  }
  54% {
    transform: translateX(-4px);
  }
  72% {
    transform: translateX(4px);
  }
}

.profile-page__password-submit.profile-page__password-submit--shake {
  animation: profile-password-submit-shake 0.48s ease;
}

@media (prefers-reduced-motion: reduce) {
  .profile-page__password-submit.profile-page__password-submit--shake {
    animation: none;
  }
}

.profile-page__pref {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-soft);
  cursor: pointer;
}

.profile-page__pref:last-of-type {
  border-bottom: 0;
}

.profile-page__pref-label {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.profile-page__switch {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 26px;
}

.profile-page__switch-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  z-index: 2;
}

.profile-page__switch-ui {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--color-switch-off);
  transition: background 0.2s ease;
}

.profile-page__switch-ui::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;
}

.profile-page__switch-input:checked + .profile-page__switch-ui {
  background: var(--color-brand-primary);
}

.profile-page__switch-input:checked + .profile-page__switch-ui::after {
  transform: translateX(18px);
}

.profile-page__switch-input:focus-visible + .profile-page__switch-ui {
  box-shadow: var(--ring-brand);
}

.profile-page__placeholder {
  padding: 48px 24px;
  text-align: center;
  border: 1px dashed var(--color-border-soft);
  border-radius: var(--radius-lg);
  background: var(--color-surface-empty);
}

.profile-page__ph-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 14px;
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-page__ph-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
}

.profile-page__ph-text {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  max-width: 42ch;
  margin-inline: auto;
  line-height: 1.5;
}

.profile-page__help {
  text-align: center;
  margin-inline: auto;
  margin-top: 28px;
  margin-bottom: 48px;
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.profile-page__help a {
  color: var(--color-brand-primary);
  text-decoration: none;
}

.profile-page__help a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .profile-page__layout {
    grid-template-columns: 1fr;
  }

  .profile-page__side {
    max-width: 400px;
    margin-inline: auto;
  }
}

@media (max-width: 600px) {
  .profile-page__tabs {
    border-radius: var(--radius-md);
  }

  .profile-page__tab {
    flex: 1 1 auto;
    text-align: center;
    min-width: 120px;
  }

  .profile-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
