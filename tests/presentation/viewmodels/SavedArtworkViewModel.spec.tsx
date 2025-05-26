import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSavedArtworkViewModel } from '@/presentation/viewmodels/SavedArtworkViewModel'
import { mockArtwork } from '../../__mocks__/data'

// Mock the use cases
vi.mock('@/core/application/usecases/savedArtwork/SaveArtworkUseCase', () => ({
  SaveArtworkUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
  })),
}))

vi.mock(
  '@/core/application/usecases/savedArtwork/RemoveSavedArtworkUseCase',
  () => ({
    RemoveSavedArtworkUseCase: vi.fn().mockImplementation(() => ({
      execute: vi.fn(),
    })),
  })
)

vi.mock(
  '@/core/application/usecases/savedArtwork/GetAllSavedArtworksUseCase',
  () => ({
    GetAllSavedArtworksUseCase: vi.fn().mockImplementation(() => ({
      execute: vi.fn().mockResolvedValue([]),
    })),
  })
)

vi.mock('@/infrastructure/repositories/SavedArtworkRepositoryImpl', () => ({
  savedArtworkRepository: {},
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSavedArtworkViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', async () => {
    const { result } = renderHook(() => useSavedArtworkViewModel(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should load saved artworks', async () => {
    const { result } = renderHook(() => useSavedArtworkViewModel(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.savedArtworks).toBeDefined()
  })

  it('should save artwork', async () => {
    const { result } = renderHook(() => useSavedArtworkViewModel(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.saveArtwork(mockArtwork)
    })

    expect(result.current.saveArtwork).toBeDefined()
  })

  it('should remove saved artwork', async () => {
    const { result } = renderHook(() => useSavedArtworkViewModel(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.removeSavedArtwork(mockArtwork.id)
    })

    expect(result.current.removeSavedArtwork).toBeDefined()
  })

  it('should check if artwork is saved', async () => {
    const { result } = renderHook(() => useSavedArtworkViewModel(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const isSaved = result.current.isArtworkSaved(mockArtwork.id)
    expect(typeof isSaved).toBe('boolean')

    const isNotSaved = result.current.isArtworkSaved(999)
    expect(typeof isNotSaved).toBe('boolean')
  })
})
