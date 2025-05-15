'use client'

import { GetAllSavedArtworksUseCase } from '@/core/application/usecases/savedArtwork/GetAllSavedArtworksUseCase'
import { RemoveSavedArtworkUseCase } from '@/core/application/usecases/savedArtwork/RemoveSavedArtworkUseCase'
import { SaveArtworkUseCase } from '@/core/application/usecases/savedArtwork/SaveArtworkUseCase'
import type { Artwork } from '@/core/domain/entities/Artwork'
import { savedArtworkRepository } from '@/infrastructure/repositories/SavedArtworkRepositoryImpl'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

// Initialize use cases with repository implementation
const saveArtworkUseCase = new SaveArtworkUseCase(savedArtworkRepository)
const removeSavedArtworkUseCase = new RemoveSavedArtworkUseCase(
  savedArtworkRepository
)
const getAllSavedArtworksUseCase = new GetAllSavedArtworksUseCase(
  savedArtworkRepository
)
/**
 * ViewModel for saved artwork operations
 */
export function useSavedArtworkViewModel() {
  const queryClient = useQueryClient()
  const [isClient, setIsClient] = useState(false)

  // Client-side only code to prevent hydration errors
  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    data: savedArtworks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['savedArtworks'],
    queryFn: () => getAllSavedArtworksUseCase.execute(),
    enabled: isClient,
    staleTime: 0, // Always refetch to ensure we have the latest data
  })

  const saveArtwork = async (artwork: Artwork) => {
    await saveArtworkUseCase.execute(artwork)
    queryClient.invalidateQueries({ queryKey: ['savedArtworks'] })
  }

  const removeSavedArtwork = async (id: number) => {
    await removeSavedArtworkUseCase.execute(id)
    queryClient.invalidateQueries({ queryKey: ['savedArtworks'] })
  }

  const isArtworkSaved = (id: number): boolean => {
    const savedArtworks = queryClient.getQueryData<Artwork[]>(['savedArtworks'])
    return savedArtworks
      ? savedArtworks.some((artwork) => artwork.id === id)
      : false
  }

  return {
    savedArtworks,
    isLoading,
    saveArtwork,
    removeSavedArtwork,
    isArtworkSaved,
    refetch,
  }
}
