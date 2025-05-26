'use client'

import type {
  IArtworkRepository,
  ArtworkPaginationResult,
  ArtworkFilters,
} from '@/core/application/interfaces/IArtworkRepository'
import type { Artwork } from '@/core/domain/entities/Artwork'
import { artworkApi } from '@/core/frameworks/data/ArtworkApi'

/**
 * Implementation of IArtworkRepository that uses the Art Institute of Chicago API
 */
export class ArtworkRepositoryImpl implements IArtworkRepository {
  /**
   * Get a paginated list of artworks
   */
  async getArtworks(
    page: number,
    limit: number,
    filters?: ArtworkFilters
  ): Promise<ArtworkPaginationResult> {
    try {
      const response = await artworkApi.fetchArtworks(page, limit, filters)

      return {
        artworks: response.data,
        pagination: response.pagination,
      }
    } catch (error) {
      console.error('Repository error fetching artworks:', error)
      throw error
    }
  }

  /**
   * Get a single artwork by ID
   */
  async getArtworkById(id: number): Promise<Artwork> {
    try {
      return await artworkApi.fetchArtworkById(id)
    } catch (error) {
      console.error(`Repository error fetching artwork with id ${id}:`, error)
      throw error
    }
  }

  /**
   * Search for artworks matching a query
   */
  async searchArtworks(
    query: string,
    filters?: ArtworkFilters
  ): Promise<Artwork[]> {
    try {
      const response = await artworkApi.searchArtworks(query, filters)
      return response.data
    } catch (error) {
      console.error('Repository error searching artworks:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const artworkRepository = new ArtworkRepositoryImpl()
