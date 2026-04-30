import { describe, expect, it } from 'vitest'
import { parseRouteQueryId } from '../route-query'

describe('parseRouteQueryId', () => {
  it('returns the id for a valid string', () => {
    expect(parseRouteQueryId('42')).toBe(42)
  })

  it('returns null for missing values', () => {
    expect(parseRouteQueryId(undefined)).toBeNull()
    expect(parseRouteQueryId(null)).toBeNull()
    expect(parseRouteQueryId('')).toBeNull()
  })

  it('returns null for non-numeric values', () => {
    expect(parseRouteQueryId('foo')).toBeNull()
    expect(parseRouteQueryId('NaN')).toBeNull()
  })

  it('returns null for non-positive values', () => {
    expect(parseRouteQueryId('0')).toBeNull()
    expect(parseRouteQueryId('-3')).toBeNull()
  })

  it('uses the first array entry', () => {
    expect(parseRouteQueryId(['7', '99'])).toBe(7)
  })
})
