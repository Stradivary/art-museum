"use client"

import { motion } from 'framer-motion'
import { ProfilePageContent } from '../components/features/profile/ProfilePageContent'

export default function ProfilePage() {

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 max-w-7xl mx-auto">
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Profile
        </motion.h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <ProfilePageContent />
        </div>
      </div>
    </motion.main>
  )
}
