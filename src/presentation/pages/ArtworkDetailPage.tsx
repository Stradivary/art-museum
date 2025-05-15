'use client'

import { Suspense } from 'react'
import { useParams } from 'react-router'
import { ArtworkDetailContent } from '../components/features/artwork/ArtworkDetailContent'

/**
 * Artwork detail page container component
 */
export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) return null

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <ArtworkDetailContent id={id} />
    </Suspense>
  )
}
