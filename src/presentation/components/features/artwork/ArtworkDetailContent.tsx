'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Heart } from 'lucide-react'
import { useArtworkDetailViewModel } from '../../../viewmodels/ArtworkDetailViewModel'
import { useSavedArtworkViewModel } from '../../../viewmodels/SavedArtworkViewModel'
import { ArtworkDetailSkeleton } from './ArtworkDetailSkeleton'
import { SafeHtmlRenderer } from '../../shared/SafeHtmlRenderer'
import { useNavigate } from 'react-router'
import { Button } from '@/presentation/components/ui/button'
import Image from '../../shared/Image'

interface ArtworkDetailContentProps {
  id: string
}

/**
 * Component to display detailed information about an artwork
 */
export function ArtworkDetailContent({
  id,
}: Readonly<ArtworkDetailContentProps>) {
  const navigate = useNavigate()
  const { artwork, isLoading, error } = useArtworkDetailViewModel(
    Number.parseInt(id)
  )
  const { isArtworkSaved, saveArtwork, removeSavedArtwork } =
    useSavedArtworkViewModel()

  const isSaved = artwork ? isArtworkSaved(artwork.id) : false

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <p className="mb-4 text-red-500">Failed to load artwork</p>
        <Button onClick={() => navigate('..')}>Go Back</Button>
      </div>
    )
  }

  return (
    <motion.div
      className="mx-auto min-h-screen max-w-7xl pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="sticky top-0 z-10 flex items-center border-b bg-white p-4">
        <button
          onClick={() =>
            navigate('..', {
              viewTransition: true,
            })
          }
          className="flex items-center text-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span>Detail</span>
        </button>
      </div>

      {isLoading || !artwork ? (
        <ArtworkDetailSkeleton />
      ) : (
        <div>
          <div className="relative h-[40vh] w-full bg-gray-100">
            {artwork.image_id ? (
              <Image
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                alt={artwork.title ?? 'Artwork'}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  viewTransitionName: 'artwork-image-' + artwork.id,
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {artwork.credit_line ?? 'Credit information unavailable'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{artwork.title}</h1>
                <Button
                  onClick={() =>
                    isSaved
                      ? removeSavedArtwork(artwork.id)
                      : saveArtwork(artwork)
                  }
                  variant="destructive"
                  className="flex items-center gap-2 rounded-full px-4"
                >
                  <Heart className={isSaved ? 'fill-white' : ''} size={16} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              </div>

              {artwork.artist_title && (
                <p className="text-lg text-gray-700">{artwork.artist_title}</p>
              )}
              {artwork.date_display && (
                <p className="text-gray-600">{artwork.date_display}</p>
              )}

              <section>
                <h2 className="text-lg font-bold">Description</h2>
                {artwork.description ? (
                  <SafeHtmlRenderer
                    html={artwork.description}
                    className="prose prose-sm max-w-none text-gray-700"
                  />
                ) : (
                  <p className="text-gray-700">No description available.</p>
                )}
              </section>

              {artwork.provenance_text && (
                <section>
                  <h2 className="text-lg font-bold">Provenance</h2>
                  <SafeHtmlRenderer
                    html={artwork.provenance_text}
                    className="prose prose-sm max-w-none text-gray-700"
                  />
                </section>
              )}

              {artwork.publication_history && (
                <section>
                  <h2 className="text-lg font-bold">Publication History</h2>
                  <SafeHtmlRenderer
                    html={artwork.publication_history}
                    className="prose prose-sm max-w-none text-gray-700"
                  />
                </section>
              )}

              {artwork.exhibition_history && (
                <section>
                  <h2 className="text-lg font-bold">Exhibition History</h2>
                  <SafeHtmlRenderer
                    html={artwork.exhibition_history}
                    className="prose prose-sm max-w-none text-gray-700"
                  />
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
