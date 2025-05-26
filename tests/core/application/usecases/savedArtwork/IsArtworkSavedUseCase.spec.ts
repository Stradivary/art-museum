import { describe, it, expect, beforeEach, vi } from 'vitest'
import { IsArtworkSavedUseCase } from '@/core/application/usecases/savedArtwork/IsArtworkSavedUseCase'
import type { ISavedArtworkRepository } from '@/core/application/interfaces/ISavedArtworkRepository'

describe('IsArtworkSavedUseCase', () => {
  let useCase: IsArtworkSavedUseCase
  let mockRepository: ISavedArtworkRepository

  beforeEach(() => {
    mockRepository = {
      saveArtwork: vi.fn(),
      removeArtwork: vi.fn(),
      getAllSavedArtworks: vi.fn(),
      isArtworkSaved: vi.fn(),
    }
    useCase = new IsArtworkSavedUseCase(mockRepository)
  })

  it('should create instance with repository', () => {
    expect(useCase).toBeDefined()
  })

  it('should return true when artwork is saved', async () => {
    const artworkId = 123
    vi.mocked(mockRepository.isArtworkSaved).mockResolvedValue(true)

    const result = await useCase.execute(artworkId)

    expect(mockRepository.isArtworkSaved).toHaveBeenCalledWith(artworkId)
    expect(result).toBe(true)
  })

  it('should return false when artwork is not saved', async () => {
    const artworkId = 123
    vi.mocked(mockRepository.isArtworkSaved).mockResolvedValue(false)

    const result = await useCase.execute(artworkId)

    expect(mockRepository.isArtworkSaved).toHaveBeenCalledWith(artworkId)
    expect(result).toBe(false)
  })

  it('should propagate repository errors', async () => {
    const artworkId = 123
    const error = new Error('Check failed')
    vi.mocked(mockRepository.isArtworkSaved).mockRejectedValue(error)

    await expect(useCase.execute(artworkId)).rejects.toThrow('Check failed')
  })
})
