'use client'

import { Suspense } from 'react'
import { useParams } from 'react-router'
import { ArtworkDetailContent } from '../components/features/artwork/ArtworkDetailContent'
import { PageHeader } from '../components/shared/PageHeader'
import { PageLoadingFallback } from '../components/shared/Loading'

/**
 * Artwork detail page container component
 */
export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) return null

  return (
    <div style={{ viewTransitionName: 'artwork-detail-page' }}>
      <PageHeader title="Artwork Details" showBackButton />

      <Suspense
        fallback={<PageLoadingFallback text="Loading artwork details..." />}
      >
        <ArtworkDetailContent id={id} />
      </Suspense>
    </div>
  )
}
