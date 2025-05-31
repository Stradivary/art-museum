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
export function useArtworkListViewModel(pageSize: number = 9) {
  const { ref, inView } = useInView()

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: infiniteStatus,
    error: infiniteError,
  } = useInfiniteQuery<ArtworkPaginationResult, Error>({
    queryKey: ['artworks', pageSize],
    queryFn: async ({ pageParam }) => {
      return await getArtworksUseCase.execute(
        typeof pageParam === 'number' ? pageParam : 1,
        pageSize
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
 * ViewModel for searching artworks with pagination
 */
export function useArtworkSearchViewModel(
  query: string,
  filters?: ArtworkFilters,
  pageSize: number = 9
) {
  const { ref, inView } = useInView()

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: infiniteStatus,
    error: infiniteError,
  } = useInfiniteQuery<ArtworkPaginationResult, Error>({
    queryKey: ['artworks', 'search', 'paginated', query, filters, pageSize],
    queryFn: async ({ pageParam }) => {
      return await searchArtworksUseCase.executePaginated(
        query,
        typeof pageParam === 'number' ? pageParam : 1,
        pageSize,
        filters
      )
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ArtworkPaginationResult) => {
      if (lastPage.pagination.current_page < lastPage.pagination.total_pages) {
        return lastPage.pagination.current_page + 1
      }
      return undefined
    },
    enabled:
      query.trim().length > 0 ||
      (filters &&
        Object.values(filters).some((v) => v !== undefined && v !== '')),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Auto-fetch next page when scrolling to the bottom
  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      query.trim().length > 0
    ) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage, query])

  // Flatten all pages into a single array
  const allSearchResults = infiniteData?.pages
    ? (infiniteData.pages as ArtworkPaginationResult[]).flatMap(
        (page) => page.artworks
      )
    : []

  return {
    searchResults: allSearchResults,
    isLoading: infiniteStatus === 'pending',
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ref,
    error: infiniteError,
    hasData: allSearchResults.length > 0,
    isEmpty: allSearchResults.length === 0 && infiniteStatus !== 'pending',
    isSearching: query.trim() !== '',
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
