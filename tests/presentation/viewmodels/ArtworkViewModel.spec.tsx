import { GetArtworksUseCase } from '@/core/application/usecases/artwork/GetArtworksUseCase'
import { GetRecommendationsUseCase } from '@/core/application/usecases/artwork/GetRecommendationsUseCase'
import { SearchArtworksUseCase } from '@/core/application/usecases/artwork/SearchArtworksUseCase'
import {
  useArtworkListViewModel,
  useArtworkSearchViewModel,
  useRecommendationsViewModel,
} from '@/presentation/viewmodels/ArtworkViewModel'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockArtwork, mockPaginatedArtworks } from '../../__mocks__/data'

// Mock the use cases
vi.mock('@/core/application/usecases/artwork/GetArtworksUseCase')
vi.mock('@/core/application/usecases/artwork/SearchArtworksUseCase')
vi.mock('@/core/application/usecases/artwork/GetRecommendationsUseCase')

// Mock react-intersection-observer with a factory to ensure the mock is used
vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn().mockReturnValue({
    ref: () => {},
    inView: false,
    entry: undefined,
  }),
}))

const mockGetArtworksUseCase = vi.mocked(GetArtworksUseCase)
const mockSearchArtworksUseCase = vi.mocked(SearchArtworksUseCase)
const mockGetRecommendationsUseCase = vi.mocked(GetRecommendationsUseCase)

describe('ArtworkViewModel', () => {
  let queryClient: QueryClient

  const createWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    // Mock prototype methods for all use cases
    vi.spyOn(GetArtworksUseCase.prototype, 'execute').mockImplementation(() =>
      Promise.resolve(mockPaginatedArtworks)
    )
    vi.spyOn(SearchArtworksUseCase.prototype, 'execute').mockImplementation(
      () => Promise.resolve([mockArtwork])
    )
    vi.spyOn(GetRecommendationsUseCase.prototype, 'execute').mockImplementation(
      () =>
        Promise.resolve({
          recommendations: [mockArtwork],
          summary: {
            totalRecommendations: 1,
            reasons: ['Test reason'],
            filters: {},
          },
        })
    )
  })

  describe('useArtworkListViewModel', () => {
    it('should initialize with empty state', () => {
      ;(useInView as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ref: () => {},
        inView: false,
        entry: undefined,
      })

      const { result } = renderHook(() => useArtworkListViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.artworks).toEqual([])
      expect(result.current.isLoading).toBe(true)
      expect(result.current.hasData).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should fetch artworks successfully', async () => {
      // Simulate inView: false initially, then true to trigger fetch
      const mockUseInView = useInView as unknown as ReturnType<typeof vi.fn>
      mockUseInView.mockReturnValueOnce({
        ref: () => {},
        inView: false,
        entry: undefined,
      })
      mockUseInView.mockReturnValue({
        ref: () => {},
        inView: true,
        entry: undefined,
      })

      const mockExecute = vi.fn().mockResolvedValue(mockPaginatedArtworks)
      mockGetArtworksUseCase.prototype.execute = mockExecute

      const { result, rerender } = renderHook(() => useArtworkListViewModel(), {
        wrapper: createWrapper,
      })

      rerender()

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      expect(result.current.artworks).toEqual([])
      expect(result.current.hasData).toBe(false)
    })

    it('should handle infinite scrolling', async () => {
      const { useInView } = await import('react-intersection-observer')
      const mockUseInView = vi.mocked(useInView)

      const mockRef = vi.fn()

      mockUseInView.mockReturnValue({
        ref: mockRef,
        inView: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const firstPage = {
        ...mockPaginatedArtworks,
        pagination: {
          ...mockPaginatedArtworks.pagination,
          current_page: 1,
          total_pages: 3,
        },
      }

      const secondPage = {
        ...mockPaginatedArtworks,
        artworks: [{ ...mockArtwork, id: 456, title: 'Second Artwork' }],
        pagination: {
          ...mockPaginatedArtworks.pagination,
          current_page: 2,
          total_pages: 3,
        },
      }

      const mockExecute = vi
        .fn()
        .mockResolvedValueOnce(firstPage)
        .mockResolvedValueOnce(secondPage)

      mockGetArtworksUseCase.prototype.execute = mockExecute

      const { result } = renderHook(() => useArtworkListViewModel(), {
        wrapper: createWrapper,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      expect(result.current.hasNextPage).toBe(false)
      expect(result.current.artworks).toHaveLength(0)
    })

    it('should handle errors gracefully', async () => {
      const mockError = new Error('Failed to fetch artworks')
      const mockExecute = vi.fn().mockRejectedValue(mockError)
      mockGetArtworksUseCase.prototype.execute = mockExecute

      const { result } = renderHook(() => useArtworkListViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.artworks).toEqual([])
      expect(result.current.hasData).toBe(false)
    })

    it('should provide ref for intersection observer', () => {
      const { result } = renderHook(() => useArtworkListViewModel(), {
        wrapper: createWrapper,
      })

      expect(result.current.ref).toBeDefined()
      expect(typeof result.current.ref).toBe('function')
    })
  })

  describe('useArtworkSearchViewModel', () => {
    const mockSearchResults = [mockArtwork]

    it('should not search when query is empty', () => {
      const mockExecute = vi.fn()
      mockSearchArtworksUseCase.prototype.execute = mockExecute

      const { result } = renderHook(() => useArtworkSearchViewModel(''), {
        wrapper: createWrapper,
      })

      expect(result.current.searchResults).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isSearching).toBe(false)
      expect(mockExecute).not.toHaveBeenCalled()
    })

    it('should search when query is provided', async () => {
      const query = 'Van Gogh'
      const mockExecute = vi.fn().mockResolvedValue(mockSearchResults)
      mockSearchArtworksUseCase.prototype.execute = mockExecute

      const { result } = renderHook(() => useArtworkSearchViewModel(query), {
        wrapper: createWrapper,
      })

      expect(result.current.isSearching).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.searchResults).toEqual([])
      expect(result.current.hasData).toBe(false)
      expect(result.current.isEmpty).toBe(true)
    })

    it('should handle empty search results', async () => {
      const query = 'NonexistentArtist'
      const mockExecute = vi.fn().mockResolvedValue([])
      mockSearchArtworksUseCase.prototype.execute = mockExecute

      const { result } = renderHook(() => useArtworkSearchViewModel(query), {
        wrapper: createWrapper,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.searchResults).toEqual([])
      expect(result.current.isEmpty).toBe(true)
      expect(result.current.hasData).toBe(false)
    })

    it('should not search when query is only whitespace', () => {
      const mockExecute = vi.fn()
      mockSearchArtworksUseCase.prototype.execute = mockExecute

      const { result } = renderHook(() => useArtworkSearchViewModel('   '), {
        wrapper: createWrapper,
      })

      expect(result.current.isSearching).toBe(false)
      expect(mockExecute).not.toHaveBeenCalled()
    })
  })

  describe('useRecommendationsViewModel', () => {
    it('should handle recommendations fetch error', async () => {
      const mockError = new Error('Failed to fetch recommendations')
      const mockExecute = vi.fn().mockRejectedValue(mockError)
      mockGetRecommendationsUseCase.prototype.execute = mockExecute

      const { result } = renderHook(() => useRecommendationsViewModel(), {
        wrapper: createWrapper,
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })

      expect(result.current.recommendations).toBeUndefined()
    })
  })
})
