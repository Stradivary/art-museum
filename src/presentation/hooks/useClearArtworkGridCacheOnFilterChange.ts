import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { cleanFilters } from '@/lib/utils'

export function useClearArtworkGridCacheOnFilterChange(
  filters: ArtworkFilters
) {
  const queryClient = useQueryClient()
  const prevFilters = useRef<ArtworkFilters>({})

  useEffect(() => {
    const cleaned = cleanFilters(filters)
    const prevCleaned = cleanFilters(prevFilters.current)
    if (JSON.stringify(cleaned) !== JSON.stringify(prevCleaned)) {
      queryClient.removeQueries({ queryKey: ['artworks'] })
      prevFilters.current = filters
    }
  }, [filters, queryClient])
}
