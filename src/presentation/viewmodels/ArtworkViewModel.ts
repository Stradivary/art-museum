'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { GetArtworksUseCase } from '@/core/application/usecases/artwork/GetArtworksUseCase'
import { SearchArtworksUseCase } from '@/core/application/usecases/artwork/SearchArtworksUseCase'
import { artworkRepository } from '@/infrastructure/repositories/ArtworkRepositoryImpl'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

// Initialize use cases with repository implementation
const getArtworksUseCase = new GetArtworksUseCase(artworkRepository)
const searchArtworksUseCase = new SearchArtworksUseCase(artworkRepository)

/**
 * ViewModel for infinite scrolling artwork listing
 */
export function useArtworkListViewModel() {
  const { ref, inView } = useInView()

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: infiniteStatus,
  } = useInfiniteQuery({
    queryKey: ['artworks'],
    queryFn: ({ pageParam = 1 }) => getArtworksUseCase.execute(pageParam, 12),
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
    artworks: infiniteData?.pages?.flatMap((page) => page.artworks) || [],
    isLoading: infiniteStatus === 'pending',
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ref,
  }
}

/**
 * ViewModel for searching artworks
 */
export function useArtworkSearchViewModel(query: string) {
  const {
    data: searchResults = [],
    isLoading,
    status,
  } = useQuery({
    queryKey: ['artworks', 'search', query],
    queryFn: async () => {
      try {
        return await searchArtworksUseCase.execute(query)
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
  }
}
