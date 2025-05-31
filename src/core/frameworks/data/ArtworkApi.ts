'use client'

import type { Artwork } from '@/core/domain/entities/Artwork'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'

/**
 * API response structure from Art Institute of Chicago API
 */
export interface ArtworkApiResponse {
  data: Artwork[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
  }
  config: {
    iiif_url: string
  }
}

/**
 * Data source for the Art Institute of Chicago API
 */
export class ArtworkApi {
  private readonly baseUrl = 'https://api.artic.edu/api/v1'

  /**
   * Build query parameters for Art Institute of Chicago API
   */
  private buildParams(
    query?: string,
    filters?: ArtworkFilters
  ): URLSearchParams {
    const searchParams = new URLSearchParams()

    // Add required fields
    const fields = [
      'id',
      'title',
      'artist_title',
      'date_display',
      'image_id',
      'description',
      'provenance_text',
      'publication_history',
      'exhibition_history',
      'credit_line',
      'place_of_origin',
      'medium_display',
      'dimensions',
      'artwork_type_title',
      'department_title',
      'artist_display',
    ]
    searchParams.append('fields', fields.join(','))

    // Add search query if provided
    if (query) {
      searchParams.append('q', query)
    }

    // Add filters using the correct API format: query[term][field]=value
    if (filters) {
      if (filters.department) {
        searchParams.append(
          'query[match][department_title]',
          filters.department
        )
      }
      if (filters.artworkType) {
        searchParams.append(
          'query[match][artwork_type_title]',
          filters.artworkType
        )
      }
      if (filters.placeOfOrigin) {
        searchParams.append(
          'query[match][place_of_origin]',
          filters.placeOfOrigin
        )
      }
      if (filters.medium) {
        searchParams.append('query[match][medium_display]', filters.medium)
      }
    }

    return searchParams
  }

  /**
   * Fetch paginated artworks from the API
   */
  async fetchArtworks(page = 1, limit = 9): Promise<ArtworkApiResponse> {
    try {
      const searchParams = this.buildParams()
      searchParams.append('page', page.toString())
      searchParams.append('limit', limit.toString())

      const response = await fetch(
        `${this.baseUrl}/artworks?${searchParams.toString()}`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching artworks:', error)
      throw error
    }
  }

  /**
   * Fetch basic artwork info by ID (optimized for cards)
   */
  async fetchArtworkBasicById(id: number): Promise<Artwork> {
    try {
      const response = await fetch(
        `${this.baseUrl}/artworks/${id}?fields=id,title,artist_title,date_display,image_id,artwork_type_title,department_title,place_of_origin,medium_display`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error(`Error fetching basic artwork with id ${id}:`, error)
      throw error
    }
  }

  /**
   * Fetch detailed artwork info by ID (for detail pages)
   */
  async fetchArtworkDetailById(id: number): Promise<Artwork> {
    try {
      const response = await fetch(
        `${this.baseUrl}/artworks/${id}?fields=id,title,artist_title,date_display,image_id,description,provenance_text,publication_history,exhibition_history,credit_line,place_of_origin,medium_display,dimensions,artwork_type_title,department_title,artist_display`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error(`Error fetching detailed artwork with id ${id}:`, error)
      throw error
    }
  }

  /**
   * Fetch a single artwork by ID (legacy - use fetchArtworkDetailById instead)
   * @deprecated Use fetchArtworkBasicById or fetchArtworkDetailById instead
   */
  async fetchArtworkById(id: number): Promise<Artwork> {
    return this.fetchArtworkDetailById(id)
  }

  /**
   * Search for artworks by query string
   */
  async searchArtworks(
    query: string,
    filters?: ArtworkFilters
  ): Promise<ArtworkApiResponse> {
    try {
      const searchParams = this.buildParams(query, filters)
      const response = await fetch(
        `${this.baseUrl}/artworks/search?${searchParams.toString()}`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error searching artworks:', error)
      throw error
    }
  }

  /**
   * Search for artworks by query string with pagination
   */
  async searchArtworksPaginated(
    query: string,
    page = 1,
    limit = 9,
    filters?: ArtworkFilters
  ): Promise<ArtworkApiResponse> {
    try {
      const searchParams = this.buildParams(query, filters)
      searchParams.append('page', page.toString())
      searchParams.append('limit', limit.toString())

      const response = await fetch(
        `${this.baseUrl}/artworks/search?${searchParams.toString()}`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error searching artworks with pagination:', error)
      throw error
    }
  }
}

// Singleton instance
export const artworkApi = new ArtworkApi()
