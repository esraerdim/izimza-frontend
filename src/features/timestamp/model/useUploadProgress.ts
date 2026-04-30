import { onBeforeUnmount, ref } from 'vue'
import { SIMULATED_PROGRESS_TICK_MS, SIMULATED_UPLOAD_DURATION_MS } from '@/shared/config'


export const useUploadProgress = () => {
  const totalMb = ref(0)
  const progressMb = ref(0)
  const progressPercent = ref(0)
  let timer: number | null = null
  let activeFile: File | null = null

  const stop = () => {
    if (timer !== null) {
      window.clearInterval(timer)
      timer = null
    }
  }

  const reset = () => {
    stop()
    activeFile = null
    totalMb.value = 0
    progressMb.value = 0
    progressPercent.value = 0
  }

  const start = (file: File, totalSizeMb: number) =>
    new Promise<'completed' | 'cancelled'>((resolve) => {
      stop()
      activeFile = file
      totalMb.value = totalSizeMb
      progressMb.value = 0
      progressPercent.value = 0

      
      if (SIMULATED_UPLOAD_DURATION_MS <= 0) {
        progressMb.value = totalSizeMb
        progressPercent.value = 100
        resolve('completed')
        return
      }

      const startedAt = Date.now()
      const tick = () => {
        if (activeFile !== file) {
          stop()
          resolve('cancelled')
          return
        }
        const elapsed = Date.now() - startedAt
        const ratio = Math.min(1, elapsed / SIMULATED_UPLOAD_DURATION_MS)
        progressPercent.value = Math.round(ratio * 100)
        progressMb.value = Number((totalSizeMb * ratio).toFixed(2))
        if (ratio >= 1) {
          stop()
          resolve('completed')
        }
      }
      timer = window.setInterval(tick, SIMULATED_PROGRESS_TICK_MS)
      tick()
    })

  const cancel = () => {
    activeFile = null
    stop()
  }

  onBeforeUnmount(reset)

  return { totalMb, progressMb, progressPercent, start, cancel, reset }
}
