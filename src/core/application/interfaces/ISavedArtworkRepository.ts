import type { Artwork, SavedArtwork } from "../../domain/entities/Artwork"

/**
 * Repository interface for saved artwork operations
 */
export interface ISavedArtworkRepository {
  /**
   * Save an artwork to the user's collection
   */
  saveArtwork(artwork: Artwork): Promise<void>

  /**
   * Remove an artwork from the user's collection
   */
  removeArtwork(id: number): Promise<void>

  /**
   * Get all saved artworks
   */
  getAllSavedArtworks(): Promise<SavedArtwork[]>

  /**
   * Check if an artwork is saved
   */
  isArtworkSaved(id: number): Promise<boolean>
}