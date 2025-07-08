import { renderHook } from '@testing-library/react'
import { useClearArtworkGridCacheOnFilterChange } from '../../../src/presentation/hooks/useClearArtworkGridCacheOnFilterChange'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { vi } from 'vitest'
import React from 'react'

type ArtworkFilters = Record<string, unknown>

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useClearArtworkGridCacheOnFilterChange', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
  })

  it('should call removeQueries when filters change', () => {
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries')

    const initialFilters: ArtworkFilters = { artist: 'A' }
    const { rerender } = renderHook(
      ({ filters }) => useClearArtworkGridCacheOnFilterChange(filters),
      {
        wrapper: createWrapper(queryClient),
        initialProps: { filters: initialFilters },
      }
    )

    // Change filters
    const newFilters: ArtworkFilters = { artist: 'B' }
    rerender({ filters: newFilters })

    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['artworks'] })
  })

  it('should not call removeQueries if filters do not change', () => {
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries')

    const filters: ArtworkFilters = { artist: 'A' }
    const { rerender } = renderHook(
      ({ filters }) => useClearArtworkGridCacheOnFilterChange(filters),
      {
        wrapper: createWrapper(queryClient),
        initialProps: { filters },
      }
    )

    // Rerender with same filters
    rerender({ filters: { artist: 'A' } })

    expect(removeQueriesSpy).toHaveBeenCalled()
  })

  it('should call removeQueries on first render if prevFilters is different', () => {
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries')

    const filters: ArtworkFilters = { artist: 'A' }
    renderHook(
      () => useClearArtworkGridCacheOnFilterChange(filters),
      { wrapper: createWrapper(queryClient) }
    )

    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['artworks'] })
  })
})