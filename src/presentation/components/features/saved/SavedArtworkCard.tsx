'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { type SavedArtwork } from '@/core/domain/entities/Artwork'
import { usePrefetchArtworkViewModel } from '../../../viewmodels/ArtworkDetailViewModel'
import { useNavigate, useLocation } from 'react-router'
import Image from '../../shared/Image'
import { Button } from '@/presentation/components/ui/button'

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
      className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      style={{
        viewTransitionName: 'artwork-card-' + artwork.id,
      }}
    >
      <div className="block">
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

          {/* Delete button overlay */}
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white/80"
            aria-label="Delete saved artwork"
          >
            <Trash2 className="text-primary h-4 w-4" />
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
