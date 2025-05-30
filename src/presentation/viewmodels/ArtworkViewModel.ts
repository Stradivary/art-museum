'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { GetArtworksUseCase } from '@/core/application/usecases/artwork/GetArtworksUseCase'
import { SearchArtworksUseCase } from '@/core/application/usecases/artwork/SearchArtworksUseCase'
import { GetRecommendationsUseCase } from '@/core/application/usecases/artwork/GetRecommendationsUseCase'
import { artworkRepository } from '@/infrastructure/repositories/ArtworkRepositoryImpl'
import { savedArtworkRepository } from '@/infrastructure/repositories/SavedArtworkRepositoryImpl'
import { dislikedArtworkRepository } from '@/infrastructure/repositories/DislikedArtworkRepositoryImpl'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { cleanFilters } from '@/lib/utils'
import type { ArtworkPaginationResult } from '@/core/application/interfaces/IArtworkRepository'

// Initialize use cases with repository implementation
const getArtworksUseCase = new GetArtworksUseCase(artworkRepository)
const searchArtworksUseCase = new SearchArtworksUseCase(artworkRepository)
const getRecommendationsUseCase = new GetRecommendationsUseCase(
  artworkRepository,
  savedArtworkRepository,
  dislikedArtworkRepository
)

/**
 * ViewModel for infinite scrolling artwork listing
 */
export function useArtworkListViewModel(
  filters?: ArtworkFilters,
  pageSize: number = 9
) {
  const cleanedFilters = filters ? cleanFilters(filters) : undefined
  const { ref, inView } = useInView()

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: infiniteStatus,
    error: infiniteError,
  } = useInfiniteQuery<ArtworkPaginationResult, Error>({
    queryKey: ['artworks', cleanedFilters, pageSize],
    queryFn: async ({ pageParam }) => {
      return await getArtworksUseCase.execute(
        typeof pageParam === 'number' ? pageParam : 1,
        pageSize,
        cleanedFilters
      )
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ArtworkPaginationResult) => {
      if (lastPage.pagination.current_page < lastPage.pagination.total_pages) {
        return lastPage.pagination.current_page + 1
      }
      return undefined
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Auto-fetch next page when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  // Flatten all pages into a single array
  const allArtworks = infiniteData?.pages
    ? (infiniteData.pages as ArtworkPaginationResult[]).flatMap(
        (page) => page.artworks
      )
    : []

  return {
    artworks: allArtworks,
    isLoading: infiniteStatus === 'pending',
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ref,
    error: infiniteError,
    hasData: allArtworks.length > 0,
  }
}

/**
 * ViewModel for searching artworks
 */
export function useArtworkSearchViewModel(
  query: string,
  filters?: ArtworkFilters
) {
  const cleanedFilters = filters ? cleanFilters(filters) : undefined
  const {
    data: searchResults = [],
    isLoading,
    status,
    error,
  } = useQuery({
    queryKey: ['artworks', 'search', query, cleanedFilters],
    queryFn: async () => {
      try {
        return await searchArtworksUseCase.execute(query, cleanedFilters)
      } catch (error) {
        console.error('Error searching artworks:', error)
        return []
      }
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    searchResults,
    isLoading,
    isEmpty: searchResults.length === 0 && !isLoading && status !== 'pending',
    isSearching: query.trim() !== '',
    error,
    hasData: searchResults.length > 0,
  }
}

/**
 * ViewModel for getting personalized recommendations
 */
export function useRecommendationsViewModel() {
  const {
    data: recommendations,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendationsUseCase.execute(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })

  return {
    recommendations,
    isLoading,
    error,
    refetch,
  }
}
