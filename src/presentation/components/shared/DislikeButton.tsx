'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsDown, Loader2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { type Artwork } from '@/core/domain/entities/Artwork'
import { useDislikedArtworkViewModel } from '../../viewmodels/DislikedArtworkViewModel'
import { cn } from '@/lib/utils'

interface DislikeButtonProps {
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
  isDisliked: boolean
  showLabel: boolean
  hasAnimated: boolean
}

/**
 * Loading state component
 */
function LoadingContent({
  isDisliked,
  showLabel,
}: {
  isDisliked: boolean
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
          {isDisliked ? 'Removing...' : 'Disliking...'}
        </motion.span>
      )}
    </motion.div>
  )
}

/**
 * Thumbs down icon with animation
 */
function ThumbsDownIcon({
  isDisliked,
  hasAnimated,
}: {
  isDisliked: boolean
  hasAnimated: boolean
}) {
  return (
    <motion.div
      animate={{
        rotate: hasAnimated && isDisliked ? [0, -10, 10, 0] : 0,
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <ThumbsDown
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isDisliked ? 'fill-current' : ''
        )}
      />
    </motion.div>
  )
}

/**
 * Button label component
 */
function ButtonLabel({ isDisliked }: { isDisliked: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="font-medium"
    >
      {isDisliked ? 'Disliked' : 'Dislike'}
    </motion.span>
  )
}

/**
 * Normal state content
 */
function NormalContent({
  isLoading,
  isDisliked,
  showLabel,
  hasAnimated,
}: ButtonContentProps) {
  if (isLoading) {
    return <LoadingContent isDisliked={isDisliked} showLabel={showLabel} />
  }

  return (
    <motion.div
      key="normal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2"
    >
      <ThumbsDownIcon isDisliked={isDisliked} hasAnimated={hasAnimated} />
      {showLabel && <ButtonLabel isDisliked={isDisliked} />}
    </motion.div>
  )
}

/**
 * Button content with animation support
 */
function ButtonContent(props: ButtonContentProps) {
  return (
    <AnimatePresence mode="wait">
      <NormalContent {...props} />
    </AnimatePresence>
  )
}

/**
 * Reusable Dislike Button component with smooth animations and multiple modes
 */
export function DislikeButton({
  artwork,
  mode = 'default',
  className = '',
  artworkId,
  showLabel = true,
  size = 'sm',
  variant = 'default',
}: Readonly<DislikeButtonProps>) {
  const { isArtworkDisliked, dislikeArtwork, removeDislikedArtwork } =
    useDislikedArtworkViewModel()
  const [isLoading, setIsLoading] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const isDisliked = isArtworkDisliked(artwork.id)
  const transitionName = artworkId
    ? `artwork-dislike-button-${artworkId}`
    : `dislike-button-${artwork.id}`

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    setHasAnimated(true)

    try {
      if (isDisliked) {
        await removeDislikedArtwork(artwork.id)
      } else {
        await dislikeArtwork(artwork)
      }
    } catch (error) {
      console.error('Error toggling dislike state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-sm'
      case 'lg':
        return 'h-12 px-6 text-base'
      default:
        return 'h-10 px-4'
    }
  }

  if (mode === 'compact') {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        size="icon"
        className={cn(
          'bg-card/90 h-8 w-8 rounded-full border-gray-200 shadow-sm backdrop-blur-sm',
          'hover:bg-card hover:border-gray-300 hover:shadow-md',
          'transition-all duration-200',
          isDisliked && 'border-red-200 bg-red-50 text-red-600',
          className
        )}
        style={{
          viewTransitionName: transitionName,
        }}
        aria-label={isDisliked ? 'Remove dislike' : 'Dislike artwork'}
      >
        <ButtonContent
          isLoading={isLoading}
          isDisliked={isDisliked}
          showLabel={false}
          hasAnimated={hasAnimated}
        />
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={cn(
        getButtonSize(),
        'transition-all duration-200',
        isDisliked
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'hover:border-red-200 hover:bg-red-50 hover:text-red-600',
        className
      )}
      style={{
        viewTransitionName: transitionName,
      }}
      aria-label={isDisliked ? 'Remove dislike' : 'Dislike artwork'}
    >
      <ButtonContent
        isLoading={isLoading}
        isDisliked={isDisliked}
        showLabel={showLabel}
        hasAnimated={hasAnimated}
      />
    </Button>
  )
}
