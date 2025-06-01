import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ArtworkRepositoryImpl } from '@/infrastructure/repositories/ArtworkRepositoryImpl'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { artworkApi } from '@/core/frameworks/data/ArtworkApi'
import { mockArtwork, mockPaginatedArtworks } from '../../__mocks__/data'

// Mock the ArtworkApi
vi.mock('@/core/frameworks/data/ArtworkApi', () => ({
  artworkApi: {
    fetchArtworks: vi.fn(),
    fetchArtworkById: vi.fn(),
    searchArtworks: vi.fn(),
  },
}))

const mockArtworkApi = vi.mocked(artworkApi)

describe('ArtworkRepositoryImpl', () => {
  let repository: ArtworkRepositoryImpl

  beforeEach(() => {
    vi.clearAllMocks()
    repository = new ArtworkRepositoryImpl()
  })

  describe('getArtworks', () => {
    it('should fetch paginated artworks successfully', async () => {
      const page = 1
      const limit = 12
      const filters: ArtworkFilters = { department: 'Modern Art' }

      const mockApiResponse = {
        data: mockPaginatedArtworks.artworks,
        pagination: mockPaginatedArtworks.pagination,
        config: { iiif_url: 'https://www.artic.edu/iiif/2' },
      }

      mockArtworkApi.fetchArtworks.mockResolvedValue(mockApiResponse)

      const result = await repository.getArtworks(page, limit, filters)

      expect(mockArtworkApi.fetchArtworks).toHaveBeenCalledWith(page, limit)
      expect(result).toEqual({
        artworks: mockPaginatedArtworks.artworks,
        pagination: mockPaginatedArtworks.pagination,
      })
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      mockArtworkApi.fetchArtworks.mockRejectedValue(error)

      await expect(repository.getArtworks(1, 12)).rejects.toThrow('API Error')
    })

    it('should log and rethrow errors', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const error = new Error('Network Error')
      mockArtworkApi.fetchArtworks.mockRejectedValue(error)

      await expect(repository.getArtworks(1, 12)).rejects.toThrow(
        'Network Error'
      )

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Repository error fetching artworks:',
        error
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('getArtworkById', () => {
    it('should fetch single artwork by id successfully', async () => {
      const artworkId = 123
      mockArtworkApi.fetchArtworkById.mockResolvedValue(mockArtwork)

      const result = await repository.getArtworkById(artworkId)

      expect(mockArtworkApi.fetchArtworkById).toHaveBeenCalledWith(artworkId)
      expect(result).toEqual(mockArtwork)
    })

    it('should handle API errors', async () => {
      const artworkId = 123
      const error = new Error('Artwork not found')
      mockArtworkApi.fetchArtworkById.mockRejectedValue(error)

      await expect(repository.getArtworkById(artworkId)).rejects.toThrow(
        'Artwork not found'
      )
    })

    it('should log and rethrow errors', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const artworkId = 123
      const error = new Error('Network Error')
      mockArtworkApi.fetchArtworkById.mockRejectedValue(error)

      await expect(repository.getArtworkById(artworkId)).rejects.toThrow(
        'Network Error'
      )

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Repository error fetching artwork with id ${artworkId}:`,
        error
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('searchArtworks', () => {
    it('should search artworks successfully', async () => {
      const query = 'Van Gogh'
      const filters: ArtworkFilters = { artworkType: 'Painting' }
      const searchResults = [mockArtwork]

      const mockApiResponse = {
        data: searchResults,
        pagination: mockPaginatedArtworks.pagination,
        config: { iiif_url: 'https://www.artic.edu/iiif/2' },
      }

      mockArtworkApi.searchArtworks.mockResolvedValue(mockApiResponse)

      const result = await repository.searchArtworks(query, filters)

      expect(mockArtworkApi.searchArtworks).toHaveBeenCalledWith(query, filters)
      expect(result).toEqual(searchResults)
    })

    it('should return empty array when no results found', async () => {
      const query = 'NonexistentArtist'

      const mockApiResponse = {
        data: [],
        pagination: { ...mockPaginatedArtworks.pagination, total: 0 },
        config: { iiif_url: 'https://www.artic.edu/iiif/2' },
      }

      mockArtworkApi.searchArtworks.mockResolvedValue(mockApiResponse)

      const result = await repository.searchArtworks(query)

      expect(result).toEqual([])
    })

    it('should handle API errors', async () => {
      const query = 'test'
      const error = new Error('Search failed')
      mockArtworkApi.searchArtworks.mockRejectedValue(error)

      await expect(repository.searchArtworks(query)).rejects.toThrow(
        'Search failed'
      )
    })

    it('should log and rethrow errors', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const query = 'test'
      const error = new Error('Network Error')
      mockArtworkApi.searchArtworks.mockRejectedValue(error)

      await expect(repository.searchArtworks(query)).rejects.toThrow(
        'Network Error'
      )

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Repository error searching artworks:',
        error
      )

      consoleErrorSpy.mockRestore()
    })

    it('should search without filters', async () => {
      const query = 'impressionist'
      const searchResults = [mockArtwork]

      const mockApiResponse = {
        data: searchResults,
        pagination: mockPaginatedArtworks.pagination,
        config: { iiif_url: 'https://www.artic.edu/iiif/2' },
      }

      mockArtworkApi.searchArtworks.mockResolvedValue(mockApiResponse)

      const result = await repository.searchArtworks(query)

      expect(mockArtworkApi.searchArtworks).toHaveBeenCalledWith(
        query,
        undefined
      )
      expect(result).toEqual(searchResults)
    })
  })
})
