import { describe, expect, it } from 'vitest'
import {
  countDocumentsByAction,
  filterDocuments,
  sortByCreatedAtDesc,
  sumDocumentSizeMb,
} from './document-filters'

const SAMPLE_DOCS = [
  { name: 'invoice.pdf', action: 'signed', sizeMb: 1.2, createdAt: '2026-01-01T10:00:00Z' },
  { name: 'photo.png', action: 'shared', sizeMb: 4, createdAt: '2026-02-01T10:00:00Z' },
  { name: 'contract.pdf', action: 'signed', sizeMb: 0.8, createdAt: '2026-01-15T10:00:00Z' },
  { name: 'old.pdf', action: 'timestamped', sizeMb: 2, createdAt: '2025-12-01T10:00:00Z' },
]

describe('document-filters', () => {
  it('sortByCreatedAtDesc orders newest first', () => {
    const sorted = sortByCreatedAtDesc(SAMPLE_DOCS)
    expect(sorted[0].name).toBe('photo.png')
    expect(sorted.at(-1)?.name).toBe('old.pdf')
  })

  it('filterDocuments narrows by action', () => {
    const filtered = filterDocuments(SAMPLE_DOCS, { action: 'signed' })
    expect(filtered).toHaveLength(2)
  })

  it('filterDocuments narrows by query (case-insensitive)', () => {
    const filtered = filterDocuments(SAMPLE_DOCS, { query: 'CONTRACT' })
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('contract.pdf')
  })

  it('countDocumentsByAction returns counts per action', () => {
    const counts = countDocumentsByAction(SAMPLE_DOCS, ['signed', 'shared', 'timestamped'])
    expect(counts).toEqual({ signed: 2, shared: 1, timestamped: 1 })
  })

  it('sumDocumentSizeMb sums numeric size fields', () => {
    expect(sumDocumentSizeMb(SAMPLE_DOCS)).toBeCloseTo(8)
  })
})
