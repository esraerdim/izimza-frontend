import { http } from '@/shared/api'

export type ActivityType = 'uploaded' | 'timestamped' | 'signed' | 'shared' | 'deleted'

export type ActivityItem = {
  id: number
  title: string
  createdAt: string
  type?: ActivityType
  fileName?: string
}

export const activityApi = {
  async getAll(): Promise<ActivityItem[]> {
    const { data } = await http.get<ActivityItem[]>('/api/activities/list')
    return data
  },
}
