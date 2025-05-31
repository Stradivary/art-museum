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
    limit: number
  ): Promise<ArtworkPaginationResult> {
    try {
      const response = await artworkApi.fetchArtworks(page, limit)

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
   * Get basic artwork info by ID (optimized for cards)
   */
  async getArtworkBasicById(id: number): Promise<Artwork> {
    try {
      return await artworkApi.fetchArtworkBasicById(id)
    } catch (error) {
      console.error(
        `Repository error fetching basic artwork with id ${id}:`,
        error
      )
      throw error
    }
  }

  /**
   * Get detailed artwork info by ID (for detail pages)
   */
  async getArtworkDetailById(id: number): Promise<Artwork> {
    try {
      return await artworkApi.fetchArtworkDetailById(id)
    } catch (error) {
      console.error(
        `Repository error fetching detailed artwork with id ${id}:`,
        error
      )
      throw error
    }
  }

  /**
   * Get a single artwork by ID (legacy method)
   * @deprecated Use getArtworkBasicById or getArtworkDetailById instead
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

  /**
   * Search for artworks matching a query with pagination
   */
  async searchArtworksPaginated(
    query: string,
    page: number,
    limit: number,
    filters?: ArtworkFilters
  ): Promise<ArtworkPaginationResult> {
    try {
      const response = await artworkApi.searchArtworksPaginated(
        query,
        page,
        limit,
        filters
      )

      return {
        artworks: response.data,
        pagination: response.pagination,
      }
    } catch (error) {
      console.error(
        'Repository error searching artworks with pagination:',
        error
      )
      throw error
    }
  }
}

// Export a singleton instance
export const artworkRepository = new ArtworkRepositoryImpl()
