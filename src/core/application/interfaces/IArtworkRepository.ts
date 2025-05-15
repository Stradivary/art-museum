import type { Artwork } from '../../domain/entities/Artwork'

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
   * Get a single artwork by ID
   */
  getArtworkById(id: number): Promise<Artwork>

  /**
   * Search for artworks matching a query
   */
  searchArtworks(query: string): Promise<Artwork[]>
}
