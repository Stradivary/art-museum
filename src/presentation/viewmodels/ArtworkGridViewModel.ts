import { useEffect, useState } from 'react'
import {
  useArtworkListViewModel,
  useArtworkSearchViewModel,
} from '@/presentation/viewmodels/ArtworkViewModel'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'

// Helper function to check if there are any active filters
function hasActiveFilters(filters: ArtworkFilters): boolean {
  return Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  )
}

export function useArtworkGridViewModel(
  searchQuery: string,
  filters: ArtworkFilters
) {
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

  // Check if we should use search (either has search query or active filters)
  const shouldUseSearch = searchQuery.trim() !== '' || hasActiveFilters(filters)
  // Get view models for list and search functionality
  // getArtworks no longer supports filters, so we only use it when there are no filters
  const listVM = useArtworkListViewModel(pageSize)
  const searchVM = useArtworkSearchViewModel(
    searchQuery || '', // Use empty if no search query but filters are present
    filters,
    pageSize
  )

  // Determine which data to use based on search query or filters
  const isSearching = shouldUseSearch
  const artworks = isSearching ? searchVM.searchResults : listVM.artworks
  const isLoading = isSearching ? searchVM.isLoading : listVM.isLoading
  const error = isSearching ? searchVM.error : listVM.error
  const hasData = isSearching ? searchVM.hasData : listVM.hasData
  const isEmpty = isSearching ? searchVM.isEmpty : listVM.artworks.length === 0

  return {
    artworks,
    isLoading,
    isFetchingNextPage: isSearching
      ? searchVM.isFetchingNextPage
      : listVM.isFetchingNextPage,
    hasNextPage: isSearching ? searchVM.hasNextPage : listVM.hasNextPage,
    fetchNextPage: isSearching ? searchVM.fetchNextPage : listVM.fetchNextPage,
    ref: isSearching ? searchVM.ref : listVM.ref,
    error,
    hasData,
    isEmpty,
    isSearching,
    gridCols,
    pageSize,
  }
}
