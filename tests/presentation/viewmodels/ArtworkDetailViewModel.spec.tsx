// Only import 'vi' from 'vitest' first
import { vi } from 'vitest'

// Define the mock object directly inside the vi.mock factory to avoid hoisting issues
vi.mock('@/infrastructure/repositories/ArtworkRepositoryImpl', () => {
  const mockArtworkRepository = {
    getArtworkById: vi.fn(),
    getArtworks: vi.fn(),
    searchArtworks: vi.fn(),
    getRecommendations: vi.fn(),
  }
  return {
    artworkRepository: mockArtworkRepository,
    ArtworkRepositoryImpl: vi.fn(() => mockArtworkRepository),
  }
})

// Now import everything else
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import {
  useArtworkDetailViewModel,
  usePrefetchArtworkViewModel,
} from '@/presentation/viewmodels/ArtworkDetailViewModel'
import { mockArtwork } from '../../__mocks__/data'
import { artworkRepository } from '@/infrastructure/repositories/ArtworkRepositoryImpl'

// Use vi.mocked to get proper mock typing for the repository
const mockedArtworkRepository = vi.mocked(artworkRepository)

// Use mockedArtworkRepository.getArtworkById in all tests for mockResolvedValue, etc.
describe('ArtworkDetailViewModel', () => {
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
  })

  describe('useArtworkDetailViewModel', () => {
    it('should fetch artwork by id successfully', async () => {
      const artworkId = 123
      mockedArtworkRepository.getArtworkById.mockResolvedValue(mockArtwork)

      const { result } = renderHook(
        () => useArtworkDetailViewModel(artworkId),
        { wrapper: createWrapper }
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.artwork).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.artwork).toEqual(mockArtwork)
      expect(result.current.error).toBeNull()
      expect(mockedArtworkRepository.getArtworkById).toHaveBeenCalledWith(
        artworkId
      )
    })

    it('should handle invalid artwork id', () => {
      const invalidId = 0

      const { result } = renderHook(
        () => useArtworkDetailViewModel(invalidId),
        { wrapper: createWrapper }
      )

      expect(result.current.isLoading).toBe(false)
      expect(result.current.artwork).toBeUndefined()
      expect(mockedArtworkRepository.getArtworkById).not.toHaveBeenCalled()
    })

    it('should handle negative artwork id', () => {
      const negativeId = -1

      const { result } = renderHook(
        () => useArtworkDetailViewModel(negativeId),
        { wrapper: createWrapper }
      )

      expect(result.current.isLoading).toBe(false)
      expect(result.current.artwork).toBeUndefined()
      expect(mockedArtworkRepository.getArtworkById).not.toHaveBeenCalled()
    })

    it('should respect enabled option', () => {
      const artworkId = 123

      const { result } = renderHook(
        () => useArtworkDetailViewModel(artworkId, { enabled: false }),
        { wrapper: createWrapper }
      )

      expect(result.current.isLoading).toBe(false)
      expect(mockedArtworkRepository.getArtworkById).not.toHaveBeenCalled()
    })

    it('should use initial data when provided', () => {
      const artworkId = 123
      const initialArtwork = { ...mockArtwork, title: 'Initial Artwork' }

      const { result } = renderHook(
        () =>
          useArtworkDetailViewModel(artworkId, { initialData: initialArtwork }),
        { wrapper: createWrapper }
      )

      expect(result.current.artwork).toEqual(initialArtwork)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle fetch error', async () => {
      const artworkId = 123
      const mockError = new Error('Failed to fetch artwork')
      mockedArtworkRepository.getArtworkById.mockRejectedValue(mockError)

      const { result } = renderHook(
        () => useArtworkDetailViewModel(artworkId),
        { wrapper: createWrapper }
      )

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })

      expect(result.current.artwork).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle both enabled and id validation', () => {
      const invalidId = 0

      const { result } = renderHook(
        () => useArtworkDetailViewModel(invalidId, { enabled: true }),
        { wrapper: createWrapper }
      )

      expect(result.current.isLoading).toBe(false)
      expect(mockedArtworkRepository.getArtworkById).not.toHaveBeenCalled()
    })

    it('should refetch when id changes', async () => {
      const firstId = 123
      const secondId = 456
      const firstArtwork = { ...mockArtwork, id: firstId }
      const secondArtwork = {
        ...mockArtwork,
        id: secondId,
        title: 'Second Artwork',
      }

      mockedArtworkRepository.getArtworkById
        .mockResolvedValueOnce(firstArtwork)
        .mockResolvedValueOnce(secondArtwork)

      const { result, rerender } = renderHook(
        ({ id }) => useArtworkDetailViewModel(id),
        {
          wrapper: createWrapper,
          initialProps: { id: firstId },
        }
      )

      await waitFor(() => {
        expect(result.current.artwork).toEqual(firstArtwork)
      })

      rerender({ id: secondId })

      await waitFor(() => {
        expect(result.current.artwork).toEqual(secondArtwork)
      })

      expect(mockedArtworkRepository.getArtworkById).toHaveBeenCalledTimes(2)
      expect(mockedArtworkRepository.getArtworkById).toHaveBeenNthCalledWith(
        1,
        firstId
      )
      expect(mockedArtworkRepository.getArtworkById).toHaveBeenNthCalledWith(
        2,
        secondId
      )
    })
  })

  describe('usePrefetchArtworkViewModel', () => {
    it('should provide prefetch function', () => {
      const { result } = renderHook(() => usePrefetchArtworkViewModel(), {
        wrapper: createWrapper,
      })

      expect(typeof result.current.prefetchArtwork).toBe('function')
    })

    it('should prefetch artwork when called', () => {
      const artworkId = 123
      mockedArtworkRepository.getArtworkById.mockResolvedValue(mockArtwork)

      // Spy on queryClient.prefetchQuery
      const prefetchSpy = vi.spyOn(queryClient, 'prefetchQuery')

      const { result } = renderHook(() => usePrefetchArtworkViewModel(), {
        wrapper: createWrapper,
      })

      result.current.prefetchArtwork(artworkId)

      expect(prefetchSpy).toHaveBeenCalledWith({
        queryKey: ['artwork', artworkId],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
      })
    })

    it('should call use case when prefetch query function is executed', async () => {
      const artworkId = 123
      mockedArtworkRepository.getArtworkById.mockResolvedValue(mockArtwork)

      // Spy on queryClient.prefetchQuery BEFORE the hook is rendered and prefetch is called
      const prefetchSpy = vi.spyOn(queryClient, 'prefetchQuery')

      const { result } = renderHook(() => usePrefetchArtworkViewModel(), {
        wrapper: createWrapper,
      })

      result.current.prefetchArtwork(artworkId)

      // Get the query function that was passed to prefetchQuery
      const prefetchCalls = prefetchSpy.mock.calls
      const queryOptions = prefetchCalls[0][0]
      const queryFn = queryOptions.queryFn as () => Promise<unknown>

      // Execute the query function
      await queryFn()

      expect(mockedArtworkRepository.getArtworkById).toHaveBeenCalledWith(
        artworkId
      )
    })

    it('should work with multiple prefetch calls', () => {
      const firstId = 123
      const secondId = 456
      mockedArtworkRepository.getArtworkById.mockResolvedValue(mockArtwork)

      const prefetchSpy = vi.spyOn(queryClient, 'prefetchQuery')

      const { result } = renderHook(() => usePrefetchArtworkViewModel(), {
        wrapper: createWrapper,
      })

      result.current.prefetchArtwork(firstId)
      result.current.prefetchArtwork(secondId)

      expect(prefetchSpy).toHaveBeenCalledTimes(2)
      expect(prefetchSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          queryKey: ['artwork', firstId],
        })
      )
      expect(prefetchSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          queryKey: ['artwork', secondId],
        })
      )
    })
  })
})
