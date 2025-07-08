import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePWAInstall } from '@/presentation/hooks/usePWAInstall'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function mockNavigatorStandalone(value: boolean) {
  Object.defineProperty(window.navigator, 'standalone', {
    configurable: true,
    get: () => value,
  })
}

function mockServiceWorker(ready = true, controller = true) {
  // @ts-ignore
  window.navigator.serviceWorker = {
    ready: ready
      ? Promise.resolve({ scope: '/mock' })
      : Promise.reject('not ready'),
    controller: controller ? {} : undefined,
    getRegistrations: vi.fn().mockResolvedValue([]),
  }
}

describe('usePWAInstall', () => {
  let originalMatchMedia: any
  let originalNavigator: any
  let originalAlert: any

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    originalNavigator = { ...window.navigator }
    originalAlert = window.alert
    window.alert = vi.fn()
    // Remove global deferredPWAInstallPrompt
    delete window.deferredPWAInstallPrompt
    // Remove serviceWorker
    // @ts-ignore
    delete window.navigator.serviceWorker
    // Remove standalone
    // @ts-ignore
    delete window.navigator.standalone
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    window.alert = originalAlert
    // Restore navigator
    Object.keys(window.navigator).forEach((key) => {
      // @ts-ignore
      delete window.navigator[key]
    })
    Object.assign(window.navigator, originalNavigator)
    vi.restoreAllMocks()
  })

  it('should detect app as installed if display-mode is standalone', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => usePWAInstall())
    expect(result.current.isInstalled).toBe(true)
    expect(result.current.isInstallable).toBe(false)
  })

  it('should detect app as installed if navigator.standalone is true (iOS)', () => {
    mockMatchMedia(false)
    mockNavigatorStandalone(true)
    const { result } = renderHook(() => usePWAInstall())
    expect(result.current.isInstalled).toBe(true)
    expect(result.current.isInstallable).toBe(false)
  })

  it('should set isInstallable if deferredPWAInstallPrompt is present', () => {
    mockMatchMedia(false)
    // @ts-ignore
    window.deferredPWAInstallPrompt = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    }
    const { result } = renderHook(() => usePWAInstall())
    expect(result.current.isInstallable).toBe(true)
    expect(result.current.isInstalled).toBe(false)
  })

  it('should handle pwa-install-prompt-captured event', () => {
    mockMatchMedia(false)
    const promptObj = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    }
    // @ts-ignore
    window.deferredPWAInstallPrompt = undefined
    const { result } = renderHook(() => usePWAInstall())
    // Simulate event after mount
    // @ts-ignore
    window.deferredPWAInstallPrompt = promptObj
    act(() => {
      window.dispatchEvent(new Event('pwa-install-prompt-captured'))
    })
    expect(result.current.isInstallable).toBe(true)
  })

  it('should handle appinstalled event', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => usePWAInstall())
    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })
    expect(result.current.isInstalled).toBe(true)
    expect(result.current.isInstallable).toBe(false)
  })

  it('should set fallbackInstallable after timeout if service worker is present', async () => {
    mockMatchMedia(false)
    mockServiceWorker(true, true)
    const { result } = renderHook(() => usePWAInstall())
    // Fast-forward timers
    vi.useFakeTimers()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    // Wait for state update
    await Promise.resolve()
    expect(result.current.isInstallable).toBe(false)
    vi.useRealTimers()
  })

  it('installApp should prompt if deferredPrompt is available and outcome is accepted', async () => {
    mockMatchMedia(false)
    const prompt = vi.fn()
    const userChoice = Promise.resolve({ outcome: 'accepted' })
    // @ts-ignore
    window.deferredPWAInstallPrompt = { prompt, userChoice }
    const { result } = renderHook(() => usePWAInstall())
    let installResult: boolean | undefined
    await act(async () => {
      installResult = await result.current.installApp()
    })
    expect(prompt).toHaveBeenCalled()
    expect(installResult).toBe(true)
    expect(result.current.isInstalled).toBe(true)
    expect(result.current.isInstallable).toBe(false)
  })

  it('installApp should prompt if deferredPrompt is available and outcome is dismissed', async () => {
    mockMatchMedia(false)
    const prompt = vi.fn()
    const userChoice = Promise.resolve({ outcome: 'dismissed' })
    // @ts-ignore
    window.deferredPWAInstallPrompt = { prompt, userChoice }
    const { result } = renderHook(() => usePWAInstall())
    let installResult: boolean | undefined
    await act(async () => {
      installResult = await result.current.installApp()
    })
    expect(prompt).toHaveBeenCalled()
    expect(installResult).toBe(false)
    expect(result.current.isInstalled).toBe(false)
  })

  it('installApp should return false if no deferredPrompt and not fallbackInstallable', async () => {
    mockMatchMedia(false)
    // No deferredPrompt, fallbackInstallable false
    const { result } = renderHook(() => usePWAInstall())
    let installResult: boolean | undefined
    await act(async () => {
      installResult = await result.current.installApp()
    })
    expect(installResult).toBe(false)
    expect(window.alert).not.toHaveBeenCalled()
  })
})