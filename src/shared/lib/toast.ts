import { reactive, toRef } from 'vue'
import { TOAST_DEFAULT_DURATION_MS } from '@/shared/config'

export type ToastTone = 'info' | 'success' | 'error'

export type Toast = {
  id: number
  message: string
  tone: ToastTone
}

type Push = {
  message: string
  tone?: ToastTone
  duration?: number
}

const DEFAULT_DURATION_MS = TOAST_DEFAULT_DURATION_MS

const state = reactive({
  toasts: [] as Toast[],
})

let nextId = 1
const timers = new Map<number, number>()

const dismiss = (id: number) => {
  const timer = timers.get(id)
  if (timer !== undefined) {
    window.clearTimeout(timer)
    timers.delete(id)
  }
  state.toasts = state.toasts.filter((toast) => toast.id !== id)
}

const push = ({ message, tone = 'info', duration = DEFAULT_DURATION_MS }: Push) => {
  const id = nextId++
  state.toasts.push({ id, message, tone })
  if (duration > 0) {
    const timer = window.setTimeout(() => dismiss(id), duration)
    timers.set(id, timer)
  }
  return id
}


export const useToast = () => ({
  
  toasts: toRef(state, 'toasts'),
  push,
  success: (message: string, duration?: number) => push({ message, tone: 'success', duration }),
  error: (message: string, duration?: number) => push({ message, tone: 'error', duration }),
  info: (message: string, duration?: number) => push({ message, tone: 'info', duration }),
  dismiss,
})
