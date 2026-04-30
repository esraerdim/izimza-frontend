import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { documentApi } from '../api/document.api'
import { canOpenPdfDocument } from '../lib/document-actions'
import type { DocumentItem } from '../types/document'
import { RECENT_DOCUMENTS_VISIBLE_LIMIT } from '@/shared/config'
import { devError, extractApiErrorMessage } from '@/shared/lib'

type LoadOptions = { force?: boolean }

export type DocumentsScope = 'all' | 'recent'

const ALL_SCOPES: readonly DocumentsScope[] = ['all', 'recent'] as const

export const useDocumentsStore = defineStore('documents', () => {
  const allDocuments = ref<DocumentItem[]>([])
  const recentDocuments = ref<DocumentItem[]>([])
  const isLoadingAll = ref(false)
  const isLoadingRecent = ref(false)
  const allErrorKey = ref('')
  const recentErrorKey = ref('')
  const errorKey = computed(() => allErrorKey.value || recentErrorKey.value)

  let allLoaded = false
  let recentLoaded = false
  let loadAllRequest: Promise<void> | null = null
  let loadRecentRequest: Promise<void> | null = null

  const reset = () => {
    allDocuments.value = []
    recentDocuments.value = []
    allErrorKey.value = ''
    recentErrorKey.value = ''
    allLoaded = false
    recentLoaded = false
    loadAllRequest = null
    loadRecentRequest = null
  }

  const clearError = () => {
    allErrorKey.value = ''
    recentErrorKey.value = ''
  }

  const loadAll = async (options: LoadOptions = {}) => {
    if (allLoaded && !options.force) return
    if (loadAllRequest) return loadAllRequest
    loadAllRequest = (async () => {
      isLoadingAll.value = true
      allErrorKey.value = ''
      try {
        allDocuments.value = await documentApi.getAll()
        allLoaded = true
      } catch (error) {
        devError('documents.loadAll', error)
        allErrorKey.value = extractApiErrorMessage(error, 'errors.documentsLoadFailed')
        allDocuments.value = []
      } finally {
        isLoadingAll.value = false
        loadAllRequest = null
      }
    })()
    return loadAllRequest
  }

  const loadRecent = async (options: LoadOptions = {}) => {
    if (recentLoaded && !options.force) return
    if (loadRecentRequest) return loadRecentRequest
    loadRecentRequest = (async () => {
      isLoadingRecent.value = true
      recentErrorKey.value = ''
      try {
        recentDocuments.value = await documentApi.getRecent()
        recentLoaded = true
      } catch (error) {
        devError('documents.loadRecent', error)
        recentErrorKey.value = extractApiErrorMessage(error, 'errors.documentsLoadFailed')
        recentDocuments.value = []
      } finally {
        isLoadingRecent.value = false
        loadRecentRequest = null
      }
    })()
    return loadRecentRequest
  }

  const invalidate = async (scopes: readonly DocumentsScope[] = ALL_SCOPES) => {
    const tasks: Array<Promise<void>> = []
    for (const scope of scopes) {
      if (scope === 'all') {
        allLoaded = false
        tasks.push(loadAll({ force: true }))
      } else if (scope === 'recent') {
        recentLoaded = false
        tasks.push(loadRecent({ force: true }))
      }
    }
    await Promise.all(tasks)
  }

  const upload = async (file: File): Promise<DocumentItem> => {
    const document = await documentApi.upload({ file })

    allDocuments.value = [document, ...allDocuments.value]
    recentDocuments.value = [document, ...recentDocuments.value]
    return document
  }

  const markTimestamped = async (documentId: number): Promise<DocumentItem> => {
    const document = await documentApi.markTimestamped(documentId)
    const patch = (list: DocumentItem[]) =>
      list.map((item) => (item.id === documentId ? document : item))
    allDocuments.value = patch(allDocuments.value)
    recentDocuments.value = patch(recentDocuments.value)
    return document
  }

  const remove = async (documentId: number): Promise<void> => {
    await documentApi.remove(documentId)
    allDocuments.value = allDocuments.value.filter((item) => item.id !== documentId)
    recentDocuments.value = recentDocuments.value.filter((item) => item.id !== documentId)
  }

  const visibleRecentDocuments = computed(() =>
    recentDocuments.value.filter(canOpenPdfDocument).slice(0, RECENT_DOCUMENTS_VISIBLE_LIMIT),
  )

  return {
    allDocuments,
    recentDocuments,
    visibleRecentDocuments,
    isLoadingAll,
    isLoadingRecent,
    allErrorKey,
    recentErrorKey,
    errorKey,
    clearError,
    loadAll,
    loadRecent,
    invalidate,
    upload,
    markTimestamped,
    remove,
    reset,
  }
})
