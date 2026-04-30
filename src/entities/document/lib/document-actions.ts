type PreviewableDocument = { previewUrl?: string }

export const canOpenPdfDocument = (document: PreviewableDocument) =>
  Boolean(document.previewUrl) && /\.pdf($|[?#])/i.test(document.previewUrl ?? '')

export const getDocumentActionKey = (action: string) => {
  if (action === 'timestamped') return 'documents.actions.timestamped'
  if (action === 'signed') return 'documents.actions.signed'
  if (action === 'shared') return 'documents.actions.shared'
  return 'documents.actions.uploaded'
}

export type DocumentActionTone = 'stamp' | 'signed' | 'shared' | 'upload'

export const getDocumentActionTone = (action: string): DocumentActionTone => {
  if (action === 'timestamped') return 'stamp'
  if (action === 'signed') return 'signed'
  if (action === 'shared') return 'shared'
  return 'upload'
}
