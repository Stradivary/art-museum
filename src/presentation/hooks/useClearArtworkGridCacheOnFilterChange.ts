import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

export function useClearArtworkGridCacheOnFilterChange(
  filters: ArtworkFilters
) {
  const queryClient = useQueryClient()
  const prevFilters = useRef<ArtworkFilters>({})

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(prevFilters.current)) {
      queryClient.removeQueries({ queryKey: ['artworks'] })
      prevFilters.current = filters
    }
  }, [filters, queryClient])
}
