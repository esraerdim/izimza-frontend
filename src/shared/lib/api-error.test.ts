import { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'
import { extractApiErrorMessage } from './api-error'

const buildError = (status: number) => {
  const error = new AxiosError('boom', '', undefined, undefined, {
    status,
    statusText: 'X',
    headers: {},
    config: {} as never,
    data: {},
  })
  error.response = {
    status,
    statusText: 'X',
    headers: {},
    config: {} as never,
    data: {},
  }
  return error
}

describe('extractApiErrorMessage', () => {
  it('maps 401 to unauthorized key', () => {
    expect(extractApiErrorMessage(buildError(401), 'errors.fallback')).toBe('errors.unauthorized')
  })

  it('maps 5xx to generic server error key', () => {
    expect(extractApiErrorMessage(buildError(503), 'errors.fallback')).toBe('errors.server')
  })

  it('falls back to provided key for unknown errors', () => {
    expect(extractApiErrorMessage(new Error('unknown'), 'errors.fallback')).toBe('errors.fallback')
  })
})
