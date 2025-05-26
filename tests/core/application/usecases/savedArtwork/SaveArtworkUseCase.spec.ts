import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SaveArtworkUseCase } from '@/core/application/usecases/savedArtwork/SaveArtworkUseCase'
import type { ISavedArtworkRepository } from '@/core/application/interfaces/ISavedArtworkRepository'
import { mockArtwork } from '../../../../__mocks__/data'

describe('SaveArtworkUseCase', () => {
  let useCase: SaveArtworkUseCase
  let mockRepository: ISavedArtworkRepository

  beforeEach(() => {
    mockRepository = {
      saveArtwork: vi.fn(),
      removeArtwork: vi.fn(),
      getAllSavedArtworks: vi.fn(),
      isArtworkSaved: vi.fn(),
    }
    useCase = new SaveArtworkUseCase(mockRepository)
  })

  it('should create instance with repository', () => {
    expect(useCase).toBeDefined()
  })

  it('should save artwork through repository', async () => {
    vi.mocked(mockRepository.saveArtwork).mockResolvedValue(undefined)

    await useCase.execute(mockArtwork)

    expect(mockRepository.saveArtwork).toHaveBeenCalledWith(mockArtwork)
  })

  it('should propagate repository errors', async () => {
    const error = new Error('Save failed')
    vi.mocked(mockRepository.saveArtwork).mockRejectedValue(error)

    await expect(useCase.execute(mockArtwork)).rejects.toThrow('Save failed')
  })
})
