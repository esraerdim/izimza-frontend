import { ref } from 'vue'
import { defineStore } from 'pinia'
import { activityApi, type ActivityItem } from '../api/activity.api'
import { devError, extractApiErrorMessage } from '@/shared/lib'

export const useActivitiesStore = defineStore('activities', () => {
  const items = ref<ActivityItem[]>([])
  const isLoading = ref(false)
  const errorKey = ref('')

  let loaded = false
  let loadRequest: Promise<void> | null = null

  const reset = () => {
    items.value = []
    errorKey.value = ''
    loaded = false
    loadRequest = null
  }

  const load = async (options: { force?: boolean } = {}) => {
    if (loaded && !options.force) return
    if (loadRequest) return loadRequest
    loadRequest = (async () => {
      isLoading.value = true
      errorKey.value = ''
      try {
        items.value = await activityApi.getAll()
        loaded = true
      } catch (error) {
        devError('activities.load', error)
        errorKey.value = extractApiErrorMessage(error, 'errors.activitiesLoadFailed')
        items.value = []
      } finally {
        isLoading.value = false
        loadRequest = null
      }
    })()
    return loadRequest
  }

  const invalidate = () => load({ force: true })

  return { items, isLoading, errorKey, load, invalidate, reset }
})
