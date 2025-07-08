import { describe, it, expect, vi } from 'vitest'
import { useNetworkStatus } from '@/lib/networkUtils'
import { shouldShowOfflineFallback } from '@/lib/networkUtils'

describe('useNetworkStatus', () => {
  const originalNavigator = global.navigator

  afterEach(() => {
    // Restore original navigator after each test
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    })
  })

  it('should return true when navigator.onLine is true', () => {
    Object.defineProperty(global, 'navigator', {
      value: { onLine: true },
      configurable: true,
      writable: true,
    })
    expect(useNetworkStatus()).toBe(true)
  })

  it('should return false when navigator.onLine is false', () => {
    Object.defineProperty(global, 'navigator', {
      value: { onLine: false },
      configurable: true,
      writable: true,
    })
    expect(useNetworkStatus()).toBe(false)
  })

  describe('shouldShowOfflineFallback', () => {
    it('returns false if hasData is true, regardless of error', () => {
      expect(shouldShowOfflineFallback('network error', true)).toBe(false)
      expect(shouldShowOfflineFallback(null, true)).toBe(false)
      expect(shouldShowOfflineFallback(undefined, true)).toBe(false)
      expect(shouldShowOfflineFallback(new Error('failed to fetch'), true)).toBe(false)
    })

    it('returns true for network-related errors when hasData is false', () => {
      expect(shouldShowOfflineFallback('network error', false)).toBe(true)
      expect(shouldShowOfflineFallback(new Error('Failed to fetch'), false)).toBe(true)
      expect(shouldShowOfflineFallback('net::ERR_CONNECTION_REFUSED', false)).toBe(true)
      expect(shouldShowOfflineFallback('No internet connection', false)).toBe(true)
      expect(shouldShowOfflineFallback('offline', false)).toBe(true)
    })

    it('returns false for non-network errors when hasData is false', () => {
      expect(shouldShowOfflineFallback('some other error', false)).toBe(false)
      expect(shouldShowOfflineFallback(new Error('unexpected error'), false)).toBe(false)
      expect(shouldShowOfflineFallback(null, false)).toBe(false)
      expect(shouldShowOfflineFallback(undefined, false)).toBe(false)
      expect(shouldShowOfflineFallback(123, false)).toBe(false)
    })

    describe('isNetworkError', async () => {
      const { isNetworkError } = await import('@/lib/networkUtils')

      it('returns true for known network error strings', () => {
      expect(isNetworkError('failed to fetch')).toBe(true)
      expect(isNetworkError('Network error')).toBe(true)
      expect(isNetworkError('network request failed')).toBe(true)
      expect(isNetworkError('net::ERR_CONNECTION_REFUSED')).toBe(true)
      expect(isNetworkError('connection refused')).toBe(true)
      expect(isNetworkError('connection timeout')).toBe(true)
      expect(isNetworkError('No internet connection')).toBe(true)
      expect(isNetworkError('offline')).toBe(true)
      expect(isNetworkError('unreachable')).toBe(true)
      })

      it('returns true for Error objects with network error messages', () => {
      expect(isNetworkError(new Error('Failed to fetch'))).toBe(true)
      expect(isNetworkError(new Error('Network error'))).toBe(true)
      expect(isNetworkError(new Error('net::ERR_CONNECTION_REFUSED'))).toBe(true)
      expect(isNetworkError(new Error('No internet connection'))).toBe(true)
      expect(isNetworkError(new Error('offline'))).toBe(true)
      })

      it('returns false for non-network errors', () => {
      expect(isNetworkError('some other error')).toBe(false)
      expect(isNetworkError(new Error('unexpected error'))).toBe(false)
      expect(isNetworkError('random string')).toBe(false)
      expect(isNetworkError(new Error('something went wrong'))).toBe(false)
      })

      it('returns false for falsy values', () => {
      expect(isNetworkError(null)).toBe(false)
      expect(isNetworkError(undefined)).toBe(false)
      expect(isNetworkError('')).toBe(false)
      expect(isNetworkError(0)).toBe(false)
      expect(isNetworkError(false)).toBe(false)
      })

      it('handles non-string, non-Error values gracefully', () => {
      expect(isNetworkError(123)).toBe(false)
      expect(isNetworkError({})).toBe(false)
      expect(isNetworkError([])).toBe(false)
      })

      describe('useNetworkStatus', () => {
        const originalNavigator = global.navigator

        afterEach(() => {
          // Restore original navigator after each test
          Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        configurable: true,
        writable: true,
          })
        })

        it('returns true when navigator.onLine is true', () => {
          Object.defineProperty(global, 'navigator', {
        value: { onLine: true },
        configurable: true,
        writable: true,
          })
          expect(useNetworkStatus()).toBe(true)
        })

        it('returns false when navigator.onLine is false', () => {
          Object.defineProperty(global, 'navigator', {
        value: { onLine: false },
        configurable: true,
        writable: true,
          })
          expect(useNetworkStatus()).toBe(false)
        })

        it('returns undefined if navigator is not defined', () => {
          // Remove navigator from global
          Object.defineProperty(global, 'navigator', {
        value: undefined,
        configurable: true,
        writable: true,
          })
          expect(() => useNetworkStatus()).toThrow()
        })
      })
    })
  })
})