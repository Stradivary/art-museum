'use client'

import { motion } from 'framer-motion'
import { ProfilePageContent } from '../components/features/profile/ProfilePageContent'

export default function ProfilePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto max-w-7xl p-4">
        <motion.h1
          className="mb-6 text-2xl font-bold"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Profile
        </motion.h1>

        <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
          <ProfilePageContent />
        </div>
      </div>
    </motion.main>
  )
}
