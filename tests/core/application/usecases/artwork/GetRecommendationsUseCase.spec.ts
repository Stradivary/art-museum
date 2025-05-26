import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetRecommendationsUseCase } from '@/core/application/usecases/artwork/GetRecommendationsUseCase'
import type { IArtworkRepository } from '@/core/application/interfaces/IArtworkRepository'
import type { ISavedArtworkRepository } from '@/core/application/interfaces/ISavedArtworkRepository'
import type { Artwork } from '@/core/domain/entities/Artwork'

describe('GetRecommendationsUseCase', () => {
  let useCase: GetRecommendationsUseCase
  let mockArtworkRepository: IArtworkRepository
  let mockSavedArtworkRepository: ISavedArtworkRepository

  const mockArtwork: Artwork = {
    id: 1,
    title: 'Test Artwork',
    artist_title: 'Test Artist',
    date_display: '2023',
    image_id: 'test-image',
    description: 'Test description',
    provenance_text: null,
    publication_history: null,
    exhibition_history: null,
    credit_line: null,
    place_of_origin: 'USA',
    medium_display: 'Oil on canvas',
    dimensions: '100x100',
    artwork_type_title: 'Painting',
    department_title: 'Modern Art',
    artist_display: 'Test Artist',
  }

  const mockSavedArtwork = {
    ...mockArtwork,
    savedAt: Date.now(),
  }

  beforeEach(() => {
    mockArtworkRepository = {
      getArtworks: vi.fn(),
      getArtworkById: vi.fn(),
      searchArtworks: vi.fn(),
    }

    mockSavedArtworkRepository = {
      saveArtwork: vi.fn(),
      removeArtwork: vi.fn(),
      getAllSavedArtworks: vi.fn(),
      isArtworkSaved: vi.fn(),
    }

    useCase = new GetRecommendationsUseCase(
      mockArtworkRepository,
      mockSavedArtworkRepository
    )
  })

  it('should create instance with repositories', () => {
    expect(useCase).toBeDefined()
  })

  it('should return empty recommendations when no saved artworks', async () => {
    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      []
    )

    const result = await useCase.execute()

    expect(result.recommendations).toEqual([])
    expect(result.summary.totalRecommendations).toBe(0)
    expect(result.summary.reasons).toContain(
      'No saved artworks found. Save some artworks to get recommendations!'
    )
  })

  it('should generate recommendations based on saved artworks', async () => {
    const savedArtworks = [mockSavedArtwork]
    const recommendedArtworks = [
      { ...mockArtwork, id: 2, title: 'Recommended Artwork' },
    ]

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(mockArtworkRepository.getArtworks).mockResolvedValue({
      artworks: recommendedArtworks,
      pagination: { total: 1, pages: 1, currentPage: 1, limit: 30 },
    })

    const result = await useCase.execute()

    expect(result.recommendations).toEqual(recommendedArtworks)
    expect(result.summary.totalRecommendations).toBe(1)
    expect(result.summary.reasons.length).toBeGreaterThan(0)
  })

  it('should filter out saved artworks from recommendations', async () => {
    const savedArtworks = [mockSavedArtwork]
    const artworksWithSaved = [
      mockArtwork, // This should be filtered out
      { ...mockArtwork, id: 2, title: 'Recommended Artwork' },
    ]

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(mockArtworkRepository.getArtworks).mockResolvedValue({
      artworks: artworksWithSaved,
      pagination: { total: 2, pages: 1, currentPage: 1, limit: 30 },
    })

    const result = await useCase.execute()

    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0].id).toBe(2)
  })

  it('should filter out artworks without image_id', async () => {
    const savedArtworks = [mockSavedArtwork]
    const artworksWithoutImage = [
      { ...mockArtwork, id: 2, image_id: null },
      { ...mockArtwork, id: 3, image_id: 'valid-image' },
    ]

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(mockArtworkRepository.getArtworks).mockResolvedValue({
      artworks: artworksWithoutImage,
      pagination: { total: 2, pages: 1, currentPage: 1, limit: 30 },
    })

    const result = await useCase.execute()

    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0].id).toBe(3)
  })

  it('should handle multiple preference strategies', async () => {
    const savedArtworks = [
      mockSavedArtwork,
      {
        ...mockSavedArtwork,
        id: 2,
        department_title: 'Modern Art',
        artwork_type_title: 'Sculpture',
      },
    ]

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(mockArtworkRepository.getArtworks).mockResolvedValue({
      artworks: [{ ...mockArtwork, id: 3 }],
      pagination: { total: 1, pages: 1, currentPage: 1, limit: 30 },
    })

    const result = await useCase.execute()

    expect(mockArtworkRepository.getArtworks).toHaveBeenCalled()
    expect(result.summary.reasons.length).toBeGreaterThan(0)
  })

  it('should handle repository errors gracefully', async () => {
    const error = new Error('Repository error')
    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockRejectedValue(
      error
    )

    await expect(useCase.execute()).rejects.toThrow('Repository error')
  })

  it('should handle artwork fetch failures in strategies', async () => {
    const savedArtworks = [mockSavedArtwork]

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(mockArtworkRepository.getArtworks)
      .mockRejectedValueOnce(new Error('Fetch failed'))
      .mockResolvedValueOnce({
        artworks: [{ ...mockArtwork, id: 2 }],
        pagination: { total: 1, pages: 1, currentPage: 1, limit: 30 },
      })

    const result = await useCase.execute()

    expect(result.recommendations).toHaveLength(1)
  })

  it('should limit recommendations to 20 items', async () => {
    const savedArtworks = [mockSavedArtwork]
    const manyArtworks = Array.from({ length: 30 }, (_, i) => ({
      ...mockArtwork,
      id: i + 2,
      title: `Artwork ${i + 2}`,
    }))

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(mockArtworkRepository.getArtworks).mockResolvedValue({
      artworks: manyArtworks,
      pagination: { total: 30, pages: 1, currentPage: 1, limit: 30 },
    })

    const result = await useCase.execute()

    expect(result.recommendations).toHaveLength(20)
  })

  it('should create comprehensive summary with all preference types', async () => {
    const savedArtworks = [
      mockSavedArtwork,
      {
        ...mockSavedArtwork,
        id: 2,
        artist_title: 'Test Artist',
        place_of_origin: 'France',
      },
    ]

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(mockArtworkRepository.getArtworks).mockResolvedValue({
      artworks: [{ ...mockArtwork, id: 3 }],
      pagination: { total: 1, pages: 1, currentPage: 1, limit: 30 },
    })

    const result = await useCase.execute()

    const { summary } = result
    expect(summary.reasons.length).toBeGreaterThan(0)
    expect(summary.filters).toBeDefined()
    expect(summary.totalRecommendations).toBe(1)
  })

  it('should handle artworks with missing preference fields', async () => {
    const incompleteArtwork = {
      ...mockSavedArtwork,
      department_title: null,
      artwork_type_title: null,
      place_of_origin: null,
      medium_display: null,
      artist_title: null,
    }

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      [incompleteArtwork]
    )
    vi.mocked(mockArtworkRepository.getArtworks).mockResolvedValue({
      artworks: [{ ...mockArtwork, id: 2 }],
      pagination: { total: 1, pages: 1, currentPage: 1, limit: 30 },
    })

    const result = await useCase.execute()

    expect(result.summary.reasons).toContain('Based on your saved artworks')
  })
})
