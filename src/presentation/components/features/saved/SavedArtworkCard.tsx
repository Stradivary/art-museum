'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { type SavedArtwork } from '@/core/domain/entities/Artwork'
import { usePrefetchArtworkViewModel } from '../../../viewmodels/ArtworkDetailViewModel'
import { useNavigate, useLocation } from 'react-router'
import Image from '../../shared/Image'
import { Button } from '@/presentation/components/ui/button'
import { useTranslation } from 'react-i18next'

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
        viewTransitionName: 'artwork-card-' + artwork.id,
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
                className={`object-cover transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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

          {/* Delete button overlay */}
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="icon"
            className="bg-card dark:bg-card hover:bg-accent absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-label={t('saved.deleteAria', 'Delete saved artwork')}
          >
            <Trash2 className="text-primary h-4 w-4" />
          </Button>
        </div>

        <div className="p-3">
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
