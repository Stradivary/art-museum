'use client'

import { motion } from 'framer-motion'
import { ProfilePageContent } from '../components/features/profile/ProfilePageContent'
import { PageHeader } from '../components/shared/PageHeader'

export default function ProfilePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ viewTransitionName: 'profile-page' }}
    >
      <PageHeader title="Profile" />

      <div className="mx-auto max-w-7xl p-4">
        <div className="bg-background space-y-6 rounded-lg p-6">
          <ProfilePageContent />
        </div>
      </div>
    </motion.main>
  )
}
