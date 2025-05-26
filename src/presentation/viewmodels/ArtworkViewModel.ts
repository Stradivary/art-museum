'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { GetArtworksUseCase } from '@/core/application/usecases/artwork/GetArtworksUseCase'
import { SearchArtworksUseCase } from '@/core/application/usecases/artwork/SearchArtworksUseCase'
import { GetRecommendationsUseCase } from '@/core/application/usecases/artwork/GetRecommendationsUseCase'
import { artworkRepository } from '@/infrastructure/repositories/ArtworkRepositoryImpl'
import { savedArtworkRepository } from '@/infrastructure/repositories/SavedArtworkRepositoryImpl'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

// Initialize use cases with repository implementation
const getArtworksUseCase = new GetArtworksUseCase(artworkRepository)
const searchArtworksUseCase = new SearchArtworksUseCase(artworkRepository)
const getRecommendationsUseCase = new GetRecommendationsUseCase(
  artworkRepository,
  savedArtworkRepository
)

/**
 * ViewModel for infinite scrolling artwork listing
 */
export function useArtworkListViewModel(filters?: ArtworkFilters) {
  const { ref, inView } = useInView()

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: infiniteStatus,
    error: infiniteError,
  } = useInfiniteQuery({
    queryKey: ['artworks', filters],
    queryFn: ({ pageParam = 1 }) =>
      getArtworksUseCase.execute(pageParam, 12, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
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

  return {
    artworks: infiniteData?.pages?.flatMap((page) => page.artworks) ?? [],
    isLoading: infiniteStatus === 'pending',
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ref,
    error: infiniteError,
    hasData:
      (infiniteData?.pages?.flatMap((page) => page.artworks) ?? []).length > 0,
  }
}

/**
 * ViewModel for searching artworks
 */
export function useArtworkSearchViewModel(
  query: string,
  filters?: ArtworkFilters
) {
  const {
    data: searchResults = [],
    isLoading,
    status,
    error,
  } = useQuery({
    queryKey: ['artworks', 'search', query, filters],
    queryFn: async () => {
      try {
        return await searchArtworksUseCase.execute(query, filters)
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
