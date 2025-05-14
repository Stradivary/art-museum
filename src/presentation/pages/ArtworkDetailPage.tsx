"use client"

import { Suspense } from "react"
import { useParams } from "react-router"
import { ArtworkDetailContent } from "../components/features/artwork/ArtworkDetailContent"

/**
 * Artwork detail page container component
 */
export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) return null

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <ArtworkDetailContent id={id} />
    </Suspense>
  )
}