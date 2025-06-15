'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { type Artwork } from '@/core/domain/entities/Artwork'
import { usePrefetchArtworkViewModel } from '../../../viewmodels/ArtworkDetailViewModel'
import { useNavigate, useLocation } from 'react-router'
import Image from '../../shared/Image'
import { LikeButton } from '../../shared/LikeButton'
import { DislikeButton } from '../../shared/DislikeButton'
import { Badge } from '../../ui/badge'

interface ArtworkCardProps {
  artwork: Artwork
}

/**
 * Card component to display an artwork thumbnail and basic info
 */
export function ArtworkCard({ artwork }: Readonly<ArtworkCardProps>) {
  const [isLoading, setIsLoading] = useState(true)
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

  const handleCardClick = () => {
    navigate(`/artwork/${artwork.id}`, {
      viewTransition: true,
      state: { from: location.pathname },
    })
  }

  return (
    <motion.div
      className="bg-card border-border group relative h-full overflow-hidden rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-md"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      style={{
        viewTransitionName: `artwork-card-${artwork.id}`,
      }}
    >
      <div className="block h-full">
        <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
          {artwork.image_id ? (
            <>
              {isLoading && (
                <div className="bg-muted absolute inset-0 flex items-center justify-center">
                  <div className="bg-border dark:bg-border h-8 w-8 animate-pulse rounded-full"></div>
                </div>
              )}
              <Image
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`}
                alt={artwork.title ?? 'Artwork'}
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
            <div className="bg-muted flex h-full items-center justify-center p-4 text-center">
              <p className="text-muted-foreground text-sm">
                No image available
              </p>
            </div>
          )}

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex gap-1">
            <LikeButton
              artwork={artwork}
              variant="icon"
              artworkId={artwork.id.toString()}
              className="cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
            <DislikeButton
              artwork={artwork}
              variant="icon"
              artworkId={artwork.id.toString()}
              className="cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
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
            className="text-muted-foreground line-clamp-1 truncate text-sm"
            style={{
              viewTransitionName: 'artwork-artist-' + artwork.id,
            }}
            title={artwork.artist_title ?? 'Unknown artist'}
          >
            {artwork.artist_title ?? 'Unknown artist'}
          </p>
          {artwork.date_display && (
            <p
              className="text-muted-foreground mt-1 truncate text-xs"
              style={{
                viewTransitionName: 'artwork-date-' + artwork.id,
              }}
              title={artwork.date_display}
            >
              {artwork.date_display}
            </p>
          )}
          {/* Tags for filterable properties, compressed to 1 line with overflow as (n+) badge */}
          <div className="mt-2 flex flex-nowrap gap-1 overflow-hidden">
            {(() => {
              const tags = [
                artwork.department_title,
                artwork.artwork_type_title,
                artwork.place_of_origin,
                artwork.medium_display,
              ].filter(Boolean)
              const maxTags = 3
              const visibleTags = tags.slice(0, maxTags)
              const hiddenTags = tags.slice(maxTags)
              return (
                <>
                  {visibleTags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="max-w-[7rem] truncate"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {hiddenTags.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer select-none"
                      title={hiddenTags.join(', ')}
                    >
                      +{hiddenTags.length}
                    </Badge>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
