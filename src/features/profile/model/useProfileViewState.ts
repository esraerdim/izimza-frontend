import { computed, onMounted, ref, watch } from 'vue'
import type { IconName } from '@/shared/ui'

const PREF_EMAIL_KEY = 'izimza_pref_email_notifications'
const PREF_MARKETING_KEY = 'izimza_pref_marketing_emails'

export type ProfileTabId =
  | 'app'
  | 'profile'
  | 'signature'
  | 'billing'
  | 'recipients'
  | 'eypRecipients'
  | 'eypDefs'

const tabIds: ProfileTabId[] = [
  'app',
  'profile',
  'signature',
  'billing',
  'recipients',
  'eypRecipients',
  'eypDefs',
]

const tabIcons: Record<ProfileTabId, IconName> = {
  app: 'globe',
  profile: 'user',
  signature: 'pen',
  billing: 'credit',
  recipients: 'mail',
  eypRecipients: 'user',
  eypDefs: 'box',
}

const readStoredBool = (key: string, fallback: boolean) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return raw === '1' || raw === 'true'
  } catch {
    return fallback
  }
}

const persistBool = (key: string, value: boolean) => {
  try {
    localStorage.setItem(key, value ? '1' : '0')
  } catch {
  }
}

export const useProfileViewState = () => {
  const activeTab = ref<ProfileTabId>('profile')
  const isEditingPersonal = ref(false)
  const prefEmailNotif = ref(true)
  const prefMarketing = ref(false)

  const placeholderIcon = computed(() => tabIcons[activeTab.value])

  onMounted(() => {
    prefEmailNotif.value = readStoredBool(PREF_EMAIL_KEY, true)
    prefMarketing.value = readStoredBool(PREF_MARKETING_KEY, false)
  })

  watch(prefEmailNotif, (value) => persistBool(PREF_EMAIL_KEY, value))
  watch(prefMarketing, (value) => persistBool(PREF_MARKETING_KEY, value))

  return {
    tabIds,
    activeTab,
    isEditingPersonal,
    prefEmailNotif,
    prefMarketing,
    placeholderIcon,
  }
}
