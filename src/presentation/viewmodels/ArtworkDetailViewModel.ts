'use client'

import { GetArtworkByIdUseCase } from '@/core/application/usecases/artwork/GetArtworkByIdUseCase'
import type { Artwork } from '@/core/domain/entities/Artwork'
import { artworkRepository } from '@/infrastructure/repositories/ArtworkRepositoryImpl'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Initialize use cases with repository implementation
const getArtworkByIdUseCase = new GetArtworkByIdUseCase(artworkRepository)

interface UseArtworkDetailViewModelOptions {
  enabled?: boolean
  initialData?: Artwork
}

/**
 * ViewModel for artwork detail display
 */
export function useArtworkDetailViewModel(
  id: number,
  options: UseArtworkDetailViewModelOptions = {}
) {
  const { enabled = true, initialData } = options

  const {
    data: artwork,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => getArtworkByIdUseCase.execute(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && id > 0,
    initialData,
  })

  return {
    artwork,
    isLoading,
    error,
  }
}

/**
 * ViewModel for prefetching artwork details
 */
export function usePrefetchArtworkViewModel() {
  const queryClient = useQueryClient()

  const prefetchArtwork = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['artwork', id],
      queryFn: () => getArtworkByIdUseCase.execute(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  return { prefetchArtwork }
}
