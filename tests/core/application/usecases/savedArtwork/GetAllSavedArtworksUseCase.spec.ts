import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetAllSavedArtworksUseCase } from '@/core/application/usecases/savedArtwork/GetAllSavedArtworksUseCase'
import type { ISavedArtworkRepository } from '@/core/application/interfaces/ISavedArtworkRepository'
import { mockSavedArtwork } from '../../../../__mocks__/data'

describe('GetAllSavedArtworksUseCase', () => {
  let useCase: GetAllSavedArtworksUseCase
  let mockRepository: ISavedArtworkRepository

  beforeEach(() => {
    mockRepository = {
      saveArtwork: vi.fn(),
      removeArtwork: vi.fn(),
      getAllSavedArtworks: vi.fn(),
      isArtworkSaved: vi.fn(),
    }
    useCase = new GetAllSavedArtworksUseCase(mockRepository)
  })

  it('should create instance with repository', () => {
    expect(useCase).toBeDefined()
  })

  it('should get all saved artworks from repository', async () => {
    const savedArtworks = [mockSavedArtwork]
    vi.mocked(mockRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )

    const result = await useCase.execute()

    expect(mockRepository.getAllSavedArtworks).toHaveBeenCalled()
    expect(result).toEqual(savedArtworks)
  })

  it('should return empty array when no saved artworks', async () => {
    vi.mocked(mockRepository.getAllSavedArtworks).mockResolvedValue([])

    const result = await useCase.execute()

    expect(result).toEqual([])
  })

  it('should propagate repository errors', async () => {
    const error = new Error('Fetch failed')
    vi.mocked(mockRepository.getAllSavedArtworks).mockRejectedValue(error)

    await expect(useCase.execute()).rejects.toThrow('Fetch failed')
  })
})
