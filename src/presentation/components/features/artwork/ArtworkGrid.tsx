'use client'

import { motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { shouldShowOfflineFallback } from '@/lib/networkUtils'
import { OfflineFallback } from '../OfflineFallback'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import {
  useArtworkListViewModel,
  useArtworkSearchViewModel,
} from '../../../viewmodels/ArtworkViewModel'
import { ArtworkCard } from './ArtworkCard'
import { ArtworkCardSkeleton } from './ArtworkCardSkeleton'

interface ArtworkGridProps {
  searchQuery: string
  filters: ArtworkFilters
}

/**
 * Grid component to display artworks with infinite scrolling or search results
 */
export function ArtworkGrid({
  searchQuery,
  filters,
}: Readonly<ArtworkGridProps>) {
  // Get view models for list and search functionality
  const {
    artworks: listArtworks,
    isLoading: listLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ref,
    error: listError,
    hasData: listHasData,
  } = useArtworkListViewModel(filters)

  const {
    searchResults,
    isLoading: searchLoading,
    isEmpty,
    isSearching,
    error: searchError,
    hasData: searchHasData,
  } = useArtworkSearchViewModel(searchQuery, filters)

  // Determine which data to use based on search query
  const artworks = isSearching ? searchResults : listArtworks
  const isLoading = isSearching ? searchLoading : listLoading
  const error = isSearching ? searchError : listError
  const hasData = isSearching ? searchHasData : listHasData

  // Show offline fallback if we have a network error and no data
  if (shouldShowOfflineFallback(error, hasData)) {
    return <OfflineFallback />
  }

  // Always show skeletons during initial load
  if (isLoading && artworks.length === 0) {
    return (
      <div>
        {/* Header */}
        {(searchQuery || Object.keys(filters).length > 0) && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <ArtworkCardSkeleton key={`artwork-skeleton-${n}`} />
          ))}
        </div>
      </div>
    )
  }

  if (isEmpty ?? !artworks?.length) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-lg border border-dashed p-8 py-10 text-center"
      >
        <ImageOff className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="text-gray-500">No artworks found.</p>
        {isSearching && (
          <p className="mt-2 text-gray-500">Try a different search term.</p>
        )}
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      {(searchQuery || Object.keys(filters).length > 0) &&
        artworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : 'Filtered results'}
              </span>
              {Object.keys(filters).length > 0 && (
                <span className="text-xs text-gray-500">
                  • {Object.keys(filters).length} filter
                  {Object.keys(filters).length === 1 ? '' : 's'} applied
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {artworks.length.toLocaleString()} artwork
              {artworks.length === 1 ? '' : 's'}
            </span>
          </motion.div>
        )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {artworks
          .filter((artwork) => artwork?.image_id && artwork?.id)
          .map((artwork) => (
            <motion.div
              key={`art-${artwork.id}-${artwork.image_id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
      </div>

      {!isSearching && hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
          ) : (
            <Button
              onClick={() => fetchNextPage()}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
