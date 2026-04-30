import { http } from '@/shared/api'
import { UPLOAD_TIMEOUT_MS } from '@/shared/config'
import type { DocumentItem } from '../types/document'

type UploadDocumentPayload = {
  file: File
}

export const documentApi = {
  async getAll(): Promise<DocumentItem[]> {
    const { data } = await http.get<DocumentItem[]>('/api/documents/all')
    return data
  },

  async getRecent(): Promise<DocumentItem[]> {
    const { data } = await http.get<DocumentItem[]>('/api/documents/recent')
    return data
  },

  async upload({ file }: UploadDocumentPayload): Promise<DocumentItem> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post<{ document: DocumentItem }>(
      '/api/documents/upload',
      formData,
      { timeout: UPLOAD_TIMEOUT_MS },
    )
    return data.document
  },

  async markTimestamped(documentId: number): Promise<DocumentItem> {
    const { data } = await http.patch<{ document: DocumentItem }>(
      `/api/documents/${documentId}/timestamp`,
    )
    return data.document
  },

  async remove(documentId: number): Promise<void> {
    await http.delete(`/api/documents/${documentId}`)
  },
}
