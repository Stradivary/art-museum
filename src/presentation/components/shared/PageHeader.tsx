'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '../ui/button'

interface PageHeaderProps {
  title: string
  showBackButton?: boolean
  onBackClick?: () => void
  children?: React.ReactNode
  className?: string
}

/**
 * Standardized page header component with view transitions
 */
export function PageHeader({
  title,
  showBackButton = false,
  onBackClick,
  children,
  className = '',
}: Readonly<PageHeaderProps>) {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <motion.header
      className={`sticky top-0 z-20 bg-gray-50/90 bg-white/95 backdrop-blur-sm ${className}`}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ viewTransitionName: 'page-header' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  aria-label="Go back"
                >
                  <ArrowLeft size={18} />
                </Button>
              </motion.div>
            )}

            <motion.h1
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              style={{
                viewTransitionName: `page-title-${title.toLowerCase().replace(/\s+/g, '-')}`,
              }}
            >
              {title}
            </motion.h1>
          </div>

          {children && (
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
