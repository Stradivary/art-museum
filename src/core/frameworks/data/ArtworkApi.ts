'use client'

import type { Artwork } from '@/core/domain/entities/Artwork'

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
  private baseUrl = 'https://api.artic.edu/api/v1'

  /**
   * Fetch paginated artworks from the API
   */
  async fetchArtworks(page = 1, limit = 10): Promise<ArtworkApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/artworks?page=${page}&limit=${limit}&fields=id,title,artist_title,date_display,image_id,description,provenance_text,publication_history,exhibition_history,credit_line,place_of_origin,medium_display,dimensions,artwork_type_title,department_title,artist_display`
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
  async searchArtworks(query: string): Promise<ArtworkApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/artworks/search?q=${encodeURIComponent(query)}&fields=id,title,artist_title,date_display,image_id,description,provenance_text,publication_history,exhibition_history,credit_line,place_of_origin,medium_display,dimensions,artwork_type_title,department_title,artist_display&limit=20`
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
