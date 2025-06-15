'use client'

import { shouldShowOfflineFallback } from '@/lib/networkUtils'
import { Button } from '@/presentation/components/ui/button'
import { useRegisterTeachingTip } from '@/presentation/hooks/useRegisterTeachingTip'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { useArtworkDetailViewModel } from '../../../viewmodels/ArtworkDetailViewModel'
import { ImageViewer } from '../../shared/ImageViewer'
import { LikeButton } from '../../shared/LikeButton'
import { SafeHtmlRenderer } from '../../shared/SafeHtmlRenderer'
import { OfflineFallback } from '../OfflineFallback'
import { ArtworkDetailSkeleton } from './ArtworkDetailSkeleton'
import { TeachingTipProvider } from '../../shared/teachingTip'

interface ArtworkDetailContentProps {
  id: string
}

/**
 * Component to display detailed information about an artwork
 */
export function ArtworkDetailContent({
  id,
}: Readonly<ArtworkDetailContentProps>) {
  // // Register teaching tip for artwork detail page
  // const detailTip = useRegisterTeachingTip<HTMLDivElement>({
  //   id: 'artwork-detail',
  //   title: 'Artwork Details & Actions',
  //   description:
  //     'This page shows the selected artwork with its image, title, artist, year, and more. You can zoom the image, mark as favorite, and explore additional information below.',
  //   position: 'top',
  // })
  // Register teaching tip for image zoom button
  const imageZoomTip = useRegisterTeachingTip<HTMLButtonElement>({
    id: 'artwork-image-zoom',
    title: 'Zoom Artwork Image',
    description:
      'Click this button to open the image viewer. In the viewer, you can zoom, rotate, pan, and view the artwork in fullscreen.',
    position: 'bottom',
  })
  // Register teaching tip for favorite button
  const favoriteTip = useRegisterTeachingTip<HTMLButtonElement>({
    id: 'artwork-favorite',
    title: 'Favorite Artwork',
    description:
      'Click the heart button to add or remove this artwork from your favorites. You can view your favorites in your profile.',
    position: 'left',
  })

  const navigate = useNavigate()
  const { artwork, isLoading, error } = useArtworkDetailViewModel(
    Number.parseInt(id)
  )

  // Show offline fallback if we have a network error and no cached data
  if (shouldShowOfflineFallback(error, !!artwork)) {
    return <OfflineFallback />
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <p className="mb-4 text-red-500">Failed to load artwork</p>
        <Button onClick={() => navigate('..')} variant="outline">
          Go Back
        </Button>
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
      style={{
        viewTransitionName: artwork ? 'artwork-card-' + artwork.id : undefined,
      }}
    >
      {isLoading || !artwork ? (
        <ArtworkDetailSkeleton />
      ) : (
        <div>
          <div className="bg-muted relative h-[50vh] w-full">
            {artwork.image_id ? (
              <span
                ref={imageZoomTip.ref}
                data-teaching-tip-id="artwork-image-zoom"
              >
                <TeachingTipProvider>
                  <ImageViewer
                    src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                    alt={artwork.title ?? 'Artwork'}
                    className="h-full w-full object-contain"
                    style={{
                      viewTransitionName: 'artwork-image-' + artwork.id,
                    }}
                  />
                </TeachingTipProvider>
              </span>
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
                <h1
                  className="text-2xl font-bold"
                  style={{
                    viewTransitionName: 'artwork-title-' + artwork.id,
                  }}
                >
                  {artwork.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    ref={favoriteTip.ref}
                    data-teaching-tip-id="artwork-favorite"
                  >
                    <LikeButton
                      artwork={artwork}
                      variant="labeled"
                      size="lg"
                      artworkId={artwork.id.toString()}
                      className="px-6"
                    />
                  </span>
                  {/* <DislikeButton
                    artwork={artwork}
                    mode="default"
                    size="lg"
                    artworkId={artwork.id.toString()}
                    className="px-6"
                  /> */}
                </div>
              </div>

              {artwork.artist_title && (
                <p
                  className="text-lg text-gray-700"
                  style={{
                    viewTransitionName: 'artwork-artist-' + artwork.id,
                  }}
                >
                  {artwork.artist_title}
                </p>
              )}
              {artwork.date_display && (
                <p
                  className="text-gray-600"
                  style={{
                    viewTransitionName: 'artwork-date-' + artwork.id,
                  }}
                >
                  {artwork.date_display}
                </p>
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
