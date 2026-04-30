<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'
import { DropdownMenu, DropdownMenuItem } from '@/shared/ui'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const isOpen = ref(false)

const initials = computed(() => {
  const first = authStore.user?.firstName?.trim()?.[0] ?? ''
  const last = authStore.user?.lastName?.trim()?.[0] ?? ''
  const fullInitials = `${first}${last}`.toUpperCase()
  if (fullInitials) return fullInitials
  const emailInitial = authStore.user?.email?.trim()?.[0]?.toUpperCase()
  return emailInitial || 'U'
})

const open = () => {
  isOpen.value = true
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const goToProfile = () => {
  close()
  router.push({ name: 'profile' })
}

const handleLogout = async () => {
  close()
  await authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="user-menu" @mouseenter="open" @mouseleave="close">
    <DropdownMenu :open="isOpen" align="right" @close="close">
      <template #trigger>
        <button
          class="user-menu__avatar"
          type="button"
          :aria-label="t('shell.userMenu')"
          :aria-expanded="isOpen"
          aria-haspopup="menu"
          @click="toggle"
        >
          {{ initials }}
        </button>
      </template>
      <DropdownMenuItem :label="t('common.profile')" icon="user" @select="goToProfile" />
      <DropdownMenuItem
        :label="t('common.logout')"
        icon="logout"
        tone="danger"
        @select="handleLogout"
      />
    </DropdownMenu>
  </div>
</template>

<style scoped>
.user-menu {
  display: inline-flex;
}

.user-menu__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    var(--color-brand-primary) 0%,
    var(--color-brand-secondary) 100%
  );
  color: var(--color-text-on-brand);
  font-weight: var(--font-weight-semibold);
  border: 0;
  cursor: pointer;
  font: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    filter 0.15s ease,
    box-shadow 0.15s ease;
}

.user-menu__avatar:hover {
  filter: brightness(1.08);
}

.user-menu__avatar:focus-visible {
  outline: none;
  box-shadow: var(--ring-brand);
}
</style>
