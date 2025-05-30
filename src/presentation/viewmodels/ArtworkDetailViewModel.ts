'use client'

import { GetArtworkBasicByIdUseCase } from '@/core/application/usecases/artwork/GetArtworkBasicByIdUseCase'
import type { Artwork } from '@/core/domain/entities/Artwork'
import { artworkRepository } from '@/infrastructure/repositories/ArtworkRepositoryImpl'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Initialize use cases with repository implementation
const getArtworkBasicByIdUseCase = new GetArtworkBasicByIdUseCase(
  artworkRepository
)

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
    queryKey: ['artwork', 'detail', id],
    queryFn: () => getArtworkBasicByIdUseCase.execute(id),
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
      queryKey: ['artwork', 'basic', id],
      queryFn: () => getArtworkBasicByIdUseCase.execute(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  return { prefetchArtwork }
}
