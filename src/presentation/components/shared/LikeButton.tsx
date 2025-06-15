'use client'

import { type Artwork } from '@/core/domain/entities/Artwork'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSavedArtworkViewModel } from '../../viewmodels/SavedArtworkViewModel'
import { AnimatedButton } from './AnimatedButton'

interface LikeButtonProps {
  artwork: Artwork
  variant?: 'icon' | 'labeled'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  artworkId?: string
}
/**
 * Like Button using AnimatedButton
 */
export function LikeButton({
  artwork,
  variant = 'labeled',
  size = 'md',
  className = '',
  artworkId,
}: LikeButtonProps) {
  const { isArtworkSaved, saveArtwork, removeSavedArtwork } =
    useSavedArtworkViewModel()
  const { t } = useTranslation()

  const isSaved = isArtworkSaved(artwork.id)
  const transitionName = artworkId
    ? `artwork-save-button-${artworkId}`
    : `save-button-${artwork.id}`

  const handleClick = async () => {
    if (isSaved) {
      await removeSavedArtwork(artwork.id)
    } else {
      await saveArtwork(artwork)
    }
  }

  return (
    <AnimatedButton
      icon={Heart}
      isActive={isSaved}
      onClick={handleClick}
      activeLabel={t('likeButton.saved', 'Saved')}
      inactiveLabel={t('likeButton.save', 'Save')}
      loadingActiveLabel={t('likeButton.removing', 'Removing...')}
      loadingInactiveLabel={t('likeButton.saving', 'Saving...')}
      variant={variant}
      size={size}
      className={className}
      aria-label={
        isSaved
          ? t('likeButton.removeAria', 'Remove from saved artworks')
          : t('likeButton.saveAria', 'Save artwork')
      }
      viewTransitionName={transitionName}
    />
  )
}
