"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { type Artwork } from "@/core/domain/entities/Artwork"
import { useSavedArtworkViewModel } from "../../../viewmodels/SavedArtworkViewModel"
import { usePrefetchArtworkViewModel } from "../../../viewmodels/ArtworkDetailViewModel"
import { useNavigate } from "react-router"
import Image from "../../shared/Image"

interface ArtworkCardProps {
  artwork: Artwork
  index: number
}

/**
 * Card component to display an artwork thumbnail and basic info
 */
export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { isArtworkSaved, saveArtwork, removeSavedArtwork } = useSavedArtworkViewModel()
  const isSaved = isArtworkSaved(artwork.id)
  const { prefetchArtwork } = usePrefetchArtworkViewModel()
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()

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
    })
  }

  return (
    <motion.div
      className="group relative h-full overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
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
                alt={artwork.title || "Artwork"}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
                style={{
                  viewTransitionName: "artwork-image-" + artwork.id,
                }}
                onLoadingComplete={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 p-4 text-center">
              <p className="text-sm text-gray-500">No image available</p>
            </div>
          )}

          {/* Save button overlay */}
          <button
            onClick={handleSaveClick}
            className={`absolute right-2 top-2 rounded-full p-2 transition-all duration-200 ${isSaved ? "bg-[#a20000] text-white" : "bg-white/80 text-gray-700 opacity-0 group-hover:opacity-100"
              }`}
            aria-label={isSaved ? "Unsave artwork" : "Save artwork"}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-white" : ""}`} />
          </button>
        </div>

        <div className="p-3">
          <h2 className="line-clamp-1 font-medium">{artwork.title}</h2>
          <p className="line-clamp-1 text-sm text-gray-600">{artwork.artist_title || "Unknown artist"}</p>
          {artwork.date_display && <p className="mt-1 text-xs text-gray-500">{artwork.date_display}</p>}
        </div>
      </div>
    </motion.div>
  )
}