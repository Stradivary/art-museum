'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { type Artwork } from '@/core/domain/entities/Artwork'
import { useSavedArtworkViewModel } from '../../../viewmodels/SavedArtworkViewModel'
import { usePrefetchArtworkViewModel } from '../../../viewmodels/ArtworkDetailViewModel'
import { useNavigate, useLocation } from 'react-router'
import Image from '../../shared/Image'
import { Button } from '@/presentation/components/ui/button'

interface ArtworkCardProps {
  artwork: Artwork
}

/**
 * Card component to display an artwork thumbnail and basic info
 */
export function ArtworkCard({ artwork }: Readonly<ArtworkCardProps>) {
  const [isLoading, setIsLoading] = useState(true)
  const { isArtworkSaved, saveArtwork, removeSavedArtwork } =
    useSavedArtworkViewModel()
  const isSaved = isArtworkSaved(artwork.id)
  const { prefetchArtwork } = usePrefetchArtworkViewModel()
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Prefetch artwork details on hover for better UX
  useEffect(() => {
    if (isHovering) {
      prefetchArtwork(artwork.id)
    }
  }, [isHovering, artwork.id, prefetchArtwork])

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSaved) {
      removeSavedArtwork(artwork.id)
    } else {
      saveArtwork(artwork)
    }
  }

  const handleCardClick = () => {
    navigate(`/artwork/${artwork.id}`, {
      viewTransition: true,
      state: { from: location.pathname },
    })
  }

  return (
    <motion.div
      className="group relative h-full overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      style={{
        viewTransitionName: 'artwork-card-' + artwork.id,
      }}
    >
      <div className="block h-full">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          {artwork.image_id ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                </div>
              )}
              <Image
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                alt={artwork.title ?? 'Artwork'}
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
            <div className="flex h-full items-center justify-center bg-gray-100 p-4 text-center">
              <p className="text-sm text-gray-500">No image available</p>
            </div>
          )}

          {/* Save button overlay */}
          <Button
            onClick={handleSaveClick}
            variant={isSaved ? 'destructive' : 'ghost'}
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full transition-all duration-200 ${
              isSaved
                ? ''
                : 'bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-white/90'
            }`}
            style={{
              viewTransitionName: 'artwork-save-button-' + artwork.id,
            }}
            aria-label={isSaved ? 'Unsave artwork' : 'Save artwork'}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
          </Button>
        </div>

        <div className="p-3">
          <h2
            className="line-clamp-1 font-medium"
            style={{
              viewTransitionName: 'artwork-title-' + artwork.id,
            }}
          >
            {artwork.title}
          </h2>
          <p
            className="line-clamp-1 text-sm text-gray-600"
            style={{
              viewTransitionName: 'artwork-artist-' + artwork.id,
            }}
          >
            {artwork.artist_title ?? 'Unknown artist'}
          </p>
          {artwork.date_display && (
            <p
              className="mt-1 text-xs text-gray-500"
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
