'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { type Artwork } from '@/core/domain/entities/Artwork'
import { useSavedArtworkViewModel } from '../../viewmodels/SavedArtworkViewModel'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  artwork: Artwork
  mode?: 'default' | 'compact'
  className?: string
  artworkId?: string
  showLabel?: boolean
  size?: 'sm' | 'lg' | 'default'
  variant?: 'default' | 'ghost' | 'outline'
}

interface ButtonContentProps {
  isLoading: boolean
  isSaved: boolean
  showLabel: boolean
  hasAnimated: boolean
}

/**
 * Loading state component
 */
function LoadingContent({
  isSaved,
  showLabel,
}: {
  isSaved: boolean
  showLabel: boolean
}) {
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
        >
          {isSaved ? 'Removing...' : 'Saving...'}
        </motion.span>
      )}
    </motion.div>
  )
}

/**
 * Heart icon with animation
 */
function HeartIcon({
  isSaved,
  hasAnimated,
}: {
  isSaved: boolean
  hasAnimated: boolean
}) {
  return (
    <motion.div
      animate={{
        rotate: hasAnimated && isSaved ? [0, -10, 10, 0] : 0,
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isSaved ? 'fill-current' : ''
        )}
      />
    </motion.div>
  )
}

/**
 * Button label component
 */
function ButtonLabel({ isSaved }: { isSaved: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="font-medium"
    >
      {isSaved ? 'Saved' : 'Save'}
    </motion.span>
  )
}

/**
 * Normal state content
 */
function NormalContent({
  isSaved,
  showLabel,
  hasAnimated,
}: {
  isSaved: boolean
  showLabel: boolean
  hasAnimated: boolean
}) {
  return (
    <motion.div
      key={isSaved ? 'saved' : 'unsaved'}
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
      <HeartIcon isSaved={isSaved} hasAnimated={hasAnimated} />
      {showLabel && <ButtonLabel isSaved={isSaved} />}
    </motion.div>
  )
}

/**
 * Animated button content for loading and saved states
 */
function ButtonContent({
  isLoading,
  isSaved,
  showLabel,
  hasAnimated,
}: ButtonContentProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingContent isSaved={isSaved} showLabel={showLabel} />
      ) : (
        <NormalContent
          isSaved={isSaved}
          showLabel={showLabel}
          hasAnimated={hasAnimated}
        />
      )}
    </AnimatePresence>
  )
}

/**
 * Reusable Like Button component with smooth animations and multiple modes
 */
export function LikeButton({
  artwork,
  mode = 'default',
  className = '',
  artworkId,
  showLabel = true,
  size = 'sm',
  variant = 'default',
}: Readonly<LikeButtonProps>) {
  const { isArtworkSaved, saveArtwork, removeSavedArtwork } =
    useSavedArtworkViewModel()
  const [isLoading, setIsLoading] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const isSaved = isArtworkSaved(artwork.id)
  const transitionName = artworkId
    ? `artwork-save-button-${artworkId}`
    : `save-button-${artwork.id}`

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    setHasAnimated(true)

    try {
      if (isSaved) {
        await removeSavedArtwork(artwork.id)
      } else {
        await saveArtwork(artwork)
      }
    } catch (error) {
      console.error('Error toggling save state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const buttonProps = {
    onClick: handleClick,
    disabled: isLoading,
    className: cn(
      'rounded-full transition-all duration-200',
      isSaved
        ? 'bg-red-600 text-white shadow-lg hover:bg-red-700'
        : 'border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:bg-gray-50 hover:text-red-600',
      className
    ),
  }

  if (mode === 'compact') {
    return (
      <motion.div
        initial={false}
        animate={{
          scale: hasAnimated ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        style={{
          viewTransitionName: transitionName,
        }}
      >
        <Button
          {...buttonProps}
          variant={isSaved ? 'destructive' : variant}
          size="icon"
          className={cn(buttonProps.className, 'h-8 w-8')}
          aria-label={isSaved ? 'Remove from saved' : 'Save artwork'}
        >
          <ButtonContent
            isLoading={isLoading}
            isSaved={isSaved}
            showLabel={false}
            hasAnimated={hasAnimated}
          />
        </Button>
      </motion.div>
    )
  }

  const sizeVariant = size === 'default' ? 'sm' : size

  return (
    <motion.div
      initial={false}
      animate={{
        scale: hasAnimated ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
      style={{
        viewTransitionName: transitionName,
      }}
    >
      <Button
        {...buttonProps}
        variant={isSaved ? 'destructive' : variant}
        size={sizeVariant}
        className={cn(buttonProps.className, 'flex items-center gap-2')}
        aria-label={isSaved ? 'Remove from saved artworks' : 'Save artwork'}
      >
        <ButtonContent
          isLoading={isLoading}
          isSaved={isSaved}
          showLabel={showLabel}
          hasAnimated={hasAnimated}
        />

        {/* Pulse effect on save */}
        {/* <AnimatePresence>
          {hasAnimated && isSaved && (
            <motion.div
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 rounded-full bg-red-400"
            />
          )}
        </AnimatePresence> */}
      </Button>
    </motion.div>
  )
}
