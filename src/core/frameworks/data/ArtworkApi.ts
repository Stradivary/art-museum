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
   * Build filter query parameters
   */
  private buildFilterParams(filters?: ArtworkFilters): string {
    if (!filters) return ''

    const filterParams: string[] = []

    if (filters.department) {
      filterParams.push(
        `department_title:${encodeURIComponent(filters.department)}`
      )
    }
    if (filters.artworkType) {
      filterParams.push(
        `artwork_type_title:${encodeURIComponent(filters.artworkType)}`
      )
    }
    if (filters.placeOfOrigin) {
      filterParams.push(
        `place_of_origin:${encodeURIComponent(filters.placeOfOrigin)}`
      )
    }
    if (filters.medium) {
      filterParams.push(`medium_display:${encodeURIComponent(filters.medium)}`)
    }

    return filterParams.length > 0 ? `&fq=${filterParams.join(' AND ')}` : ''
  }

  /**
   * Fetch paginated artworks from the API
   */
  async fetchArtworks(
    page = 1,
    limit = 9,
    filters?: ArtworkFilters
  ): Promise<ArtworkApiResponse> {
    try {
      const filterParams = this.buildFilterParams(filters)
      const response = await fetch(
        `${this.baseUrl}/artworks?page=${page}&limit=${limit}&fields=id,title,artist_title,date_display,image_id,description,provenance_text,publication_history,exhibition_history,credit_line,place_of_origin,medium_display,dimensions,artwork_type_title,department_title,artist_display${filterParams}`
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
   * Fetch a single artwork by ID
   */
  async fetchArtworkById(id: number): Promise<Artwork> {
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
      console.error(`Error fetching artwork with id ${id}:`, error)
      throw error
    }
  }

  /**
   * Search for artworks by query string
   */
  async searchArtworks(
    query: string,
    filters?: ArtworkFilters
  ): Promise<ArtworkApiResponse> {
    try {
      const filterParams = this.buildFilterParams(filters)
      const response = await fetch(
        `${this.baseUrl}/artworks/search?q=${encodeURIComponent(query)}&fields=id,title,artist_title,date_display,image_id,description,provenance_text,publication_history,exhibition_history,credit_line,place_of_origin,medium_display,dimensions,artwork_type_title,department_title,artist_display&limit=20${filterParams}`
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
}

// Singleton instance
export const artworkApi = new ArtworkApi()
