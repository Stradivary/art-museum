import { useState, useEffect, useCallback } from 'react'

import type { BeforeInstallPromptEvent } from '@/types/pwa'

declare global {
  interface Window {
    deferredPWAInstallPrompt?: Event
  }
}

/**
 * Hook to handle PWA installation functionality
 */
export function usePWAInstall() {
  // Use correct type for deferredPrompt
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [fallbackInstallable, setFallbackInstallable] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        console.log(
          '[PWA] App is running in standalone mode (already installed)'
        )
        return true
      }

      // Additional check for installed state (iOS Safari)
      if (
        (window.navigator as Navigator & { standalone?: boolean })
          .standalone === true
      ) {
        setIsInstalled(true)
        console.log('[PWA] App is running in standalone mode (iOS)')
        return true
      }

      return false
    }

    const isAlreadyInstalled = checkInstalled()

    // Check if beforeinstallprompt was already caught by early script
    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(
        window.deferredPWAInstallPrompt as unknown as BeforeInstallPromptEvent
      )
      setIsInstallable(true)
    }

    // Listen for custom event if beforeinstallprompt is caught after mount
    const handleCustomPrompt = () => {
      if (window.deferredPWAInstallPrompt) {
        setDeferredPrompt(
          window.deferredPWAInstallPrompt as unknown as BeforeInstallPromptEvent
        )
        setIsInstallable(true)
      }
    }
    window.addEventListener('pwa-install-prompt-captured', handleCustomPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log('[PWA] appinstalled event fired')
    }

    // Only add listeners if not already installed
    if (!isAlreadyInstalled) {
      console.log('[PWA] Adding event listeners for install prompt')
      window.addEventListener('appinstalled', handleAppInstalled)

      // Debug: Check if service worker is registered
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then((registration) => {
            console.log('[PWA] Service Worker is ready:', registration)
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error)
          })
      } else {
        console.warn('[PWA] Service Worker not supported')
      }

      // Debug: Check service worker registrations
      if (
        'serviceWorker' in navigator &&
        'getRegistrations' in navigator.serviceWorker
      ) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          console.log('[PWA] Service Worker registrations:', registrations)
        })
      }
    }

    return () => {
      window.removeEventListener(
        'pwa-install-prompt-captured',
        handleCustomPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Separate useEffect for fallback installable detection
  useEffect(() => {
    if (!isInstalled && !isInstallable) {
      const timer = setTimeout(() => {
        if (
          'serviceWorker' in navigator &&
          navigator.serviceWorker.controller
        ) {
          console.log('[PWA] Setting fallback installable to true')
          setFallbackInstallable(true)
        }
      }, 5000) // Wait 5 seconds for beforeinstallprompt

      return () => clearTimeout(timer)
    }
  }, [isInstalled, isInstallable])

  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] No deferredPrompt available, cannot install')

      // Fallback: show manual installation instructions
      if (fallbackInstallable) {
        const userAgent = navigator.userAgent
        let instructions = ''

        if (userAgent.includes('Edg')) {
          instructions =
            'Open Edge menu (⋯) → "Apps" → "Install this site as an app"'
        } else if (userAgent.includes('Chrome')) {
          instructions =
            'Open Chrome menu (⋮) → "Install app" or "Add to Home screen"'
        } else if (userAgent.includes('Firefox')) {
          instructions =
            'Open Firefox menu → "Install" or look for install icon in address bar'
        } else if (userAgent.includes('Safari')) {
          instructions = 'Tap Share button → "Add to Home Screen"'
        } else {
          instructions =
            'Look for "Install app" or "Add to Home screen" option in your browser menu'
        }

        alert(`To install this app:\n\n${instructions}`)
      }

      return false
    }

    try {
      // Show the install prompt
      console.log('[PWA] Prompting user for install')
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const result = await deferredPrompt.userChoice
      console.log('[PWA] User choice:', result)

      if (result.outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      setDeferredPrompt(null) // Clear after use
      return false
    } catch (error) {
      console.error('Error installing PWA:', error)
      return false
    }
  }, [deferredPrompt, fallbackInstallable])

  return {
    isInstallable: isInstallable || fallbackInstallable,
    isInstalled,
    installApp,
  }
}
