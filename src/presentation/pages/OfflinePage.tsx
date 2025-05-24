import { motion } from 'framer-motion'
import { OfflineFallback } from '../components/features/OfflineFallback'
import { PageHeader } from '../components/shared/PageHeader'

export default function OfflinePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ viewTransitionName: 'offline-page' }}
    >
      <PageHeader title="Offline" />
      <OfflineFallback />
    </motion.main>
  )
}
