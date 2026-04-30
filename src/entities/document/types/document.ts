export type DocumentAction = 'signed' | 'timestamped' | 'shared' | 'uploaded' | string

export type DocumentItem = {
  id: number
  name: string
  sizeMb: number
  action: DocumentAction
  createdAt: string
  previewUrl?: string
}
