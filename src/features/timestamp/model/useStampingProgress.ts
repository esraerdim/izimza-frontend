import { ref } from 'vue'

type Options = {
  tickIntervalMs: number
}

export const useStampingProgress = ({ tickIntervalMs }: Options) => {
  const progressPercent = ref(0)
  let timer: number | null = null

  const stop = () => {
    if (timer !== null) {
      window.clearInterval(timer)
      timer = null
    }
  }

  const reset = () => {
    stop()
    progressPercent.value = 0
  }

  const start = () => {
    reset()
    timer = window.setInterval(() => {
      const next = progressPercent.value + Math.max(1, Math.round(Math.random() * 6))
      progressPercent.value = Math.min(93, next)
    }, tickIntervalMs)
  }

  const complete = () => {
    stop()
    progressPercent.value = 100
  }

  return {
    progressPercent,
    start,
    stop,
    reset,
    complete,
  }
}
