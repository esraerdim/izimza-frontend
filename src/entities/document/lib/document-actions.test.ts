import { describe, expect, it } from 'vitest'
import { canOpenPdfDocument, getDocumentActionKey, getDocumentActionTone } from './document-actions'

describe('document-actions', () => {
  describe('canOpenPdfDocument', () => {
    it('returns true when previewUrl ends with .pdf', () => {
      expect(canOpenPdfDocument({ previewUrl: '/files/contract.pdf' })).toBe(true)
    })

    it('handles .pdf with query string', () => {
      expect(canOpenPdfDocument({ previewUrl: '/files/contract.pdf?token=abc' })).toBe(true)
    })

    it('returns false for non-pdf urls', () => {
      expect(canOpenPdfDocument({ previewUrl: '/files/picture.png' })).toBe(false)
    })

    it('returns false when previewUrl missing', () => {
      expect(canOpenPdfDocument({})).toBe(false)
    })
  })

  describe('getDocumentActionKey', () => {
    it.each([
      ['signed', 'documents.actions.signed'],
      ['timestamped', 'documents.actions.timestamped'],
      ['shared', 'documents.actions.shared'],
      ['anything-else', 'documents.actions.uploaded'],
    ])('maps "%s" to "%s"', (input, expected) => {
      expect(getDocumentActionKey(input)).toBe(expected)
    })
  })

  describe('getDocumentActionTone', () => {
    it('maps signed to "signed"', () => {
      expect(getDocumentActionTone('signed')).toBe('signed')
    })
    it('maps timestamped to "stamp"', () => {
      expect(getDocumentActionTone('timestamped')).toBe('stamp')
    })
    it('falls back to upload for unknown actions', () => {
      expect(getDocumentActionTone('foobar')).toBe('upload')
    })
  })
})
