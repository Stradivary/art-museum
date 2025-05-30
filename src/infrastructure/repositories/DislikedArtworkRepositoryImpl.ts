'use client'

import type { Artwork, DislikedArtwork } from '@/core/domain/entities/Artwork'
import type { IDislikedArtworkRepository } from '@/core/application/interfaces/IDislikedArtworkRepository'
import { localStorageService } from '../services/LocalStorageService'

/**
 * Implementation of IDislikedArtworkRepository that uses local storage
 */
export class DislikedArtworkRepositoryImpl
  implements IDislikedArtworkRepository
{
  private readonly STORAGE_KEY = 'disliked_artworks'

  /**
   * Add an artwork to the user's disliked collection
   */
  async dislikeArtwork(artwork: Artwork): Promise<void> {
    try {
      // Get current disliked artworks
      const dislikedArtworks = await this.getAllDislikedArtworks()

      // Check if artwork is already disliked
      const exists = dislikedArtworks.some((item) => item.id === artwork.id)
      if (exists) {
        return
      }

      // Add new artwork with timestamp
      const artworkToDislike: DislikedArtwork = {
        ...artwork,
        dislikedAt: Date.now(),
      }

      // Save updated list
      await localStorageService.setItem(this.STORAGE_KEY, [
        ...dislikedArtworks,
        artworkToDislike,
      ])
    } catch (error) {
      console.error('Error disliking artwork:', error)
      throw error
    }
  }

  /**
   * Remove an artwork from the user's disliked collection
   */
  async removeDislikedArtwork(id: number): Promise<void> {
    try {
      const dislikedArtworks = await this.getAllDislikedArtworks()
      const updatedArtworks = dislikedArtworks.filter(
        (artwork) => artwork.id !== id
      )
      await localStorageService.setItem(this.STORAGE_KEY, updatedArtworks)
    } catch (error) {
      console.error('Error removing disliked artwork:', error)
      throw error
    }
  }

  /**
   * Get all disliked artworks
   */
  async getAllDislikedArtworks(): Promise<DislikedArtwork[]> {
    try {
      const dislikedArtworks = await localStorageService.getItem<
        DislikedArtwork[]
      >(this.STORAGE_KEY)
      return dislikedArtworks ?? []
    } catch (error) {
      console.error('Error getting disliked artworks:', error)
      throw error
    }
  }

  /**
   * Check if an artwork is disliked
   */
  async isArtworkDisliked(id: number): Promise<boolean> {
    try {
      const dislikedArtworks = await this.getAllDislikedArtworks()
      return dislikedArtworks.some((artwork) => artwork.id === id)
    } catch (error) {
      console.error('Error checking if artwork is disliked:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const dislikedArtworkRepository = new DislikedArtworkRepositoryImpl()
