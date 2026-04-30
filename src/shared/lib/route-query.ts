import type { LocationQueryValue } from 'vue-router'

type QueryValue = LocationQueryValue | LocationQueryValue[] | undefined


export const parseRouteQueryId = (value: QueryValue): number | null => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null || raw === '') return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return Math.trunc(parsed)
}
