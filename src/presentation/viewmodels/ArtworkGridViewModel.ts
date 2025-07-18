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

  const listVM = useArtworkListViewModel(pageSize, !shouldUseSearch)

  const searchVM = useArtworkSearchViewModel(
    searchQuery || '',
    filters,
    pageSize
  )

  const artworks = shouldUseSearch ? searchVM.searchResults : listVM.artworks
  const isLoading = shouldUseSearch ? searchVM.isLoading : listVM.isLoading
  const error = shouldUseSearch ? searchVM.error : listVM.error
  const hasData = shouldUseSearch ? searchVM.hasData : listVM.hasData
  const isEmpty = shouldUseSearch
    ? searchVM.isEmpty
    : listVM.artworks.length === 0

  return {
    artworks,
    isLoading,
    isFetchingNextPage: shouldUseSearch
      ? searchVM.isFetchingNextPage
      : listVM.isFetchingNextPage,
    hasNextPage: shouldUseSearch ? searchVM.hasNextPage : listVM.hasNextPage,
    fetchNextPage: shouldUseSearch
      ? searchVM.fetchNextPage
      : listVM.fetchNextPage,
    listRef: listVM.ref,
    searchRef: searchVM.ref,
    error,
    hasData,
    isEmpty,
    isSearching: shouldUseSearch,
    gridCols,
    pageSize,
  }
}
