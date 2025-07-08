'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, type LucideIcon } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps {
  icon: LucideIcon
  isActive: boolean
  onClick?: (e: React.MouseEvent) => void | Promise<void>

  // Labels
  activeLabel?: string
  inactiveLabel?: string
  loadingActiveLabel?: string
  loadingInactiveLabel?: string

  // Variants
  variant?: 'icon' | 'labeled'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'

  // Styling
  className?: string
  disabled?: boolean

  // Accessibility
  'aria-label'?: string

  // Animation
  viewTransitionName?: string
}

interface ButtonContentProps {
  icon: LucideIcon
  isLoading: boolean
  isActive: boolean
  showLabel: boolean
  hasAnimated: boolean
  activeLabel?: string
  inactiveLabel?: string
  loadingActiveLabel?: string
  loadingInactiveLabel?: string
}

/**
 * Loading state component
 */
function LoadingContent({
  isActive,
  showLabel,
  loadingActiveLabel,
  loadingInactiveLabel,
}: {
  isActive: boolean
  showLabel: boolean
  loadingActiveLabel?: string
  loadingInactiveLabel?: string
}) {
  const loadingText = isActive
    ? loadingActiveLabel || 'Loading...'
    : loadingInactiveLabel || 'Loading...'

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2"
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-medium"
        >
          {loadingText}
        </motion.span>
      )}
    </motion.div>
  )
}

/**
 * Animated icon component
 */
function AnimatedIcon({
  icon: Icon,
  isActive,
  hasAnimated,
}: {
  icon: LucideIcon
  isActive: boolean
  hasAnimated: boolean
}) {
  return (
    <motion.div
      animate={{
        rotate: hasAnimated && isActive ? [0, -10, 10, 0] : 0,
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Icon
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isActive ? 'fill-current' : ''
        )}
      />
    </motion.div>
  )
}

/**
 * Button label component
 */
function ButtonLabel({
  isActive,
  activeLabel,
  inactiveLabel,
}: {
  isActive: boolean
  activeLabel?: string
  inactiveLabel?: string
}) {
  const label = isActive ? activeLabel || 'Active' : inactiveLabel || 'Inactive'

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="font-medium"
    >
      {label}
    </motion.span>
  )
}

/**
 * Normal state content
 */
function NormalContent({
  icon,
  isActive,
  showLabel,
  hasAnimated,
  activeLabel,
  inactiveLabel,
}: {
  icon: LucideIcon
  isActive: boolean
  showLabel: boolean
  hasAnimated: boolean
  activeLabel?: string
  inactiveLabel?: string
}) {
  return (
    <motion.div
      key={isActive ? 'active' : 'inactive'}
      initial={{
        opacity: 0,
        x: showLabel ? -10 : 0,
        scale: showLabel ? 1 : 0.8,
      }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: showLabel ? 10 : 0,
        scale: showLabel ? 1 : 0.8,
      }}
      transition={{ duration: 0.2 }}
      className={showLabel ? 'flex items-center gap-2' : ''}
    >
      <AnimatedIcon icon={icon} isActive={isActive} hasAnimated={hasAnimated} />
      {showLabel && (
        <ButtonLabel
          isActive={isActive}
          activeLabel={activeLabel}
          inactiveLabel={inactiveLabel}
        />
      )}
    </motion.div>
  )
}

/**
 * Animated button content
 */
function ButtonContent({
  icon,
  isLoading,
  isActive,
  showLabel,
  hasAnimated,
  activeLabel,
  inactiveLabel,
  loadingActiveLabel,
  loadingInactiveLabel,
}: ButtonContentProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingContent
          isActive={isActive}
          showLabel={showLabel}
          loadingActiveLabel={loadingActiveLabel}
          loadingInactiveLabel={loadingInactiveLabel}
        />
      ) : (
        <NormalContent
          icon={icon}
          isActive={isActive}
          showLabel={showLabel}
          hasAnimated={hasAnimated}
          activeLabel={activeLabel}
          inactiveLabel={inactiveLabel}
        />
      )}
    </AnimatePresence>
  )
}

/**
 * Get theme-based styling
 */
function getThemeStyles() {
  return {
    active:
      'bg-primary text-white border-primary hover:bg-primary/90 shadow-lg dark:bg-primary/80 hover:text-primary-foreground dark:text-white dark:border-primary/80 dark:hover:bg-primary/90 dark:hover:border-primary/80 dark:shadow-lg',
    inactive:
      'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-lg dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:shadow-lg',
  }
}

/**
 * Get size-based styling
 */
function getSizeStyles(size: 'sm' | 'md' | 'lg', variant: 'icon' | 'labeled') {
  const sizes = {
    sm: variant === 'icon' ? 'h-8 w-8' : 'h-8 px-3 text-sm',
    md: variant === 'icon' ? 'h-9 w-9' : 'h-9 px-4 text-sm',
    lg: variant === 'icon' ? 'h-10 w-10' : 'h-10 px-6 text-base',
  }

  return sizes[size]
}

/**
 * Reusable Animated Button component with consistent styling and smooth animations
 */
export function AnimatedButton({
  icon,
  isActive,
  onClick,
  activeLabel,
  inactiveLabel,
  loadingActiveLabel,
  loadingInactiveLabel,
  variant = 'labeled',
  size = 'md',
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
  viewTransitionName,
}: AnimatedButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading || disabled) return

    setIsLoading(true)
    setHasAnimated(true)

    try {
      await onClick?.(e)
    } catch (error) {
      console.error('Error in animated button click:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const themeStyles = getThemeStyles()
  const sizeStyles = getSizeStyles(size, variant)
  const showLabel = variant === 'labeled'

  const buttonStyles = cn(
    'rounded-full border transition-all duration-200',
    isActive ? themeStyles.active : themeStyles.inactive,
    sizeStyles,
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  const defaultAriaLabel = isActive
    ? activeLabel || 'Active'
    : inactiveLabel || 'Inactive'

  const animationScaleAnimated = variant === 'icon' ? [1, 1.2, 1] : [1, 1.05, 1]

  return (
    <motion.div
      initial={false}
      animate={{
        scale: hasAnimated ? animationScaleAnimated : 1,
      }}
      transition={{
        duration: variant === 'icon' ? 0.3 : 0.4,
        ease: 'easeInOut',
      }}
      style={{
        viewTransitionName,
      }}
    >
      <Button
        onClick={handleClick}
        disabled={isLoading || disabled}
        variant="outline"
        size={variant === 'icon' ? 'icon' : size}
        className={buttonStyles}
        aria-label={ariaLabel || defaultAriaLabel}
      >
        <ButtonContent
          icon={icon}
          isLoading={isLoading}
          isActive={isActive}
          showLabel={showLabel}
          hasAnimated={hasAnimated}
          activeLabel={activeLabel}
          inactiveLabel={inactiveLabel}
          loadingActiveLabel={loadingActiveLabel}
          loadingInactiveLabel={loadingInactiveLabel}
        />
      </Button>
    </motion.div>
  )
}
