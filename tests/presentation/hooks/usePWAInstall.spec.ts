import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePWAInstall } from '@/presentation/hooks/usePWAInstall'
import type { BeforeInstallPromptEvent } from '@/types/pwa'

// Create mock objects
const createMockWindow = () => ({
  matchMedia: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  alert: vi.fn(),
  navigator: {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    serviceWorker: {
      ready: Promise.resolve({
        scope: 'https://localhost:3000/',
      }),
      getRegistrations: vi.fn().mockResolvedValue([]),
      controller: null,
    },
    clipboard: {
      writeText: vi.fn(),
    },
    standalone: false,
  },
})

describe('usePWAInstall', () => {
  let mockWindow: ReturnType<typeof createMockWindow>
  let mockMatchMedia: ReturnType<typeof vi.fn>
  let mockNavigator: ReturnType<typeof createMockWindow>['navigator']
  let mockBeforeInstallPrompt: Partial<BeforeInstallPromptEvent>

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockWindow = createMockWindow()
    mockMatchMedia = mockWindow.matchMedia
    mockNavigator = mockWindow.navigator

    // Mock global window and navigator
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(global, 'navigator', {
      value: mockWindow.navigator,
      writable: true,
      configurable: true,
    })

    // Mock global alert
    global.alert = mockWindow.alert

    // Create mock beforeinstallprompt event
    mockBeforeInstallPrompt = {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    }
  })

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      const { result } = renderHook(() => usePWAInstall())

      expect(result.current.isInstallable).toBe(false)
      expect(result.current.isInstalled).toBe(false)
      expect(typeof result.current.installApp).toBe('function')
    })

    it('should detect if app is already installed (standalone mode)', () => {
      mockMatchMedia.mockReturnValue({ matches: true })

      const { result } = renderHook(() => usePWAInstall())

      expect(result.current.isInstalled).toBe(true)
      expect(result.current.isInstallable).toBe(false)
    })

    it('should detect if app is already installed (iOS standalone)', () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      // Mock iOS standalone mode
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        writable: true,
      })

      const { result } = renderHook(() => usePWAInstall())

      expect(result.current.isInstalled).toBe(true)
    })
  })

  describe('beforeinstallprompt event handling', () => {
    it('should handle beforeinstallprompt event', async () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      const { result } = renderHook(() => usePWAInstall())

      // Simulate beforeinstallprompt event
      const addEventListenerCalls = mockWindow.addEventListener.mock.calls
      const beforeInstallPromptHandler = addEventListenerCalls.find(
        (call) => call[0] === 'beforeinstallprompt'
      )?.[1]

      expect(beforeInstallPromptHandler).toBeDefined()

      const mockEvent = {
        preventDefault: vi.fn(),
        ...mockBeforeInstallPrompt,
      }

      act(() => {
        beforeInstallPromptHandler(mockEvent)
      })

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(result.current.isInstallable).toBe(true)
    })

    it('should handle appinstalled event', async () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      const { result } = renderHook(() => usePWAInstall())

      // First make it installable
      const addEventListenerCalls = mockWindow.addEventListener.mock.calls
      const beforeInstallPromptHandler = addEventListenerCalls.find(
        (call) => call[0] === 'beforeinstallprompt'
      )?.[1]

      const mockEvent = {
        preventDefault: vi.fn(),
        ...mockBeforeInstallPrompt,
      }

      act(() => {
        beforeInstallPromptHandler(mockEvent)
      })

      expect(result.current.isInstallable).toBe(true)

      // Now simulate app installed
      const appInstalledHandler = addEventListenerCalls.find(
        (call) => call[0] === 'appinstalled'
      )?.[1]

      act(() => {
        appInstalledHandler()
      })

      expect(result.current.isInstalled).toBe(true)
      expect(result.current.isInstallable).toBe(false)
    })
  })

  describe('installApp function', () => {
    it('should successfully install app when prompt is available', async () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      const { result } = renderHook(() => usePWAInstall())

      // Set up deferred prompt
      const addEventListenerCalls = mockWindow.addEventListener.mock.calls
      const beforeInstallPromptHandler = addEventListenerCalls.find(
        (call) => call[0] === 'beforeinstallprompt'
      )?.[1]

      const mockEvent = {
        preventDefault: vi.fn(),
        ...mockBeforeInstallPrompt,
      }

      act(() => {
        beforeInstallPromptHandler(mockEvent)
      })

      // Install the app
      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.installApp()
      })

      expect(mockBeforeInstallPrompt.prompt).toHaveBeenCalled()
      expect(installResult).toBe(true)
      expect(result.current.isInstalled).toBe(true)
      expect(result.current.isInstallable).toBe(false)
    })

    it('should handle user dismissing install prompt', async () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      // Mock user dismissing prompt
      const dismissedPrompt = {
        prompt: vi.fn().mockResolvedValue(undefined),
        userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
      }

      const { result } = renderHook(() => usePWAInstall())

      // Set up deferred prompt
      const addEventListenerCalls = mockWindow.addEventListener.mock.calls
      const beforeInstallPromptHandler = addEventListenerCalls.find(
        (call) => call[0] === 'beforeinstallprompt'
      )?.[1]

      const mockEvent = {
        preventDefault: vi.fn(),
        ...dismissedPrompt,
      }

      act(() => {
        beforeInstallPromptHandler(mockEvent)
      })

      // Try to install the app
      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.installApp()
      })

      expect(installResult).toBe(false)
      expect(result.current.isInstalled).toBe(false)
    })

    it('should handle fallback installation when no deferred prompt', async () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      // Mock service worker controller
      Object.defineProperty(mockNavigator.serviceWorker, 'controller', {
        value: {} as ServiceWorker,
        writable: true,
        configurable: true,
      })

      // Use fake timers before rendering the hook
      vi.useFakeTimers()

      const { result } = renderHook(() => usePWAInstall())

      // Advance timers to trigger the fallback timeout
      act(() => {
        vi.advanceTimersByTime(5100)
      })

      vi.useRealTimers()

      expect(result.current.isInstallable).toBe(true)

      // Mock alert for fallback instructions
      const alertSpy = vi.spyOn(global, 'alert').mockImplementation(() => {})

      // Try to install without deferred prompt
      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.installApp()
      })

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('To install this app:')
      )
      expect(installResult).toBe(false)

      alertSpy.mockRestore()
    })

    it('should show correct instructions for different browsers', async () => {
      const browsers = [
        { userAgent: 'Edg', expectedInstruction: 'Edge menu' },
        { userAgent: 'Chrome', expectedInstruction: 'Chrome menu' },
        { userAgent: 'Firefox', expectedInstruction: 'Firefox menu' },
        { userAgent: 'Safari', expectedInstruction: 'Share button' },
      ]

      for (const browser of browsers) {
        vi.clearAllMocks()
        
        // Set user agent in the mock navigator
        Object.defineProperty(mockNavigator, 'userAgent', {
          value: `Mozilla/5.0 ${browser.userAgent}`,
          writable: true,
          configurable: true,
        })

        mockMatchMedia.mockReturnValue({ matches: false })
        Object.defineProperty(mockNavigator.serviceWorker, 'controller', {
          value: {} as ServiceWorker,
          writable: true,
          configurable: true,
        })

        // Use fake timers before rendering
        vi.useFakeTimers()

        const { result } = renderHook(() => usePWAInstall())

        // Advance timers to trigger fallback
        act(() => {
          vi.advanceTimersByTime(5100)
        })

        vi.useRealTimers()

        expect(result.current.isInstallable).toBe(true)

        // Mock alert
        const alertSpy = vi.spyOn(global, 'alert').mockImplementation(() => {})

        // Try to install
        await act(async () => {
          await result.current.installApp()
        })

        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining(browser.expectedInstruction)
        )

        alertSpy.mockRestore()
      }
    })

    it('should handle installation errors', async () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      // Mock prompt that throws error
      const errorPrompt = {
        prompt: vi.fn().mockRejectedValue(new Error('Installation failed')),
        userChoice: Promise.reject(new Error('User choice failed')),
        preventDefault: vi.fn(),
      }

      const { result } = renderHook(() => usePWAInstall())

      // Set up deferred prompt
      const addEventListenerCalls = mockWindow.addEventListener.mock.calls
      const beforeInstallPromptHandler = addEventListenerCalls.find(
        (call) => call[0] === 'beforeinstallprompt'
      )?.[1]

      act(() => {
        beforeInstallPromptHandler(errorPrompt)
      })

      // Try to install the app
      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.installApp()
      })

      expect(installResult).toBe(false)
    })
  })

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      const { unmount } = renderHook(() => usePWAInstall())

      // Clear previous calls to focus on unmount
      mockWindow.removeEventListener.mockClear()

      unmount()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'beforeinstallprompt',
        expect.any(Function)
      )
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'appinstalled',
        expect.any(Function)
      )
    })
  })

  describe('service worker integration', () => {
    it('should check service worker readiness', () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      renderHook(() => usePWAInstall())

      // The service worker ready promise will be resolved automatically
      // Just verify the hook renders without errors
      expect(mockNavigator.serviceWorker.getRegistrations).toHaveBeenCalled()
    })

    it('should handle service worker registration failure', async () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      // Mock service worker ready as a rejected promise
      Object.defineProperty(mockNavigator.serviceWorker, 'ready', {
        value: Promise.reject(new Error('Service worker failed')),
        writable: true,
        configurable: true,
      })

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      renderHook(() => usePWAInstall())

      // Wait for the promise rejection to be handled
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[PWA] Service Worker registration failed:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })
})
