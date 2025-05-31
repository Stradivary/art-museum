import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetArtworksUseCase } from '@/core/application/usecases/artwork/GetArtworksUseCase'
import type {
  IArtworkRepository,
  ArtworkFilters,
} from '@/core/application/interfaces/IArtworkRepository'
import { mockArtworkPaginationResult } from '../../../../__mocks__/data'

describe('GetArtworksUseCase', () => {
  let useCase: GetArtworksUseCase
  let mockRepository: IArtworkRepository

  beforeEach(() => {
    mockRepository = {
      getArtworkById: vi.fn(),
      getArtworks: vi.fn(),
      searchArtworks: vi.fn(),
    }
    useCase = new GetArtworksUseCase(mockRepository)
  })

  it('should create instance with repository', () => {
    expect(useCase).toBeDefined()
  })

  it('should call repository getArtworks with default parameters', async () => {
    vi.mocked(mockRepository.getArtworks).mockResolvedValue(
      mockArtworkPaginationResult
    )

    const result = await useCase.execute()

    expect(mockRepository.getArtworks).toHaveBeenCalledWith(1, 10)
    expect(result).toEqual(mockArtworkPaginationResult)
  })

  it('should call repository getArtworks with custom parameters', async () => {
    const page = 2
    const limit = 20

    vi.mocked(mockRepository.getArtworks).mockResolvedValue(
      mockArtworkPaginationResult
    )

    const result = await useCase.execute(page, limit)

    expect(mockRepository.getArtworks).toHaveBeenCalledWith(
      page,
      limit
    )
    expect(result).toEqual(mockArtworkPaginationResult)
  })

  it('should propagate repository errors', async () => {
    const error = new Error('Repository error')
    vi.mocked(mockRepository.getArtworks).mockRejectedValue(error)

    await expect(useCase.execute()).rejects.toThrow('Repository error')
  })
})
