import type { Artwork, DislikedArtwork } from '../../domain/entities/Artwork'

/**
 * Repository interface for disliked artwork operations
 */
export interface IDislikedArtworkRepository {
  /**
   * Add an artwork to the user's disliked collection
   */
  dislikeArtwork(artwork: Artwork): Promise<void>

  /**
   * Remove an artwork from the user's disliked collection
   */
  removeDislikedArtwork(id: number): Promise<void>

  /**
   * Get all disliked artworks
   */
  getAllDislikedArtworks(): Promise<DislikedArtwork[]>

  /**
   * Check if an artwork is disliked
   */
  isArtworkDisliked(id: number): Promise<boolean>
}
