import { describe, it, expect } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { queryClient } from '@/infrastructure/services/queryClientService'

describe('QueryClientService', () => {
  it('should export a QueryClient instance', () => {
    expect(queryClient).toBeInstanceOf(QueryClient)
  })

  it('should have correct default staleTime', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000) // 5 minutes
  })

  it('should have correct default gcTime', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000) // 10 minutes
  })

  it('should have refetchOnWindowFocus disabled', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false)
  })

  it('should have refetchOnReconnect enabled', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    expect(defaultOptions.queries?.refetchOnReconnect).toBe(true)
  })

  it('should not retry on 4xx errors', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    const retryFn = defaultOptions.queries?.retry as Function

    const error4xx = new Error('Error 404')
    const shouldRetry = retryFn(1, error4xx)
    expect(shouldRetry).toBe(false)
  })

  it('should retry on network errors up to 2 times', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    const retryFn = defaultOptions.queries?.retry as Function

    const networkError = new Error('Network error')

    // Should retry first failure
    expect(retryFn(0, networkError)).toBe(true)
    // Should retry second failure
    expect(retryFn(1, networkError)).toBe(true)
    // Should not retry third failure
    expect(retryFn(2, networkError)).toBe(false)
  })

  it('should have exponential backoff retry delay', () => {
    const defaultOptions = queryClient.getDefaultOptions()
    const retryDelayFn = defaultOptions.queries?.retryDelay as Function

    // First retry should be 1000ms
    expect(retryDelayFn(0)).toBe(1000)
    // Second retry should be 2000ms
    expect(retryDelayFn(1)).toBe(2000)
    // Third retry should be 4000ms
    expect(retryDelayFn(2)).toBe(4000)

    // Should cap at 30000ms
    expect(retryDelayFn(10)).toBe(30000)
  })
})
