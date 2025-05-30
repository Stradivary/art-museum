'use client'

import { GetAllDislikedArtworksUseCase } from '@/core/application/usecases/dislikedArtwork/GetAllDislikedArtworksUseCase'
import { RemoveDislikedArtworkUseCase } from '@/core/application/usecases/dislikedArtwork/RemoveDislikedArtworkUseCase'
import { DislikeArtworkUseCase } from '@/core/application/usecases/dislikedArtwork/DislikeArtworkUseCase'
import type { Artwork } from '@/core/domain/entities/Artwork'
import { dislikedArtworkRepository } from '@/infrastructure/repositories/DislikedArtworkRepositoryImpl'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

// Initialize use cases with repository implementation
const dislikeArtworkUseCase = new DislikeArtworkUseCase(
  dislikedArtworkRepository
)
const removeDislikedArtworkUseCase = new RemoveDislikedArtworkUseCase(
  dislikedArtworkRepository
)
const getAllDislikedArtworksUseCase = new GetAllDislikedArtworksUseCase(
  dislikedArtworkRepository
)

/**
 * ViewModel for disliked artwork operations
 */
export function useDislikedArtworkViewModel() {
  const queryClient = useQueryClient()
  const [isClient, setIsClient] = useState(false)

  // Client-side only code to prevent hydration errors
  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    data: dislikedArtworks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['dislikedArtworks'],
    queryFn: () => getAllDislikedArtworksUseCase.execute(),
    enabled: isClient,
    staleTime: 0, // Always refetch to ensure we have the latest data
  })

  const dislikeArtwork = async (artwork: Artwork) => {
    await dislikeArtworkUseCase.execute(artwork)
    queryClient.invalidateQueries({ queryKey: ['dislikedArtworks'] })
  }

  const removeDislikedArtwork = async (id: number) => {
    await removeDislikedArtworkUseCase.execute(id)
    queryClient.invalidateQueries({ queryKey: ['dislikedArtworks'] })
  }

  const isArtworkDisliked = (id: number): boolean => {
    const dislikedArtworks = queryClient.getQueryData<Artwork[]>([
      'dislikedArtworks',
    ])
    return dislikedArtworks
      ? dislikedArtworks.some((artwork) => artwork.id === id)
      : false
  }

  return {
    dislikedArtworks,
    isLoading,
    dislikeArtwork,
    removeDislikedArtwork,
    isArtworkDisliked,
    refetch,
  }
}
