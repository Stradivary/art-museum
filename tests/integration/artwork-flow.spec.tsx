import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mockArtwork, mockArtworkPaginationResult } from '../__mocks__/data'

// Mock all external dependencies
vi.mock('react-router', async () => ({
  ...(await vi.importActual('../__mocks__/react-router')),
}))

vi.mock('framer-motion', async () => ({
  ...(await vi.importActual('../__mocks__/framer-motion')),
}))

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false }),
}))

// Mock the repository
vi.mock('@/infrastructure/repositories/ArtworkRepositoryImpl', () => ({
  artworkRepository: {
    getArtworks: vi.fn(),
    getArtworkBasicById: vi.fn(),
    searchArtworks: vi.fn(),
    searchArtworksPaginated: vi.fn(),
  },
}))

vi.mock('@/infrastructure/repositories/SavedArtworkRepositoryImpl', () => ({
  savedArtworkRepository: {
    saveArtwork: vi.fn(),
    removeArtwork: vi.fn(),
    getAllSavedArtworks: vi.fn(),
    isArtworkSaved: vi.fn(),
  },
}))

// Mock the API
vi.mock('@/core/frameworks/data/ArtworkApi', () => ({
  artworkApi: {
    getArtworks: vi.fn(),
    getArtworkById: vi.fn(),
    searchArtworks: vi.fn(),
    searchArtworksPaginated: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Artwork Flow Integration Tests', () => {
  let mockArtworkRepository: any // eslint-disable-line @typescript-eslint/no-explicit-any
  let mockSavedArtworkRepository: any // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(async () => {
    vi.clearAllMocks()

    mockArtworkRepository = (
      await import('@/infrastructure/repositories/ArtworkRepositoryImpl')
    ).artworkRepository
    mockSavedArtworkRepository = (
      await import('@/infrastructure/repositories/SavedArtworkRepositoryImpl')
    ).savedArtworkRepository

    // Setup default mock implementations
    mockArtworkRepository.getArtworks.mockResolvedValue(
      mockArtworkPaginationResult
    )
    mockArtworkRepository.getArtworkBasicById.mockResolvedValue(mockArtwork)
    mockArtworkRepository.searchArtworks.mockResolvedValue([mockArtwork])
    mockArtworkRepository.searchArtworksPaginated.mockResolvedValue({
      data: [mockArtwork],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    })

    mockSavedArtworkRepository.getAllSavedArtworks.mockResolvedValue([])
    mockSavedArtworkRepository.isArtworkSaved.mockResolvedValue(false)
    mockSavedArtworkRepository.saveArtwork.mockResolvedValue(undefined)
    mockSavedArtworkRepository.removeArtwork.mockResolvedValue(undefined)
  })

  it('should load and display artworks', async () => {
    const { ArtworkGrid } = await import(
      '@/presentation/components/features/artwork/ArtworkGrid'
    )

    render(<ArtworkGrid searchQuery="" filters={{}} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(mockArtworkRepository.getArtworks).toHaveBeenCalled()
    })
  })

  it('should handle search functionality', async () => {
    const { ArtworkGrid } = await import(
      '@/presentation/components/features/artwork/ArtworkGrid'
    )

    render(<ArtworkGrid searchQuery="starry night" filters={{}} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(mockArtworkRepository.searchArtworksPaginated).toHaveBeenCalledWith(
        'starry night',
        expect.any(Number),
        expect.any(Number),
        {}
      )
    })
  })

  it('should handle artwork saving flow', async () => {
    const { useSavedArtworkViewModel } = await import(
      '@/presentation/viewmodels/SavedArtworkViewModel'
    )
    const { renderHook, act } = await import('@testing-library/react')

    const { result } = renderHook(() => useSavedArtworkViewModel(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.saveArtwork(mockArtwork)
    })

    expect(mockSavedArtworkRepository.saveArtwork).toHaveBeenCalledWith(
      mockArtwork
    )
  })

  it('should integrate artwork detail view model with repository', async () => {
    const { useArtworkDetailViewModel } = await import(
      '@/presentation/viewmodels/ArtworkDetailViewModel'
    )
    const { renderHook } = await import('@testing-library/react')

    const { result } = renderHook(
      () => useArtworkDetailViewModel(mockArtwork.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockArtworkRepository.getArtworkBasicById).toHaveBeenCalledWith(
      mockArtwork.id
    )
    expect(result.current.artwork).toEqual(mockArtwork)
  })

  it('should handle error states gracefully', async () => {
    mockArtworkRepository.getArtworks.mockRejectedValue(
      new Error('Network error')
    )

    const { useArtworkListViewModel } = await import(
      '@/presentation/viewmodels/ArtworkViewModel'
    )
    const { renderHook } = await import('@testing-library/react')

    const { result } = renderHook(() => useArtworkListViewModel(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })
  })

  it('should maintain data consistency across view models', async () => {
    const { useSavedArtworkViewModel } = await import(
      '@/presentation/viewmodels/SavedArtworkViewModel'
    )
    const { renderHook, act } = await import('@testing-library/react')

    // Mock saved artworks
    mockSavedArtworkRepository.getAllSavedArtworks.mockResolvedValue([
      mockArtwork,
    ])

    const { result } = renderHook(() => useSavedArtworkViewModel(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.savedArtworks).toEqual([mockArtwork])
    })

    // Check if artwork is saved
    const isSaved = result.current.isArtworkSaved(mockArtwork.id)
    expect(isSaved).toBe(true)

    // Remove artwork
    await act(async () => {
      await result.current.removeSavedArtwork(mockArtwork.id)
    })

    expect(mockSavedArtworkRepository.removeArtwork).toHaveBeenCalledWith(
      mockArtwork.id
    )
  })
})
