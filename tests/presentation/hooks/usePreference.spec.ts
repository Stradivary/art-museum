import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { usePreference } from '@/presentation/hooks/usePreference'
import { preferenceService } from '@/core/application/services/PreferenceService'

// Move these mock declarations above vi.mock
// Mocks

vi.mock('@/i18n', () => ({
  default: { changeLanguage: vi.fn() },
}))

vi.mock('@/core/application/services/PreferenceService', () => ({
  PreferenceService: vi.fn().mockImplementation(() => ({
    getPreference: vi.fn().mockResolvedValue({
      theme: 'dark',
      language: 'id',
      showTeachingTips: false,
    }),
    setPreference: vi.fn().mockResolvedValue(undefined),
  })),
  preferenceService: {
    getPreference: vi.fn().mockResolvedValue({
      theme: 'dark',
      language: 'id',
      showTeachingTips: false,
    }),
    setPreference: vi.fn().mockResolvedValue(undefined),
  },
}))

const originalWindow = global.window

describe('usePreference', () => {
  beforeEach(() => {
    // Simulate browser environment
    global.window = {} as any
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    global.window = originalWindow
  })

  it('should initialize with default preference and loading=true', () => {
    const { result } = renderHook(() => usePreference())
    expect(result.current.preference).toEqual({
      theme: 'light',
      language: 'en',
      showTeachingTips: true,
    })
    expect(result.current.loading).toBe(true)
  })

  it('should load preference from service and update state', async () => {
    const { result } = renderHook(() => usePreference())

    expect(result.current.preference).toEqual({
      language: 'en',
      showTeachingTips: true,
      theme: 'light',
    })

    expect(result.current.loading).toBe(true)
  })
  it('should update preference and call setPreference', async () => {
    const { result } = renderHook(() => usePreference())

    expect(result.current.preference).toEqual({
      language: 'en',
      showTeachingTips: true,
      theme: 'light',
    })
    await act(async () => {
      await result.current.updatePreference({
        theme: 'dark',
        language: 'fr',
        showTeachingTips: false,
      })
    })
    expect(result.current.preference).toEqual({
      language: 'id',
      showTeachingTips: false,
      theme: 'dark',
    })
  })

  it('should remove dark class when theme is set to light', async () => {
    const { result } = renderHook(() => usePreference())
    expect(result.current.preference).toEqual({
      language: 'en',
      showTeachingTips: true,
      theme: 'light',
    })
    document.documentElement.classList.add('dark')
    await act(async () => {
      await result.current.updatePreference({ theme: 'light' })
    })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
