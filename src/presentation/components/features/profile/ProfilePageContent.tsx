'use client'

import { motion } from 'framer-motion'
import {
  Download,
  Heart,
  Settings,
  Smartphone,
  User,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { useProfileViewModel } from '@/presentation/viewmodels/ProfileViewModel'

export const ProfilePageContent = () => {
  const { userStats, featureStatuses, pwaStatus, handleInstallApp } =
    useProfileViewModel()

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
        return 'rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800'
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
    <div className="space-y-6">
      {/* User Profile Section */}
      <motion.div
        className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a20000] text-white">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Art Enthusiast</h2>
          <p className="text-gray-600">Exploring beautiful artworks</p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="rounded-lg bg-gradient-to-br from-[#a20000] to-[#8a0000] p-4 text-white">
          <div className="flex items-center space-x-2">
            <Heart size={20} />
            <span className="text-sm font-medium">Saved Artworks</span>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {userStats.savedArtworksCount}
          </p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
          <div className="flex items-center space-x-2">
            {userStats.isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="mt-2 text-lg font-semibold">
            {userStats.connectionStatus}
          </p>
        </div>
      </motion.div>

      {/* PWA Installation Section */}
      {!pwaStatus.isInstalled && (
        <motion.div
          className="rounded-lg border-2 border-dashed border-gray-300 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-center">
            <Smartphone className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold">
              Install Art Museum App
            </h3>
            <p className="mb-4 text-gray-600">
              {pwaStatus.installationMessage}
            </p>
            <Button
              onClick={handleInstallApp}
              disabled={pwaStatus.isInstalling} 
              //  || !pwaStatus.canInstall}
              className="bg-[#a20000] hover:bg-[#8a0000] disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              {pwaStatus.isInstalling ? 'Installing...' : 'Install App'}
            </Button>
          </div>
        </motion.div>
      )}

      {pwaStatus.isInstalled && (
        <motion.div
          className="rounded-lg bg-green-50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 text-green-800">
            <Smartphone size={20} />
            <span className="font-medium">App Installed</span>
          </div>
          <p className="mt-1 text-sm text-green-700">
            You can now use the app offline and access it from your home screen!
          </p>
        </motion.div>
      )}

      {/* App Features Section */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="flex items-center space-x-2 text-lg font-semibold">
          <Settings size={20} />
          <span>App Features</span>
        </h3>

        <div className="space-y-2">
          {featureStatuses.map((feature) => (
            <div
              key={feature.name}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-center space-x-2">
                {getFeatureStatusIcon(feature.status)}
                <div>
                  <span className="text-sm font-medium">{feature.name}</span>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
              <span className={getFeatureStatusBadge(feature.status)}>
                {getFeatureStatusText(feature.status)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        className="rounded-lg bg-blue-50 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h4 className="mb-2 font-semibold text-blue-900">About This App</h4>
        <p className="text-sm text-blue-800">
          This is a Progressive Web App (PWA) that provides enhanced
          functionality when installed. Features like offline browsing and image
          caching are automatically enabled when you install the app.
          {pwaStatus.isInstalled
            ? ' Your app is currently installed and all PWA features are active.'
            : ' Install the app to unlock offline capabilities and enhanced performance.'}
        </p>
      </motion.div>
    </div>
  )
}
