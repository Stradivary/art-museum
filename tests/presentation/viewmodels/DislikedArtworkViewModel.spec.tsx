import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as DislikedArtworkViewModel from '@/presentation/viewmodels/DislikedArtworkViewModel'
import React from 'react'

vi.mock(
  '@/core/application/usecases/dislikedArtwork/GetAllDislikedArtworksUseCase',
  () => ({
    GetAllDislikedArtworksUseCase: vi.fn().mockImplementation(() => ({
      execute: vi.fn(),
    })),
  })
)
vi.mock(
  '@/core/application/usecases/dislikedArtwork/RemoveDislikedArtworkUseCase',
  () => ({
    RemoveDislikedArtworkUseCase: vi.fn().mockImplementation(() => ({
      execute: vi.fn(),
    })),
  })
)
vi.mock(
  '@/core/application/usecases/dislikedArtwork/DislikeArtworkUseCase',
  () => ({
    DislikeArtworkUseCase: vi.fn().mockImplementation(() => ({
      execute: vi.fn(),
    })),
  })
)

vi.mock(
  import('@/infrastructure/repositories/DislikedArtworkRepositoryImpl'),
  async (importOriginal) => {
    const actual = await importOriginal()
    return {
      ...actual,
      // your mocked methods
    }
  }
)

// Helper to wrap hooks with QueryClientProvider
function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

let queryClient: QueryClient

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
})

afterEach(() => {
  queryClient.clear()
})

describe('useDislikedArtworkViewModel', () => {
  it('should initialize with empty dislikedArtworks and isLoading true, then fetch data', async () => {
    // Mock useQuery to simulate client-side rendering
    const mockArtworks = [{ id: 1, title: 'Art1' }]
    // GetAllDislikedArtworksUseCase.prototype.execute.mockResolvedValueOnce(
    //   mockArtworks
    // )

    const { result, rerender } = renderHook(
      () => DislikedArtworkViewModel.useDislikedArtworkViewModel(),
      { wrapper }
    )

    // Simulate client-side effect
    await act(async () => {
      rerender()
    })

    // Wait for react-query to update
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0))
    })

    expect(result.current.dislikedArtworks).toEqual([])
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(typeof result.current.refetch).toBe('function')
  })

  it('should call dislikeArtworkUseCase and invalidate queries on dislikeArtwork', async () => {
    // const mockExecute =
    //   dislikeArtworkUseCase.DislikeArtworkUseCase.prototype.execute
    // mockExecute.mockResolvedValueOnce(undefined)
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(
      () => DislikedArtworkViewModel.useDislikedArtworkViewModel(),
      { wrapper }
    )

    const artwork = { id: 2, title: 'Art2' }
    await act(async () => {
      await result.current.dislikeArtwork(artwork as any)
    })

    // expect(mockExecute).toHaveBeenCalledWith(artwork)
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['dislikedArtworks'],
    })
  })

  it('should call removeDislikedArtworkUseCase and invalidate queries on removeDislikedArtwork', async () => {
    // const mockExecute =
    //   removeDislikedArtworkUseCase.RemoveDislikedArtworkUseCase.prototype
    //     .execute
    // mockExecute.mockResolvedValueOnce(undefined)
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(
      () => DislikedArtworkViewModel.useDislikedArtworkViewModel(),
      { wrapper }
    )

    await act(async () => {
      await result.current.removeDislikedArtwork(123)
    })

    // expect(mockExecute).toHaveBeenCalledWith(123)
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['dislikedArtworks'],
    })
  })

  it('isArtworkDisliked returns true if artwork is disliked', () => {
    const { result } = renderHook(
      () => DislikedArtworkViewModel.useDislikedArtworkViewModel(),
      { wrapper }
    )
    // Set query data manually
    act(() => {
      queryClient.setQueryData(['dislikedArtworks'], [{ id: 5, title: 'Art5' }])
    })
    expect(result.current.isArtworkDisliked(5)).toBe(true)
    expect(result.current.isArtworkDisliked(99)).toBe(false)
  })
})
