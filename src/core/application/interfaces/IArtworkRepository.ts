import type { Artwork } from '../../domain/entities/Artwork'

/**
 * Filters for artwork queries
 */
export interface ArtworkFilters {
  department?: string
  artworkType?: string
  placeOfOrigin?: string
  medium?: string
}

/**
 * Response format for paginated artwork queries
 */
export interface ArtworkPaginationResult {
  artworks: Artwork[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
  }
}

/**
 * Repository interface for artwork operations
 */
export interface IArtworkRepository {
  /**
   * Get a paginated list of artworks
   */
  getArtworks(
    page: number,
    limit: number,
    filters?: ArtworkFilters
  ): Promise<ArtworkPaginationResult>

  /**
   * Get a single artwork by ID
   */
  getArtworkById(id: number): Promise<Artwork>

  /**
   * Search for artworks matching a query
   */
  searchArtworks(query: string, filters?: ArtworkFilters): Promise<Artwork[]>
}
