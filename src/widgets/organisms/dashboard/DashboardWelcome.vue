<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n, I18nT } from 'vue-i18n'
import { useAuthStore } from '@/features/auth'
import { useDashboardStore } from '@/features/dashboard'
import { BaseButton, Icon } from '@/shared/ui'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const router = useRouter()
const { t } = useI18n()

const firstName = computed(() => authStore.user?.firstName || t('common.user'))
const pendingCount = computed(() => dashboardStore.pendingCount)

onMounted(() => dashboardStore.loadPendingCount())

const openArchive = () => router.push({ name: 'archive' })
const goToSign = () => router.push({ name: 'sign' })
</script>

<template>
  <section class="dashboard-welcome">
    <div class="dashboard-welcome__main">
      <div class="dashboard-welcome__copy">
        <p class="dashboard-welcome__kicker">{{ t('dashboard.welcome.kicker') }}</p>
        <h1 class="dashboard-welcome__title">
          {{ t('dashboard.welcome.title', { name: firstName }) }}
          <span class="dashboard-welcome__wave" aria-hidden="true">👋</span>
        </h1>
      </div>
      <p class="dashboard-welcome__sub">
        <I18nT keypath="dashboard.welcome.pendingMessage" :plural="pendingCount" tag="span">
          <template #count>
            <strong>{{ pendingCount }}</strong>
          </template>
        </I18nT>
      </p>
    </div>

    <div class="dashboard-welcome__actions">
      <BaseButton variant="secondary" @click="openArchive">
        {{ t('dashboard.welcome.openArchive') }}
      </BaseButton>
      <BaseButton @click="goToSign">
        <Icon name="pen" :size="16" :stroke-width="1.8" />
        {{ t('dashboard.welcome.newSign') }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped>
.dashboard-welcome {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px 28px;
  flex-wrap: wrap;
  padding: 20px 0 22px;
  margin: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.dashboard-welcome__main {
  flex: 1 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dashboard-welcome__copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-welcome__kicker {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--color-brand-primary);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.dashboard-welcome__title {
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.dashboard-welcome__wave {
  display: inline-block;
  margin-left: 4px;
}

.dashboard-welcome__sub {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 56ch;
}

.dashboard-welcome__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .dashboard-welcome {
    flex-direction: column;
    align-items: stretch;
    padding: 16px 0 18px;
  }

  .dashboard-welcome__actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
 