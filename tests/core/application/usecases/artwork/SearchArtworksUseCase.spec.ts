import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SearchArtworksUseCase } from '@/core/application/usecases/artwork/SearchArtworksUseCase'
import type {
  IArtworkRepository,
  ArtworkFilters,
} from '@/core/application/interfaces/IArtworkRepository'
import { mockArtwork, mockArtwork2 } from '../../../../__mocks__/data'

describe('SearchArtworksUseCase', () => {
  let useCase: SearchArtworksUseCase
  let mockRepository: IArtworkRepository

  beforeEach(() => {
    mockRepository = {
      getArtworkById: vi.fn(),
      getArtworks: vi.fn(),
      searchArtworks: vi.fn(),
    }
    useCase = new SearchArtworksUseCase(mockRepository)
  })

  it('should create instance with repository', () => {
    expect(useCase).toBeDefined()
  })

  it('should search artworks with query', async () => {
    const query = 'starry night'
    const searchResults = [mockArtwork]

    vi.mocked(mockRepository.searchArtworks).mockResolvedValue(searchResults)

    const result = await useCase.execute(query)

    expect(mockRepository.searchArtworks).toHaveBeenCalledWith(query, undefined)
    expect(result).toEqual(searchResults)
  })

  it('should search artworks with query and filters', async () => {
    const query = 'painting'
    const filters: ArtworkFilters = {
      department: 'Modern Art',
      artworkType: 'Painting',
    }
    const searchResults = [mockArtwork, mockArtwork2]

    vi.mocked(mockRepository.searchArtworks).mockResolvedValue(searchResults)

    const result = await useCase.execute(query, filters)

    expect(mockRepository.searchArtworks).toHaveBeenCalledWith(query, filters)
    expect(result).toEqual(searchResults)
  })

  it('should return empty array when no results found', async () => {
    const query = 'nonexistent artwork'

    vi.mocked(mockRepository.searchArtworks).mockResolvedValue([])

    const result = await useCase.execute(query)

    expect(result).toEqual([])
  })

  it('should propagate repository errors', async () => {
    const query = 'test'
    const error = new Error('Search failed')

    vi.mocked(mockRepository.searchArtworks).mockRejectedValue(error)

    await expect(useCase.execute(query)).rejects.toThrow('Search failed')
  })
})
