import { useState, useEffect } from 'react'
import { usePWAInstall } from '@/presentation/hooks/usePWAInstall'
import { useSavedArtworkViewModel } from '@/presentation/viewmodels/SavedArtworkViewModel'
import { useTranslation } from 'react-i18next'
import { ClearSavedArtworkUseCase } from '@/core/application/usecases/savedArtwork/ClearSavedArtworkUseCase'
import { savedArtworkRepository } from '@/infrastructure/repositories/SavedArtworkRepositoryImpl'

export interface ProfileFeatureStatus {
  name: string
  isEnabled: boolean
  status: 'enabled' | 'disabled' | 'pending'
  description: string
}

const clearSavedArtworkUseCase = new ClearSavedArtworkUseCase(
  savedArtworkRepository
)

export const useProfileViewModel = () => {
  const { t } = useTranslation()
  const { isInstallable, isInstalled, installApp } = usePWAInstall()
  const { savedArtworks } = useSavedArtworkViewModel()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isInstalling, setIsInstalling] = useState(false)

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle PWA installation
  const handleInstallApp = async (): Promise<boolean> => {
    if (!isInstallable || isInstalling) return false

    setIsInstalling(true)
    try {
      const success = await installApp()
      if (success) {
        console.log('App installed successfully!')
      }
      return success
    } catch (error) {
      console.error('Failed to install app:', error)
      return false
    } finally {
      setIsInstalling(false)
    }
  }

  // Check if service worker is available and active
  const isServiceWorkerActive = (): boolean => {
    return (
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller !== null
    )
  }

  // Check if cache storage is available
  const isCacheStorageAvailable = (): boolean => {
    return 'caches' in window
  }

  // Get PWA features status based on installation and capabilities
  const getFeatureStatuses = (): ProfileFeatureStatus[] => {
    const getOfflineBrowsingStatus = () => {
      if (!isInstalled) return 'disabled'
      return isServiceWorkerActive() ? 'enabled' : 'pending'
    }

    const getImageCachingStatus = () => {
      if (!isInstalled) return 'disabled'
      return isCacheStorageAvailable() ? 'enabled' : 'disabled'
    }

    const baseFeatures: ProfileFeatureStatus[] = [
      {
        name: t('features.offline.name'),
        isEnabled: isInstalled && isServiceWorkerActive(),
        status: getOfflineBrowsingStatus(),
        description: isInstalled
          ? t('features.offline.description')
          : t('features.offline.inactive'),
      },
      {
        name: t('features.imageCaching.name'),
        isEnabled: isInstalled && isCacheStorageAvailable(),
        status: getImageCachingStatus(),
        description: isInstalled
          ? t('features.imageCaching.description')
          : t('features.imageCaching.inactive'),
      },
      {
        name: t('features.pwa.name'),
        isEnabled: isInstalled,
        status: isInstalled ? 'enabled' : 'disabled',
        description: isInstalled
          ? t('features.pwa.description')
          : t('features.pwa.inactive'),
      },
    ]

    return baseFeatures
  }

  // Get user stats
  const getUserStats = () => {
    return {
      savedArtworksCount: savedArtworks.length,
      isOnline,
      connectionStatus: isOnline
        ? t('profile.connectionStatus.online')
        : t('profile.connectionStatus.offline'),
    }
  }

  // Get PWA installation status
  const getPWAStatus = () => {
    return {
      isInstallable,
      isInstalled,
      isInstalling,
      canInstall: isInstallable && !isInstalled && !isInstalling,
      installationMessage: getInstallationMessage(),
    }
  }

  const getInstallationMessage = (): string => {
    if (isInstalled) {
      return 'App is installed and ready to use offline!'
    }
    if (isInstalling) {
      return 'Installing app...'
    }
    if (isInstallable) {
      return 'Install the app for a better experience and offline access to your saved artworks.'
    }
    return 'Installation not available on this device/browser'
  }

  const clearSavedArtworks = () => {
    clearSavedArtworkUseCase.execute()

    alert(
      t('profile.clearSavedArtworks', 'Your saved artworks have been cleared.')
    )
  }

  return {
    // Data
    userStats: getUserStats(),
    featureStatuses: getFeatureStatuses(),
    pwaStatus: getPWAStatus(),

    // Actions
    handleInstallApp,

    // State
    isOnline,
    isInstalled,
    isInstallable,
    isInstalling,

    clearSavedArtworks,
  }
}
