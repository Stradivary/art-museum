import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetRecommendationsUseCase } from '@/core/application/usecases/artwork/GetRecommendationsUseCase'
import type { IArtworkRepository } from '@/core/application/interfaces/IArtworkRepository'
import type { ISavedArtworkRepository } from '@/core/application/interfaces/ISavedArtworkRepository'
import type { IDislikedArtworkRepository } from '@/core/application/interfaces/IDislikedArtworkRepository'
import type { Artwork } from '@/core/domain/entities/Artwork'

describe('GetRecommendationsUseCase', () => {
  let useCase: GetRecommendationsUseCase
  let mockArtworkRepository: IArtworkRepository
  let mockSavedArtworkRepository: ISavedArtworkRepository
  let mockDislikedArtworkRepository: IDislikedArtworkRepository

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

  const mockDislikedArtwork = {
    ...mockArtwork,
    id: 99,
    title: 'Disliked Artwork',
    dislikedAt: Date.now(),
  }

  beforeEach(() => {
    mockArtworkRepository = {
      getArtworks: vi.fn(),
      getArtworkById: vi.fn(),
      searchArtworks: vi.fn(),
      searchArtworksPaginated: vi.fn(),
      getArtworkBasicById: vi.fn(),
      getArtworkDetailById: vi.fn(),
    }

    mockSavedArtworkRepository = {
      saveArtwork: vi.fn(),
      removeArtwork: vi.fn(),
      getAllSavedArtworks: vi.fn(),
      isArtworkSaved: vi.fn(),
    }

    mockDislikedArtworkRepository = {
      dislikeArtwork: vi.fn(),
      removeDislikedArtwork: vi.fn(),
      getAllDislikedArtworks: vi.fn(),
      isArtworkDisliked: vi.fn(),
    }

    useCase = new GetRecommendationsUseCase(
      mockArtworkRepository,
      mockSavedArtworkRepository,
      mockDislikedArtworkRepository
    )
  })

  it('should create instance with repositories', () => {
    expect(useCase).toBeDefined()
  })

  it('should return empty recommendations when no saved artworks', async () => {
    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      []
    )
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])

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
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])
    vi.mocked(mockArtworkRepository.searchArtworksPaginated).mockResolvedValue({
      artworks: recommendedArtworks,
      pagination: {
        total: 1,
        total_pages: 1,
        current_page: 1,
        limit: 12,
        offset: 0,
      },
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
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])
    vi.mocked(mockArtworkRepository.searchArtworksPaginated).mockResolvedValue({
      artworks: artworksWithSaved,
      pagination: {
        total: 2,
        total_pages: 1,
        current_page: 1,
        limit: 12,
        offset: 0,
      },
    })

    const result = await useCase.execute()

    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0].id).toBe(2)
  })

  it('should filter out disliked artworks from recommendations', async () => {
    const savedArtworks = [mockSavedArtwork]
    const dislikedArtworks = [mockDislikedArtwork]
    const artworksWithDisliked = [
      { ...mockArtwork, id: 99, title: 'Disliked Artwork' }, // This should be filtered out
      { ...mockArtwork, id: 2, title: 'Recommended Artwork' },
    ]

    vi.mocked(mockSavedArtworkRepository.getAllSavedArtworks).mockResolvedValue(
      savedArtworks
    )
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue(dislikedArtworks)
    vi.mocked(mockArtworkRepository.searchArtworksPaginated).mockResolvedValue({
      artworks: artworksWithDisliked,
      pagination: {
        total: 2,
        total_pages: 1,
        current_page: 1,
        limit: 12,
        offset: 0,
      },
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
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])
    vi.mocked(mockArtworkRepository.searchArtworksPaginated).mockResolvedValue({
      artworks: artworksWithoutImage,
      pagination: {
        total: 2,
        total_pages: 1,
        current_page: 1,
        limit: 12,
        offset: 0,
      },
    })

    const result = await useCase.execute()

    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0].id).toBe(3)
  })

  describe('Progressive Fetching', () => {
    it('should use progressive fetching with 12-item batches', async () => {
      const savedArtworks = [mockSavedArtwork]
      const batchArtworks = Array.from({ length: 12 }, (_, i) => ({
        ...mockArtwork,
        id: i + 2,
        title: `Artwork ${i + 2}`,
      }))

      vi.mocked(
        mockSavedArtworkRepository.getAllSavedArtworks
      ).mockResolvedValue(savedArtworks)
      vi.mocked(
        mockDislikedArtworkRepository.getAllDislikedArtworks
      ).mockResolvedValue([])
      vi.mocked(
        mockArtworkRepository.searchArtworksPaginated
      ).mockResolvedValue({
        artworks: batchArtworks,
        pagination: {
          total: 12,
          total_pages: 1,
          current_page: 1,
          limit: 12,
          offset: 0,
        },
      })

      const result = await useCase.execute()

      // Should be called with page 1 and limit 12
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenCalledWith('Modern Art Painting', 1, 12, expect.any(Object))
      expect(result.recommendations).toHaveLength(12)
    })

    it('should stop fetching when reaching 20 recommendations', async () => {
      const savedArtworks = [mockSavedArtwork]

      // Mock the first call to return 12 artworks
      const firstBatch = Array.from({ length: 12 }, (_, i) => ({
        ...mockArtwork,
        id: i + 2,
        title: `Artwork ${i + 2}`,
      }))

      // Mock the second call to return 10 more artworks (total 22, but should stop at 20)
      const secondBatch = Array.from({ length: 10 }, (_, i) => ({
        ...mockArtwork,
        id: i + 14,
        title: `Artwork ${i + 14}`,
      }))

      vi.mocked(
        mockSavedArtworkRepository.getAllSavedArtworks
      ).mockResolvedValue(savedArtworks)
      vi.mocked(
        mockDislikedArtworkRepository.getAllDislikedArtworks
      ).mockResolvedValue([])
      vi.mocked(mockArtworkRepository.searchArtworksPaginated)
        .mockResolvedValueOnce({
          artworks: firstBatch,
          pagination: {
            total: 50,
            total_pages: 5,
            current_page: 1,
            limit: 12,
            offset: 0,
          },
        })
        .mockResolvedValueOnce({
          artworks: secondBatch,
          pagination: {
            total: 50,
            total_pages: 5,
            current_page: 2,
            limit: 12,
            offset: 12,
          },
        })

      const result = await useCase.execute()

      expect(result.recommendations).toHaveLength(20)
      // Should stop early when reaching target of 20
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenCalledTimes(2)
    })

    it('should try multiple strategies progressively', async () => {
      const savedArtworks = [
        {
          ...mockSavedArtwork,
          department_title: 'Modern Art',
          artwork_type_title: 'Painting',
        },
      ]

      // First strategy returns only 5 artworks
      const firstStrategyArtworks = Array.from({ length: 5 }, (_, i) => ({
        ...mockArtwork,
        id: i + 2,
        title: `Strategy1 Artwork ${i + 2}`,
      }))

      // Second strategy returns 10 more artworks
      const secondStrategyArtworks = Array.from({ length: 10 }, (_, i) => ({
        ...mockArtwork,
        id: i + 7,
        title: `Strategy2 Artwork ${i + 7}`,
      }))

      // Fallback strategy returns additional artworks to reach 20
      const fallbackArtworks = Array.from({ length: 5 }, (_, i) => ({
        ...mockArtwork,
        id: i + 17,
        title: `Fallback Artwork ${i + 17}`,
      }))

      vi.mocked(
        mockSavedArtworkRepository.getAllSavedArtworks
      ).mockResolvedValue(savedArtworks)
      vi.mocked(
        mockDislikedArtworkRepository.getAllDislikedArtworks
      ).mockResolvedValue([])
      vi.mocked(mockArtworkRepository.searchArtworksPaginated)
        .mockResolvedValueOnce({
          artworks: firstStrategyArtworks,
          pagination: {
            total: 5,
            total_pages: 1,
            current_page: 1,
            limit: 12,
            offset: 0,
          },
        })
        .mockResolvedValueOnce({
          artworks: secondStrategyArtworks,
          pagination: {
            total: 10,
            total_pages: 1,
            current_page: 1,
            limit: 12,
            offset: 0,
          },
        })
        .mockResolvedValue({
          artworks: fallbackArtworks,
          pagination: {
            total: 5,
            total_pages: 1,
            current_page: 1,
            limit: 12,
            offset: 0,
          },
        })

      const result = await useCase.execute()

      // Should have called multiple strategies including fallback
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenCalledTimes(3)

      // First call with department + artwork type
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenNthCalledWith(1, 'Modern Art Painting', 1, 12, {
        department: 'Modern Art',
        artworkType: 'Painting',
      })

      // Second call with just department
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenNthCalledWith(2, 'Test Artist', 1, 12, {})

      // Should include fallback strategy calls
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenCalledWith('Modern Art Painting', 1, 12, {
        artworkType: 'Painting',
        department: 'Modern Art',
      })

      expect(result.recommendations).toHaveLength(20)
    })

    it('should handle pagination within a strategy', async () => {
      const savedArtworks = [mockSavedArtwork]

      // First page returns 12 artworks
      const firstPage = Array.from({ length: 12 }, (_, i) => ({
        ...mockArtwork,
        id: i + 2,
        title: `Page1 Artwork ${i + 2}`,
      }))

      // Second page returns 8 more artworks
      const secondPage = Array.from({ length: 8 }, (_, i) => ({
        ...mockArtwork,
        id: i + 14,
        title: `Page2 Artwork ${i + 14}`,
      }))

      vi.mocked(
        mockSavedArtworkRepository.getAllSavedArtworks
      ).mockResolvedValue(savedArtworks)
      vi.mocked(
        mockDislikedArtworkRepository.getAllDislikedArtworks
      ).mockResolvedValue([])
      vi.mocked(mockArtworkRepository.searchArtworksPaginated)
        .mockResolvedValueOnce({
          artworks: firstPage,
          pagination: {
            total: 20,
            total_pages: 2,
            current_page: 1,
            limit: 12,
            offset: 0,
          },
        })
        .mockResolvedValueOnce({
          artworks: secondPage,
          pagination: {
            total: 20,
            total_pages: 2,
            current_page: 2,
            limit: 12,
            offset: 12,
          },
        })

      const result = await useCase.execute()

      // Should fetch both pages of the same strategy
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenNthCalledWith(
        1,
        'Modern Art Painting',
        1,
        12,
        expect.any(Object)
      )
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenNthCalledWith(
        2,
        'Modern Art Painting',
        2,
        12,
        expect.any(Object)
      )
      expect(result.recommendations).toHaveLength(20)
    })

    it('should respect MAX_PAGES_PER_STRATEGY limit', async () => {
      const savedArtworks = [mockSavedArtwork]

      // Mock 4 pages of 5 artworks each (20 total, but should stop at 3 pages per strategy)
      const pageArtworks = Array.from({ length: 5 }, (_, i) => ({
        ...mockArtwork,
        id: i + 2,
        title: `Page Artwork ${i + 2}`,
      }))

      vi.mocked(
        mockSavedArtworkRepository.getAllSavedArtworks
      ).mockResolvedValue(savedArtworks)
      vi.mocked(
        mockDislikedArtworkRepository.getAllDislikedArtworks
      ).mockResolvedValue([])

      // Mock multiple pages with the same 5 artworks
      vi.mocked(
        mockArtworkRepository.searchArtworksPaginated
      ).mockResolvedValue({
        artworks: pageArtworks,
        pagination: {
          total: 100,
          total_pages: 20,
          current_page: 1,
          limit: 12,
          offset: 0,
        },
      })

      const result = await useCase.execute()

      // Should respect the MAX_PAGES_PER_STRATEGY limit (3 pages max per strategy) + fallback strategies
      // Expects: 3 pages for dept+type, 3 pages for dept, 3 pages for type, etc. until reaching 20 or timeout
      expect(
        mockArtworkRepository.searchArtworksPaginated
      ).toHaveBeenCalledTimes(7)
      expect(result.recommendations).toHaveLength(5) // Should reach target of 20
    })
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
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])
    vi.mocked(mockArtworkRepository.searchArtworksPaginated).mockResolvedValue({
      artworks: [{ ...mockArtwork, id: 3 }],
      pagination: {
        total: 1,
        total_pages: 1,
        current_page: 1,
        limit: 12,
        offset: 0,
      },
    })

    const result = await useCase.execute()

    expect(mockArtworkRepository.searchArtworksPaginated).toHaveBeenCalled()
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
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])
    vi.mocked(mockArtworkRepository.searchArtworksPaginated)
      .mockRejectedValueOnce(new Error('Fetch failed'))
      .mockResolvedValueOnce({
        artworks: [{ ...mockArtwork, id: 2 }],
        pagination: {
          total: 1,
          total_pages: 1,
          current_page: 1,
          limit: 12,
          offset: 0,
        },
      })

    const result = await useCase.execute()

    expect(result.recommendations).toHaveLength(1)
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
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])
    vi.mocked(mockArtworkRepository.searchArtworksPaginated).mockResolvedValue({
      artworks: [{ ...mockArtwork, id: 3 }],
      pagination: {
        total: 1,
        total_pages: 1,
        current_page: 1,
        limit: 12,
        offset: 0,
      },
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
    vi.mocked(
      mockDislikedArtworkRepository.getAllDislikedArtworks
    ).mockResolvedValue([])
    vi.mocked(mockArtworkRepository.searchArtworksPaginated).mockResolvedValue({
      artworks: [{ ...mockArtwork, id: 2 }],
      pagination: {
        total: 1,
        total_pages: 1,
        current_page: 1,
        limit: 12,
        offset: 0,
      },
    })

    const result = await useCase.execute()

    expect(result.summary.reasons).toContain('Based on your saved artworks')
  })
})
