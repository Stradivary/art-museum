'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { useProfileViewModel } from '@/presentation/viewmodels/ProfileViewModel'
import { useEffect, useState } from 'react'
import { UserProfile } from './profile/UserProfile'
import { SettingsSection } from './profile/SettingsSection'
import { ClearPreferenceSection } from './profile/ClearPreferenceSection'
import { PWAInstallSection } from './profile/PWAInstallSection'
import { AppFeaturesSection } from './profile/AppFeaturesSection'
import { UserStatsSection } from './profile/UserStatsSection'
import { AboutAppSection } from './profile/AboutAppSection'
import { useRegisterTeachingTip } from '@/presentation/hooks/useRegisterTeachingTip'

function getFingerprint() {
  // Simple browser fingerprint (not cryptographically unique)
  if (typeof window === 'undefined') return 'unknown'
  const nav = window.navigator
  const fp = [
    nav.userAgent,
    nav.language,
    nav.platform,
    nav.hardwareConcurrency,
    window.screen.width,
    window.screen.height,
  ].join('-')
  return btoa(unescape(encodeURIComponent(fp))).slice(0, 16)
}

export const ProfilePageContent = () => {
  const { userStats, featureStatuses, pwaStatus, handleInstallApp } =
    useProfileViewModel()

  // Register teaching tips
  const profileTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'profile-user',
    title: 'Your Profile',
    description:
      'This section shows your unique browser fingerprint and profile information.',
    position: 'top',
  })
  const settingsTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'profile-settings',
    title: 'Settings',
    description: 'Manage your app preferences and settings here.',
    position: 'top',
  })
  const clearTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'profile-clear',
    title: 'Clear Preferences',
    description: 'Remove all saved and disliked artworks from your device.',
    position: 'top',
  })
  const statsTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'profile-stats',
    title: 'Your Stats',
    description: 'See your saved artworks count and connection status.',
    position: 'top',
  })
  const pwaTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'profile-pwa',
    title: 'Install as App',
    description:
      'Install this app to your device for a native-like experience.',
    position: 'top',
  })
  const featuresTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'profile-features',
    title: 'App Features',
    description: 'Check which features are enabled or available in the app.',
    position: 'top',
  })
  const aboutTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'profile-about',
    title: 'About This App',
    description: 'Learn more about this art museum app and its creators.',
    position: 'top',
  })

  const [clearLoading, setClearLoading] = useState(false)
  const [fingerprint, setFingerprint] = useState('')

  useEffect(() => {
    setFingerprint(getFingerprint())
  }, [])

  const handleClear = async () => {
    setClearLoading(true)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savedArtworks')
      localStorage.removeItem('dislikedArtworks')
    }
    setClearLoading(false)
  }

  const getFeatureStatusIcon = (status: string) => {
    switch (status) {
      case 'enabled':
        return <CheckCircle size={16} className="text-green-600" />
      case 'disabled':
        return <XCircle size={16} className="text-red-600" />
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />
      default:
        return <XCircle size={16} className="text-gray-400" />
    }
  }

  const getFeatureStatusBadge = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'
      case 'disabled':
        return 'rounded-full bg-red-100 px-2 py-1 text-xs text-red-800'
      case 'pending':
        return 'rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800'
      default:
        return 'rounded-full bg-muted px-2 py-1 text-xs text-gray-800'
    }
  }

  const getFeatureStatusText = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'Enabled'
      case 'disabled':
        return 'Disabled'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="space-y-5">
      {/* User Profile Section */}
      <motion.div
        className="bg-card rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        ref={profileTip.ref}
      >
        <UserProfile fingerprint={fingerprint} />
      </motion.div>

      {/* Settings Section */}
      <motion.div
        className="bg-card rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        ref={settingsTip.ref}
      >
        <SettingsSection />
      </motion.div>

      {/* Clear Preference Section */}
      <motion.div
        className="bg-card rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        ref={clearTip.ref}
      >
        <ClearPreferenceSection onClear={handleClear} loading={clearLoading} />
      </motion.div>

      {/* Stats Section */}
      <div ref={statsTip.ref}>
        <UserStatsSection
          savedArtworksCount={userStats.savedArtworksCount}
          isOnline={userStats.isOnline}
          connectionStatus={userStats.connectionStatus}
        />
      </div>

      {/* PWA Installation Section */}
      <div ref={pwaTip.ref}>
        <PWAInstallSection
          isInstalled={pwaStatus.isInstalled}
          isInstalling={pwaStatus.isInstalling}
          canInstall={pwaStatus.canInstall}
          installationMessage={pwaStatus.installationMessage}
          onInstall={handleInstallApp}
        />
      </div>

      {/* App Features Section */}
      <div ref={featuresTip.ref}>
        <AppFeaturesSection
          features={featureStatuses}
          getIcon={getFeatureStatusIcon}
          getBadge={getFeatureStatusBadge}
          getText={getFeatureStatusText}
        />
      </div>

      {/* Info Section */}
      <div ref={aboutTip.ref}>
        <AboutAppSection isInstalled={pwaStatus.isInstalled} />
      </div>
    </div>
  )
}
