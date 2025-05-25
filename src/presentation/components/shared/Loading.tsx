'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
  text?: string
}

/**
 * Reusable loading spinner component with consistent styling
 */
export function LoadingSpinner({
  size = 'md',
  className = '',
  fullScreen = false,
  text,
}: Readonly<LoadingSpinnerProps>) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const containerClasses = fullScreen
    ? 'flex h-screen items-center justify-center'
    : 'flex items-center justify-center'

  return (
    <motion.div
      className={`${containerClasses} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-t-2 border-b-2 border-gray-900`}
        />
        {text && (
          <motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Page-level loading component
 */
export function PageLoadingFallback({
  text = 'Loading...',
}: Readonly<{
  text?: string
}>) {
  return <LoadingSpinner fullScreen size="lg" text={text} />
}

/**
 * Content-level loading component
 */
export function ContentLoadingFallback({ text }: Readonly<{ text?: string }>) {
  return (
    <div className="flex h-40 w-full items-center justify-center">
      <LoadingSpinner size="md" text={text} />
    </div>
  )
}

/**
 * Skeleton loading for search bar
 */
export function SearchBarSkeleton() {
  return (
    <motion.div
      className="h-10 w-full animate-pulse rounded-full bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}
