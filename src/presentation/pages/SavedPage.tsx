'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { SavedPageContent } from '../components/features/saved/SavedPageContent'

/**
 * Saved artworks page container component
 */
export default function SavedPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto max-w-7xl p-4">
        <motion.h1
          className="mb-4 text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Saved Artworks
        </motion.h1>

        <Suspense
          fallback={
            <div className="flex h-40 w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
            </div>
          }
        >
          <SavedPageContent />
        </Suspense>
      </div>
    </motion.main>
  )
}
