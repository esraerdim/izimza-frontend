import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { dashboardApi, type DashboardStats } from '../api/dashboard.api'
import { devError, extractApiErrorMessage } from '@/shared/lib'

const DEFAULT_STATS: DashboardStats = {
  totalSigned: 0,
  totalTimestamped: 0,
  remainingCredits: 0,
  archiveUsageMb: 0,
}

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<DashboardStats>({ ...DEFAULT_STATS })
  const pendingCount = ref(0)
  const isLoadingStats = ref(false)
  const isLoadingPending = ref(false)
  const statsErrorKey = ref('')
  const pendingErrorKey = ref('')
  const errorKey = computed(() => statsErrorKey.value || pendingErrorKey.value)

  let statsLoaded = false
  let pendingLoaded = false
  let statsRequest: Promise<void> | null = null
  let pendingRequest: Promise<void> | null = null

  const reset = () => {
    stats.value = { ...DEFAULT_STATS }
    pendingCount.value = 0
    statsErrorKey.value = ''
    pendingErrorKey.value = ''
    statsLoaded = false
    pendingLoaded = false
    statsRequest = null
    pendingRequest = null
  }

  const loadStats = async (options: { force?: boolean } = {}) => {
    if (statsLoaded && !options.force) return
    if (statsRequest) return statsRequest
    statsRequest = (async () => {
      isLoadingStats.value = true
      statsErrorKey.value = ''
      try {
        stats.value = await dashboardApi.getStats()
        statsLoaded = true
      } catch (error) {
        devError('dashboard.loadStats', error)
        statsErrorKey.value = extractApiErrorMessage(error, 'errors.statsLoadFailed')
      } finally {
        isLoadingStats.value = false
        statsRequest = null
      }
    })()
    return statsRequest
  }

  const loadPendingCount = async (options: { force?: boolean } = {}) => {
    if (pendingLoaded && !options.force) return
    if (pendingRequest) return pendingRequest
    pendingRequest = (async () => {
      isLoadingPending.value = true
      pendingErrorKey.value = ''
      try {
        const { pendingCount: count } = await dashboardApi.getPendingSignatures()
        pendingCount.value = count
        pendingLoaded = true
      } catch (error) {
        devError('dashboard.loadPendingCount', error)
        pendingErrorKey.value = extractApiErrorMessage(error, 'errors.statsLoadFailed')
      } finally {
        isLoadingPending.value = false
        pendingRequest = null
      }
    })()
    return pendingRequest
  }

  const invalidate = () =>
    Promise.all([loadStats({ force: true }), loadPendingCount({ force: true })])

  return {
    stats,
    pendingCount,
    isLoadingStats,
    isLoadingPending,
    statsErrorKey,
    pendingErrorKey,
    errorKey,
    loadStats,
    loadPendingCount,
    invalidate,
    reset,
  }
})
