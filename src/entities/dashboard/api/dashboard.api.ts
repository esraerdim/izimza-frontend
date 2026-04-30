import { http } from '@/shared/api'

export type DashboardStats = {
  totalSigned: number
  totalTimestamped: number
  remainingCredits: number
  archiveUsageMb: number
}

type PendingSignaturesResponse = {
  pendingCount: number
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await http.get<DashboardStats>('/api/dashboard/stats')
    return data
  },

  async getPendingSignatures(): Promise<PendingSignaturesResponse> {
    const { data } = await http.get<PendingSignaturesResponse>('/api/dashboard/pending-signatures')
    return data
  },
}
