import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useProfileViewModel } from '@/presentation/viewmodels/ProfileViewModel'
import { usePWAInstall } from '@/presentation/hooks/usePWAInstall'
import { useSavedArtworkViewModel } from '@/presentation/viewmodels/SavedArtworkViewModel'

// Mock dependencies
vi.mock('@/presentation/hooks/usePWAInstall')
vi.mock('@/presentation/viewmodels/SavedArtworkViewModel')

const mockUsePWAInstall = vi.mocked(usePWAInstall)
const mockUseSavedArtworkViewModel = vi.mocked(useSavedArtworkViewModel)

// Mock navigator
const mockNavigator = {
  onLine: true,
  serviceWorker: {
    controller: null,
  },
}

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
})

// Mock window
const mockWindow = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  caches: {},
}

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
})

// Mock localStorage
const mockLocalStorage = {
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('ProfileViewModel', () => {
  let queryClient: QueryClient

  const createWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    // Reset navigator state
    mockNavigator.onLine = true
    mockNavigator.serviceWorker.controller = null

    // Setup default mock implementations
    mockUsePWAInstall.mockReturnValue({
      isInstallable: false,
      isInstalled: false,
      installApp: vi.fn(),
    })

    mockUseSavedArtworkViewModel.mockReturnValue({
      savedArtworks: [],
      isLoading: false,
      saveArtwork: vi.fn(),
      removeSavedArtwork: vi.fn(),
      isArtworkSaved: vi.fn(),
      error: null,
    })
  })

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.isOnline).toBe(true)
      expect(result.current.isInstalled).toBe(false)
      expect(result.current.isInstallable).toBe(false)
      expect(result.current.isInstalling).toBe(false)
      expect(typeof result.current.handleInstallApp).toBe('function')
    })

    it('should setup online/offline event listeners', () => {
      renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      )
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      )
    })

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      unmount()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      )
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      )
    })
  })

  describe('online/offline status', () => {
    it('should update online status when online event fires', () => {
      mockNavigator.onLine = false

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.isOnline).toBe(false)

      // Simulate online event
      const onlineHandler = mockWindow.addEventListener.mock.calls.find(
        (call) => call[0] === 'online'
      )?.[1]

      act(() => {
        onlineHandler?.()
      })

      expect(result.current.isOnline).toBe(true)
    })

    it('should update offline status when offline event fires', () => {
      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.isOnline).toBe(true)

      // Simulate offline event
      const offlineHandler = mockWindow.addEventListener.mock.calls.find(
        (call) => call[0] === 'offline'
      )?.[1]

      act(() => {
        offlineHandler?.()
      })

      expect(result.current.isOnline).toBe(false)
    })
  })

  describe('PWA installation', () => {
    it('should handle successful app installation', async () => {
      const mockInstallApp = vi.fn().mockResolvedValue(true)
      mockUsePWAInstall.mockReturnValue({
        isInstallable: true,
        isInstalled: false,
        installApp: mockInstallApp,
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.isInstalling).toBe(false)

      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.handleInstallApp()
      })

      expect(installResult).toBe(true)
      expect(mockInstallApp).toHaveBeenCalled()
      expect(result.current.isInstalling).toBe(false)
    })

    it('should handle failed app installation', async () => {
      const mockInstallApp = vi.fn().mockResolvedValue(false)
      mockUsePWAInstall.mockReturnValue({
        isInstallable: true,
        isInstalled: false,
        installApp: mockInstallApp,
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.handleInstallApp()
      })

      expect(installResult).toBe(false)
      expect(mockInstallApp).toHaveBeenCalled()
    })

    it('should handle installation error', async () => {
      const mockError = new Error('Installation failed')
      const mockInstallApp = vi.fn().mockRejectedValue(mockError)
      mockUsePWAInstall.mockReturnValue({
        isInstallable: true,
        isInstalled: false,
        installApp: mockInstallApp,
      })

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.handleInstallApp()
      })

      expect(installResult).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to install app:',
        mockError
      )

      consoleErrorSpy.mockRestore()
    })

    it('should not install when not installable', async () => {
      const mockInstallApp = vi.fn()
      mockUsePWAInstall.mockReturnValue({
        isInstallable: false,
        isInstalled: false,
        installApp: mockInstallApp,
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      let installResult: boolean | undefined
      await act(async () => {
        installResult = await result.current.handleInstallApp()
      })

      expect(installResult).toBe(false)
      expect(mockInstallApp).not.toHaveBeenCalled()
    })

    it('should not install when already installing', async () => {
      const mockInstallApp = vi
        .fn()
        .mockImplementationOnce(() => new Promise(() => {})) // Never resolves

      mockUsePWAInstall.mockReturnValue({
        isInstallable: true,
        isInstalled: false,
        installApp: mockInstallApp,
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      // Start first installation (won't complete)
      act(() => {
        result.current.handleInstallApp()
      })

      expect(result.current.isInstalling).toBe(true)

      // Try to install again
      const secondResult = await act(async () => {
        return await result.current.handleInstallApp()
      })

      expect(secondResult).toBe(false)
      expect(mockInstallApp).toHaveBeenCalledTimes(1)
    })
  })

  describe('user stats', () => {
    it('should provide correct user stats', () => {
      const mockSavedArtworks = [
        { id: 1, title: 'Artwork 1' },
        { id: 2, title: 'Artwork 2' },
      ]

      mockUseSavedArtworkViewModel.mockReturnValue({
        savedArtworks: mockSavedArtworks,
        isLoading: false,
        saveArtwork: vi.fn(),
        removeSavedArtwork: vi.fn(),
        isArtworkSaved: vi.fn(),
        error: null,
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.userStats).toEqual({
        savedArtworksCount: 2,
        isOnline: true,
        connectionStatus: 'Online',
      })
    })

    it('should show offline status when offline', () => {
      mockNavigator.onLine = false

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.userStats.connectionStatus).toBe('Offline')
      expect(result.current.userStats.isOnline).toBe(false)
    })
  })

  describe('feature statuses', () => {
    it('should show correct feature statuses when not installed', () => {
      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      const features = result.current.featureStatuses

      expect(features).toHaveLength(3)

      const offlineBrowsing = features.find(
        (f) => f.name === 'Offline Browsing'
      )
      expect(offlineBrowsing?.isEnabled).toBe(false)
      expect(offlineBrowsing?.status).toBe('disabled')
      expect(offlineBrowsing?.description).toContain('Install the app')

      const imageCaching = features.find((f) => f.name === 'Image Caching')
      expect(imageCaching?.isEnabled).toBe(false)
      expect(imageCaching?.status).toBe('disabled')
      expect(imageCaching?.description).toContain('Install the app')

      const localStorage = features.find((f) => f.name === 'Local Storage')
      expect(localStorage?.isEnabled).toBe(true)
      expect(localStorage?.status).toBe('enabled')
    })

    it('should show correct feature statuses when installed with service worker', () => {
      mockUsePWAInstall.mockReturnValue({
        isInstallable: false,
        isInstalled: true,
        installApp: vi.fn(),
      })

      // Mock service worker as active
      mockNavigator.serviceWorker.controller = {} as ServiceWorker

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      const features = result.current.featureStatuses

      const offlineBrowsing = features.find(
        (f) => f.name === 'Offline Browsing'
      )
      expect(offlineBrowsing?.isEnabled).toBe(true)
      expect(offlineBrowsing?.status).toBe('enabled')

      const imageCaching = features.find((f) => f.name === 'Image Caching')
      expect(imageCaching?.isEnabled).toBe(true)
      expect(imageCaching?.status).toBe('enabled')
    })

    it('should handle localStorage failure', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage failed')
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      const features = result.current.featureStatuses
      const localStorage = features.find((f) => f.name === 'Local Storage')

      expect(localStorage?.isEnabled).toBe(false)
      expect(localStorage?.status).toBe('disabled')
      expect(localStorage?.description).toBe('Local storage is not available')
    })
  })

  describe('PWA status', () => {
    it('should provide correct PWA status when installable', () => {
      mockUsePWAInstall.mockReturnValue({
        isInstallable: true,
        isInstalled: false,
        installApp: vi.fn(),
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      const pwaStatus = result.current.pwaStatus

      expect(pwaStatus.isInstallable).toBe(true)
      expect(pwaStatus.isInstalled).toBe(false)
      expect(pwaStatus.isInstalling).toBe(false)
      expect(pwaStatus.canInstall).toBe(true)
      expect(pwaStatus.installationMessage).toContain(
        'Install the app for a better experience'
      )
    })

    it('should provide correct PWA status when installed', () => {
      mockUsePWAInstall.mockReturnValue({
        isInstallable: false,
        isInstalled: true,
        installApp: vi.fn(),
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      const pwaStatus = result.current.pwaStatus

      expect(pwaStatus.isInstallable).toBe(false)
      expect(pwaStatus.isInstalled).toBe(true)
      expect(pwaStatus.canInstall).toBe(false)
      expect(pwaStatus.installationMessage).toBe(
        'App is installed and ready to use offline!'
      )
    })

    it('should provide correct PWA status when installing', () => {
      mockUsePWAInstall.mockReturnValue({
        isInstallable: true,
        isInstalled: false,
        installApp: vi.fn(),
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      // Start installation to set installing state
      act(() => {
        result.current.handleInstallApp()
      })

      const pwaStatus = result.current.pwaStatus
      expect(pwaStatus.installationMessage).toBe('Installing app...')
    })

    it('should provide correct PWA status when not installable', () => {
      mockUsePWAInstall.mockReturnValue({
        isInstallable: false,
        isInstalled: false,
        installApp: vi.fn(),
      })

      const { result } = renderHook(() => useProfileViewModel(), {
        wrapper: createWrapper,
      })

      const pwaStatus = result.current.pwaStatus

      expect(pwaStatus.canInstall).toBe(false)
      expect(pwaStatus.installationMessage).toBe(
        'Installation not available on this device/browser'
      )
    })
  })
})
