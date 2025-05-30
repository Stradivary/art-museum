import { motion } from 'framer-motion'
import { Heart, Wifi, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function UserStatsSection({
  savedArtworksCount,
  isOnline,
  connectionStatus,
}: {
  savedArtworksCount: number
  isOnline: boolean
  connectionStatus: string
}) {
  const { t } = useTranslation()
  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="text-primary-foreground rounded-lg bg-gradient-to-br from-[#a20000] to-[#8a0000] p-4">
        <div className="flex items-center space-x-2">
          <Heart size={20} />
          <span className="text-sm font-medium">
            {t('profile.savedArtworks', 'Saved Artworks')}
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold">{savedArtworksCount}</p>
      </div>
      <div className="text-primary-foreground rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4">
        <div className="flex items-center space-x-2">
          {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
          <span className="text-sm font-medium">
            {t('profile.status', 'Status')}
          </span>
        </div>
        <p className="mt-2 text-lg font-semibold">
          {t(`profile.connectionStatus.${connectionStatus}`, connectionStatus)}
        </p>
      </div>
    </motion.div>
  )
}
