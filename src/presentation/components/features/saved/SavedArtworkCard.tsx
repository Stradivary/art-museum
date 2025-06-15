'use client'

import { type SavedArtwork } from '@/core/domain/entities/Artwork'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { usePrefetchArtworkViewModel } from '../../../viewmodels/ArtworkDetailViewModel'
import { AnimatedButton } from '../../shared/AnimatedButton'
import Image from '../../shared/Image'

interface SavedArtworkCardProps {
  artwork: SavedArtwork
  onDelete: () => void
}

/**
 * Card component for displaying and managing saved artworks
 */
export function SavedArtworkCard({
  artwork,
  onDelete,
}: Readonly<SavedArtworkCardProps>) {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const { prefetchArtwork } = usePrefetchArtworkViewModel()
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Prefetch artwork details on hover for better UX
  useEffect(() => {
    if (isHovering) {
      prefetchArtwork(artwork.id)
    }
  }, [isHovering, artwork.id, prefetchArtwork])

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleting(true)

    // Add a small delay for the animation
    setTimeout(() => {
      onDelete()
    }, 200)
  }

  const handleCardClick = () => {
    navigate(`/artwork/${artwork.id}`, {
      viewTransition: true,
      state: { from: location.pathname },
    })
  }

  if (isDeleting) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      />
    )
  }

  return (
    <motion.div
      className="bg-card dark:bg-card border-border dark:border-border group relative overflow-hidden rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-md"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      style={{
        viewTransitionName: `artwork-card-${artwork.id}`,
      }}
    >
      <div className="block">
        <div className="bg-muted dark:bg-muted relative aspect-[3/4] w-full overflow-hidden">
          {artwork.image_id ? (
            <>
              {isLoading && (
                <div className="bg-muted dark:bg-muted absolute inset-0 flex items-center justify-center">
                  {/* Optionally add a loading spinner here */}
                </div>
              )}
              <Image
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                alt={artwork.title ?? t('saved.noImageAlt', 'Artwork')}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={`object-cover transition-all duration-200 hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  viewTransitionName: 'artwork-image-' + artwork.id,
                }}
                draggable="false"
                onLoadingComplete={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="bg-muted dark:bg-muted flex h-full items-center justify-center p-4 text-center">
              <p className="text-muted-foreground text-sm">
                {t('saved.noImage', 'No image available')}
              </p>
            </div>
          )}

          <div className="absolute top-2 right-2 flex gap-1">
            <AnimatedButton
              icon={Trash2}
              isActive={false} // Always false since it's not a toggle
              onClick={handleDelete}
              activeLabel="" // Not used since isActive is always false
              inactiveLabel={t('delete.label', 'Delete')}
              loadingActiveLabel="" // Not used
              loadingInactiveLabel={t('delete.deleting', 'Deleting...')}
              variant="icon"
              className={`border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700`}
              aria-label={t('delete.aria', 'Delete item')}
            />
          </div>
        </div>

        <div className="cursor-pointer p-3">
          <h2
            className="text-foreground line-clamp-1 font-medium"
            style={{
              viewTransitionName: 'artwork-title-' + artwork.id,
            }}
          >
            {artwork.title}
          </h2>
          <p
            className="text-muted-foreground line-clamp-1 text-sm"
            style={{
              viewTransitionName: 'artwork-artist-' + artwork.id,
            }}
          >
            {artwork.artist_title ?? t('saved.unknownArtist', 'Unknown artist')}
          </p>
          {artwork.date_display && (
            <p
              className="text-muted-foreground mt-1 text-xs"
              style={{
                viewTransitionName: 'artwork-date-' + artwork.id,
              }}
            >
              {artwork.date_display}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
