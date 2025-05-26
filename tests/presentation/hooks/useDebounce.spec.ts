import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/presentation/hooks/useDebounce'

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Change the value
    rerender({ value: 'changed', delay: 500 })

    // Value should still be the initial value
    expect(result.current).toBe('initial')

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now the value should be updated
    expect(result.current).toBe('changed')
  })

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // First change
    rerender({ value: 'first', delay: 500 })

    // Advance time partially
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Second change before debounce completes
    rerender({ value: 'second', delay: 500 })

    // Value should still be initial
    expect(result.current).toBe('initial')

    // Complete the debounce time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should have the latest value
    expect(result.current).toBe('second')
  })

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    )

    rerender({ value: 'changed', delay: 1000 })

    // Advance time by 500ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('initial')

    // Complete the full delay
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('changed')
  })
})
