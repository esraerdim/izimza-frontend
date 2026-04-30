import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDocumentsStore } from '../documents.store'

vi.mock('@/entities/document/api/document.api', () => {
  const sample = (id: number, action: string) => ({
    id,
    name: `doc-${id}.pdf`,
    sizeMb: 1,
    action,
    createdAt: '2026-04-29T10:00:00Z',
    previewUrl: `/files/doc-${id}.pdf`,
  })
  return {
    documentApi: {
      getAll: vi.fn(async () => [sample(1, 'signed'), sample(2, 'timestamped')]),
      getRecent: vi.fn(async () => [sample(2, 'timestamped')]),
      upload: vi.fn(async () => sample(99, 'uploaded')),
      markTimestamped: vi.fn(async (id: number) => sample(id, 'timestamped')),
      remove: vi.fn(async () => undefined),
    },
  }
})

describe('useDocumentsStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('loads documents and caches the result', async () => {
    const store = useDocumentsStore()
    await store.loadAll()
    expect(store.allDocuments).toHaveLength(2)

    const before = store.allDocuments
    await store.loadAll()
    expect(store.allDocuments).toBe(before)
  })

  it('upload patches both lists optimistically', async () => {
    const store = useDocumentsStore()
    await store.loadAll()
    await store.loadRecent()
    const file = new File(['x'], 'x.pdf', { type: 'application/pdf' })
    await store.upload(file)
    expect(store.allDocuments[0].id).toBe(99)
    expect(store.recentDocuments[0].id).toBe(99)
  })

  it('reset clears the cache', async () => {
    const store = useDocumentsStore()
    await store.loadAll()
    expect(store.allDocuments.length).toBeGreaterThan(0)
    store.reset()
    expect(store.allDocuments).toHaveLength(0)
  })
})
