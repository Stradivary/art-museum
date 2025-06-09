'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { HomePageContent } from '../components/features/home/HomePageContent'
import { PageHeader } from '../components/shared/PageHeader'
import { SearchBarSkeleton } from '../components/shared/Loading'
/**
 * Home page container component
 */
export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ viewTransitionName: 'home-page' }}
    >
      <PageHeader title="Art Institute of Chicago" />

      <div className="mx-auto max-w-7xl p-4">
        <Suspense fallback={<SearchBarSkeleton />}>
          <HomePageContent />
        </Suspense>
      </div>
    </motion.main>
  )
}
