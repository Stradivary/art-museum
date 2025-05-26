import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RemoveSavedArtworkUseCase } from '@/core/application/usecases/savedArtwork/RemoveSavedArtworkUseCase'
import type { ISavedArtworkRepository } from '@/core/application/interfaces/ISavedArtworkRepository'

describe('RemoveSavedArtworkUseCase', () => {
  let useCase: RemoveSavedArtworkUseCase
  let mockRepository: ISavedArtworkRepository

  beforeEach(() => {
    mockRepository = {
      saveArtwork: vi.fn(),
      removeArtwork: vi.fn(),
      getAllSavedArtworks: vi.fn(),
      isArtworkSaved: vi.fn(),
    }
    useCase = new RemoveSavedArtworkUseCase(mockRepository)
  })

  it('should create instance with repository', () => {
    expect(useCase).toBeDefined()
  })

  it('should remove artwork by id', async () => {
    const artworkId = 123
    vi.mocked(mockRepository.removeArtwork).mockResolvedValue(undefined)

    await useCase.execute(artworkId)

    expect(mockRepository.removeArtwork).toHaveBeenCalledWith(artworkId)
  })

  it('should propagate repository errors', async () => {
    const artworkId = 123
    const error = new Error('Remove failed')
    vi.mocked(mockRepository.removeArtwork).mockRejectedValue(error)

    await expect(useCase.execute(artworkId)).rejects.toThrow('Remove failed')
  })
})
