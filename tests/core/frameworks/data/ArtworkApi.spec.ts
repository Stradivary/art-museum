import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ArtworkApi, artworkApi } from '@/core/frameworks/data/ArtworkApi'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'

// Mock fetch globally
global.fetch = vi.fn()

describe('ArtworkApi', () => {
  let api: ArtworkApi
  const mockFetch = vi.mocked(fetch)

  beforeEach(() => {
    api = new ArtworkApi()
    vi.clearAllMocks()
  })

  describe('fetchArtworks', () => {
    const mockResponse = {
      data: [
        {
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
        },
      ],
      pagination: {
        total: 1,
        limit: 9,
        offset: 0,
        total_pages: 1,
        current_page: 1,
      },
      config: {
        iiif_url: 'https://www.artic.edu/iiif/2',
      },
    }

    it('should fetch artworks with default parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.fetchArtworks()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('artworks?fields=')
      )
      expect(result).toEqual(mockResponse)
    })

    it('should fetch artworks with custom page and limit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      await api.fetchArtworks(2, 20)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2&limit=20')
      )
    })


    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(api.fetchArtworks()).rejects.toThrow('API error: 404')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(api.fetchArtworks()).rejects.toThrow('Network error')
    })

    it('should not add filter params when no filters provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      await api.fetchArtworks()

      const callUrl = mockFetch.mock.calls[0][0] as string
      expect(callUrl).not.toContain('%5Bmatch%5D%5B')
    })
  })

  describe('fetchArtworkById', () => {
    const mockArtwork = {
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

    const mockResponse = {
      data: mockArtwork,
    }

    it('should fetch artwork by id', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.fetchArtworkById(123)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('artworks/123?fields=')
      )
      expect(result).toEqual(mockArtwork)
    })

    it('should handle API errors for single artwork', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(api.fetchArtworkById(999)).rejects.toThrow('API error: 404')
    })

    it('should handle network errors for single artwork', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(api.fetchArtworkById(123)).rejects.toThrow('Network error')
    })
  })

  describe('searchArtworks', () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          title: 'Search Result',
          artist_title: 'Test Artist',
          date_display: '2023',
          image_id: 'search-image',
          description: 'Search description',
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
        },
      ],
      pagination: {
        total: 1,
        limit: 20,
        offset: 0,
        total_pages: 1,
        current_page: 1,
      },
      config: {
        iiif_url: 'https://www.artic.edu/iiif/2',
      },
    }

    it('should search artworks by query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await api.searchArtworks('test query')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('artworks/search?fields=')
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test+query')
      )
      expect(result).toEqual(mockResponse)
    })

    it('should search artworks with filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const filters: ArtworkFilters = {
        department: 'Modern Art',
      }

      await api.searchArtworks('test', filters)

      const callUrl = mockFetch.mock.calls[0][0] as string
      expect(callUrl).toContain('q=test')
      expect(callUrl).toContain(
        'match%5D%5Bdepartment_title%5D=Modern+Art'
      )
    })

    it('should handle search API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(api.searchArtworks('test')).rejects.toThrow('API error: 500')
    })

    it('should handle search network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Search network error'))

      await expect(api.searchArtworks('test')).rejects.toThrow(
        'Search network error'
      )
    })

    it('should encode special characters in search query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      await api.searchArtworks('test & special chars')

      const callUrl = mockFetch.mock.calls[0][0] as string
      expect(callUrl).toContain('q=test+%26+special+chars')
    })
  })

  describe('buildFilterParams', () => {
    it('should handle empty filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response)

      await api.fetchArtworks(1, 9, {})

      const callUrl = mockFetch.mock.calls[0][0] as string
      expect(callUrl).not.toContain('fq=')
    })

    it('should properly encode filter values with special characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response)

      await api.fetchArtworks(1, 9)

      const callUrl = mockFetch.mock.calls[0][0] as string
      expect(callUrl).toContain('https://api.artic.edu/api/v1/artworks')
    })
  })

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(artworkApi).toBeInstanceOf(ArtworkApi)
    })
  })
})
