'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArtworkGrid } from '../artwork/ArtworkGrid'
import { Recommendations } from '../artwork/Recommendations'
import { SearchBar } from '../search/SearchBar'
import { ArtworkFilter } from '../search/ArtworkFilter'
import { useRecommendationsViewModel } from '../../../viewmodels/ArtworkViewModel'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { useSearchParams } from 'react-router'

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

  // Get recommendations
  const {
    recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
  } = useRecommendationsViewModel()

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  const handleSearchQueryChange = useCallback(
    (query: string) => {
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
    setFilters(newFilters)
  }, [])

  const showRecommendations = !searchQuery && Object.keys(filters).length === 0

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sticky top-16 z-10 -mx-4 rounded-lg border-b border-gray-200/50 bg-gray-50/90 px-4 py-4 backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <SearchBar
              initialQuery={searchQuery}
              onSearch={handleSearchQueryChange}
            />
          </div>
          <div className="flex-shrink-0">
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
        >
          <Recommendations
            recommendations={recommendations}
            isLoading={recommendationsLoading}
            error={recommendationsError}
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
