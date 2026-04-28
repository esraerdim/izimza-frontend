import { http } from '../../../shared/api'

type PendingSignaturesResponse = {
  pendingCount: number
}

export type DashboardStats = {
  totalSigned: number
  totalTimestamped: number
  remainingCredits: number
  archiveUsageMb: number
}

export type DashboardDocument = {
  id: number
  name: string
  sizeMb: number
  action: string
  createdAt: string
  previewUrl?: string
}

export type DashboardActivity = {
  id: number
  title: string
  createdAt: string
}

type UploadDocumentPayload = {
  file: File
}

type TimestampUploadPayload = {
  file: File
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

  async getRecentDocuments(): Promise<DashboardDocument[]> {
    const { data } = await http.get<DashboardDocument[]>('/api/documents/recent')
    return data
  },

  async getAllDocuments(): Promise<DashboardDocument[]> {
    const { data } = await http.get<DashboardDocument[]>('/documents')
    return data
  },

  async getActivities(): Promise<DashboardActivity[]> {
    const { data } = await http.get<DashboardActivity[]>('/api/activities/list')
    return data
  },

  async uploadDocument(payload: UploadDocumentPayload): Promise<DashboardDocument> {
    const formData = new FormData()
    formData.append('file', payload.file)
    const { data } = await http.post<{ document: DashboardDocument }>('/api/documents/upload', formData)
    return data.document
  },

  async deleteDocument(documentId: number): Promise<void> {
    await http.delete(`/api/documents/${documentId}`)
  },

  async uploadTimestamp(payload: TimestampUploadPayload): Promise<DashboardDocument> {
    const formData = new FormData()
    formData.append('file', payload.file)
    const { data } = await http.post<{ document: DashboardDocument }>('/api/timestamp/upload', formData)
    return data.document
  },

  async markDocumentTimestamped(documentId: number): Promise<DashboardDocument> {
    const { data } = await http.patch<{ document: DashboardDocument }>(`/api/documents/${documentId}/timestamp`)
    return data.document
  },
}
