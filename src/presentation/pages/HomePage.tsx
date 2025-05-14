"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { HomePageContent } from "../components/features/home/HomePageContent"

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
      <div className="p-4 max-w-7xl mx-auto">
        <motion.h1
          className="text-2xl font-bold mb-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Art Institute of Chicago
        </motion.h1>

        <Suspense fallback={
          <div className="h-10 w-full bg-gray-100 animate-pulse rounded-full"></div>
        }>
          <HomePageContent />
        </Suspense>
      </div>
    </motion.main>
  )
}