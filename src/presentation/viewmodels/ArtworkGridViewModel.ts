import { useEffect, useState } from 'react'
import { cleanFilters } from '@/lib/utils'
import {
  useArtworkListViewModel,
  useArtworkSearchViewModel,
} from '@/presentation/viewmodels/ArtworkViewModel'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'

export function useArtworkGridViewModel(
  searchQuery: string,
  filters: ArtworkFilters
) {
  // Always clean filters before passing to viewmodels
  const cleanedFilters = cleanFilters(filters)

  // Responsive grid columns and page size
  const [gridCols, setGridCols] = useState(2)
  const [pageSize, setPageSize] = useState(8)

  useEffect(() => {
    function updateGrid() {
      if (window.innerWidth >= 1024) {
        setGridCols(4)
        setPageSize(12)
      } else if (window.innerWidth >= 768) {
        setGridCols(3)
        setPageSize(9)
      } else {
        setGridCols(2)
        setPageSize(8)
      }
    }
    updateGrid()
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [])

  // Get view models for list and search functionality
  const listVM = useArtworkListViewModel(cleanedFilters, pageSize)
  const searchVM = useArtworkSearchViewModel(searchQuery, cleanedFilters)

  // Determine which data to use based on search query
  const isSearching = searchVM.isSearching
  const artworks = isSearching ? searchVM.searchResults : listVM.artworks
  const isLoading = isSearching ? searchVM.isLoading : listVM.isLoading
  const error = isSearching ? searchVM.error : listVM.error
  const hasData = isSearching ? searchVM.hasData : listVM.hasData
  const isEmpty = searchVM.isEmpty

  return {
    artworks,
    isLoading,
    isFetchingNextPage: listVM.isFetchingNextPage,
    hasNextPage: listVM.hasNextPage,
    fetchNextPage: listVM.fetchNextPage,
    ref: listVM.ref,
    error,
    hasData,
    isEmpty,
    isSearching,
    gridCols,
    pageSize,
  }
}
