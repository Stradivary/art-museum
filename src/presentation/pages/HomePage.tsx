'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { HomePageContent } from '../components/features/home/HomePageContent'

/**
 * Home page container component
 */
export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto max-w-7xl p-4">
        <motion.h1
          className="mb-4 text-2xl font-bold"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Art Institute of Chicago
        </motion.h1>

        <Suspense
          fallback={
            <div className="h-10 w-full animate-pulse rounded-full bg-gray-100"></div>
          }
        >
          <HomePageContent />
        </Suspense>
      </div>
    </motion.main>
  )
}
