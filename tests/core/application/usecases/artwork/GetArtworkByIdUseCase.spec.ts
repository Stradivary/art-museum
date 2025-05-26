import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetArtworkByIdUseCase } from '@/core/application/usecases/artwork/GetArtworkByIdUseCase'
import type { IArtworkRepository } from '@/core/application/interfaces/IArtworkRepository'
import { mockArtwork } from '../../../../__mocks__/data'

describe('GetArtworkByIdUseCase', () => {
  let useCase: GetArtworkByIdUseCase
  let mockRepository: IArtworkRepository

  beforeEach(() => {
    mockRepository = {
      getArtworkById: vi.fn(),
      getArtworks: vi.fn(),
      searchArtworks: vi.fn(),
    }
    useCase = new GetArtworkByIdUseCase(mockRepository)
  })

  it('should create instance with repository', () => {
    expect(useCase).toBeDefined()
  })

  it('should call repository getArtworkById method', async () => {
    const artworkId = 1
    vi.mocked(mockRepository.getArtworkById).mockResolvedValue(mockArtwork)

    const result = await useCase.execute(artworkId)

    expect(mockRepository.getArtworkById).toHaveBeenCalledWith(artworkId)
    expect(result).toEqual(mockArtwork)
  })

  it('should propagate repository errors', async () => {
    const artworkId = 1
    const error = new Error('Repository error')
    vi.mocked(mockRepository.getArtworkById).mockRejectedValue(error)

    await expect(useCase.execute(artworkId)).rejects.toThrow('Repository error')
  })
})
