'use client'

import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { localStorageService } from '@/infrastructure/services/LocalStorageService'
import { cleanFilters } from '@/lib/utils'
import { useClearArtworkGridCacheOnFilterChange } from '@/presentation/hooks/useClearArtworkGridCacheOnFilterChange'
import { useRegisterTeachingTip } from '@/presentation/hooks/useRegisterTeachingTip'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useRecommendationsViewModel } from '../../../viewmodels/ArtworkViewModel'
import { ArtworkGrid } from '../artwork/ArtworkGrid'
import { Recommendations } from '../artwork/Recommendations'
import { ArtworkFilter } from '../search/ArtworkFilter'
import { SearchBar } from '../search/SearchBar'

interface HomePageContentProps {
  initialSearchQuery?: string
}

/**
 * Main content component for the homepage
 */
export function HomePageContent({
  initialSearchQuery = '',
}: Readonly<HomePageContentProps>) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [filters, setFilters] = useState<ArtworkFilters>({})

  // Register teaching tips
  const searchTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'home-search',
    title: 'Search Artworks',
    description:
      'Use the search bar to find specific artworks by title, artist, style, or keywords. Try searching for "Monet" or "impressionism"!',
    position: 'bottom',
  })

  const filterTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'home-filter',
    title: 'Filter Artworks',
    description:
      'Use filters to narrow down artworks by artist, artwork type, and other criteria. Perfect for discovering specific styles!',
    position: 'bottom',
  })

  const recommendationsTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'home-recommendations',
    title: 'Curated Recommendations',
    description:
      'Discover amazing artworks from our curated recommendations. These change regularly to showcase different themes and artists.',
    position: 'top',
  })

  const showRecommendations = !searchQuery && Object.keys(filters).length === 0
  // Get recommendations
  const {
    recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
    refetch,
  } = useRecommendationsViewModel({ enabled: showRecommendations })

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  // Load filters from local storage on mount
  useEffect(() => {
    localStorageService
      .getItem<ArtworkFilters>('artwork-filters')
      .then((stored) => {
        if (stored) {
          setFilters(stored)
        }
      })
  }, [])

  // Clear artwork grid cache when filters change
  useClearArtworkGridCacheOnFilterChange(filters)

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      if (query.length < 3 && query !== '') {
        // If query is less than 3 characters, do not update search params
        return
      }
      setSearchQuery(query)
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev)
        if (query) {
          newParams.set('q', query)
        } else {
          newParams.delete('q')
        }
        return newParams
      })
    },
    [setSearchParams]
  )

  const handleFiltersChange = useCallback((newFilters: ArtworkFilters) => {
    setFilters(cleanFilters(newFilters))
  }, [])

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="border-border/50 bg-background/90 sticky top-16 z-10 -mx-4 rounded-lg border-b px-4 py-4 backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1" ref={searchTip.ref}>
            <SearchBar
              initialQuery={searchQuery}
              onSearch={handleSearchQueryChange}
            />
          </div>
          <div className="flex-shrink-0" ref={filterTip.ref}>
            <ArtworkFilter
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
      </motion.div>

      {/* Recommendations Section - only show when not searching or filtering */}
      {showRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={recommendationsTip.ref}
        >
          <Recommendations
            key={
              'recommendations' +
              (recommendations?.summary?.totalRecommendations?.toString() || 0)
            }
            recommendations={recommendations}
            isLoading={recommendationsLoading}
            error={recommendationsError}
            refetch={refetch}
          />
        </motion.div>
      )}

      {/* Artwork Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: showRecommendations ? 0.4 : 0.2 }}
      >
        <ArtworkGrid searchQuery={searchQuery} filters={filters} />
      </motion.div>
    </div>
  )
}
