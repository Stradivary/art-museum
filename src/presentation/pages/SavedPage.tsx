'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { SavedPageContent } from '../components/features/saved/SavedPageContent'
import { PageHeader } from '../components/shared/PageHeader'
import { ContentLoadingFallback } from '../components/shared/Loading'

/**
 * Saved artworks page container component
 */
export default function SavedPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ viewTransitionName: 'saved-page' }}
    >
      <PageHeader title="Saved Artworks" />

      <div className="mx-auto max-w-7xl p-4">
        <Suspense
          fallback={<ContentLoadingFallback text="Loading saved artworks..." />}
        >
          <SavedPageContent />
        </Suspense>
      </div>
    </motion.main>
  )
}
