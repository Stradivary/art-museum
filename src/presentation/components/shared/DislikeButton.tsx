import type { Artwork } from '@/core/domain/entities/Artwork'
import { useDislikedArtworkViewModel } from '@/presentation/viewmodels/DislikedArtworkViewModel'
import { ThumbsDown } from 'lucide-react'
import { AnimatedButton } from './AnimatedButton'
import { useTranslation } from 'react-i18next'

interface DislikeButtonProps {
  artwork: Artwork
  variant?: 'icon' | 'labeled'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  artworkId?: string
}

/**
 * Dislike Button using AnimatedButton
 */
export function DislikeButton({
  artwork,
  variant = 'labeled',
  size = 'md',
  className = '',
  artworkId,
}: DislikeButtonProps) {
  const { t } = useTranslation()
  const { isArtworkDisliked, dislikeArtwork, removeDislikedArtwork } =
    useDislikedArtworkViewModel()

  const isDisliked = isArtworkDisliked(artwork.id)
  const transitionName = artworkId
    ? `artwork-dislike-button-${artworkId}`
    : `dislike-button-${artwork.id}`

  const handleClick = async () => {
    if (isDisliked) {
      await removeDislikedArtwork(artwork.id)
    } else {
      await dislikeArtwork(artwork)
    }
  }

  return (
    <AnimatedButton
      icon={ThumbsDown}
      isActive={isDisliked}
      onClick={handleClick}
      activeLabel={t('dislikeButton.saved', 'Disliked')}
      inactiveLabel={t('dislikeButton.save', 'Dislike')}
      loadingActiveLabel={t('dislikeButton.removing', 'Removing...')}
      loadingInactiveLabel={t('dislikeButton.saving', 'Disliking...')}
      variant={variant}
      size={size}
      className={className}
      aria-label={
        isDisliked
          ? t('dislikeButton.removeAria', 'Remove from dislikes')
          : t('dislikeButton.saveAria', 'Dislike artwork')
      }
      viewTransitionName={transitionName}
    />
  )
}
