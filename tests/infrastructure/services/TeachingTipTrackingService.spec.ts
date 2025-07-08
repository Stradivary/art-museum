import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { TeachingTipTrackingService } from '@/infrastructure/services/TeachingTipTrackingService'

function mockLocalStorage() {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    _store: store,
  }
}

describe('TeachingTipTrackingService', () => {
  let localStorageMock: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    localStorageMock = mockLocalStorage()
    vi.stubGlobal('localStorage', localStorageMock)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return an empty set if nothing is stored', () => {
    expect(TeachingTipTrackingService.getShownTips()).toEqual(new Set())
  })

  it('should mark a tip as shown and retrieve it', () => {
    TeachingTipTrackingService.markTipAsShown('tip1')
    expect(TeachingTipTrackingService.getShownTips()).toEqual(new Set(['tip1']))
    expect(TeachingTipTrackingService.isTipShown('tip1')).toBe(true)
    expect(TeachingTipTrackingService.isTipShown('tip2')).toBe(false)
  })

  it('should mark multiple tips as shown', () => {
    TeachingTipTrackingService.markTipsAsShown(['tip1', 'tip2'])
    expect(TeachingTipTrackingService.getShownTips()).toEqual(new Set(['tip1', 'tip2']))
    expect(TeachingTipTrackingService.isTipShown('tip1')).toBe(true)
    expect(TeachingTipTrackingService.isTipShown('tip2')).toBe(true)
  })

  it('should reset a specific tip', () => {
    TeachingTipTrackingService.markTipsAsShown(['tip1', 'tip2'])
    TeachingTipTrackingService.resetTip('tip1')
    expect(TeachingTipTrackingService.getShownTips()).toEqual(new Set(['tip2']))
    expect(TeachingTipTrackingService.isTipShown('tip1')).toBe(false)
    expect(TeachingTipTrackingService.isTipShown('tip2')).toBe(true)
  })

  it('should reset all tips', () => {
    TeachingTipTrackingService.markTipsAsShown(['tip1', 'tip2'])
    TeachingTipTrackingService.resetAllTips()
    expect(TeachingTipTrackingService.getShownTips()).toEqual(new Set())
  })

  it('should get unshown tips from a list', () => {
    TeachingTipTrackingService.markTipAsShown('tip1')
    const unshown = TeachingTipTrackingService.getUnshownTips(['tip1', 'tip2', 'tip3'])
    expect(unshown).toEqual(['tip2', 'tip3'])
  })

  it('should check if any tips from a list are unshown', () => {
    TeachingTipTrackingService.markTipAsShown('tip1')
    expect(TeachingTipTrackingService.hasUnshownTips(['tip1', 'tip2'])).toBe(true)
    expect(TeachingTipTrackingService.hasUnshownTips(['tip1'])).toBe(false)
  })

  it('should reset tips if version changes', () => {
    // Simulate old version
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'teaching-tips-version') return '0.9.0'
      if (key === 'teaching-tips-shown') return JSON.stringify(['tip1'])
      return null
    })
    const tips = TeachingTipTrackingService.getShownTips()
    expect(tips).toEqual(new Set())
    expect(localStorageMock.setItem).toHaveBeenCalledWith('teaching-tips-version', '1.0.0')
  })

  it('should handle corrupted JSON gracefully', () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'teaching-tips-version') return '1.0.0'
      if (key === 'teaching-tips-shown') return 'not-json'
      return null
    })
    const tips = TeachingTipTrackingService.getShownTips()
    expect(tips).toEqual(new Set())
    expect(console.warn).toHaveBeenCalled()
  })
})