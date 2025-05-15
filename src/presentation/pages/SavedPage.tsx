"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { SavedPageContent } from "../components/features/saved/SavedPageContent"

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
      <div className="p-4 max-w-7xl mx-auto">
        <motion.h1
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Saved Artworks
        </motion.h1>

        <Suspense fallback={
          <div className="h-40 w-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        }>
          <SavedPageContent />
        </Suspense>
      </div>
    </motion.main>
  )
}