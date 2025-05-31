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
  getArtworks(page: number, limit: number): Promise<ArtworkPaginationResult>

  /**
   * Get basic artwork info by ID (optimized for cards)
   */
  getArtworkBasicById(id: number): Promise<Artwork>

  /**
   * Get detailed artwork info by ID (for detail pages)
   */
  getArtworkDetailById(id: number): Promise<Artwork>

  /**
   * Get a single artwork by ID (legacy method)
   * @deprecated Use getArtworkBasicById or getArtworkDetailById instead
   */
  getArtworkById(id: number): Promise<Artwork>

  /**
   * Search for artworks matching a query
   */
  searchArtworks(query: string, filters?: ArtworkFilters): Promise<Artwork[]>

  /**
   * Search for artworks matching a query with pagination
   */
  searchArtworksPaginated(
    query: string,
    page: number,
    limit: number,
    filters?: ArtworkFilters
  ): Promise<ArtworkPaginationResult>
}
