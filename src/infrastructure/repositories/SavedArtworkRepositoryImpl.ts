'use client'

import type { Artwork, SavedArtwork } from '@/core/domain/entities/Artwork'
import type { ISavedArtworkRepository } from '@/core/application/interfaces/ISavedArtworkRepository'
import { localStorageService } from '../services/LocalStorageService'

/**
 * Implementation of ISavedArtworkRepository that uses local storage
 */
export class SavedArtworkRepositoryImpl implements ISavedArtworkRepository {
  private readonly STORAGE_KEY = 'saved_artworks'

  /**
   * Save an artwork to the user's collection
   */
  async saveArtwork(artwork: Artwork): Promise<void> {
    try {
      // Get current saved artworks
      const savedArtworks = await this.getAllSavedArtworks()

      // Check if artwork is already saved
      const exists = savedArtworks.some((item) => item.id === artwork.id)
      if (exists) {
        return
      }

      // Add new artwork with timestamp
      const artworkToSave: SavedArtwork = {
        ...artwork,
        savedAt: Date.now(),
      }

      // Save updated list
      await localStorageService.setItem(this.STORAGE_KEY, [
        ...savedArtworks,
        artworkToSave,
      ])
    } catch (error) {
      console.error('Error saving artwork:', error)
      throw error
    }
  }

  /**
   * Remove an artwork from the user's collection
   */
  async removeArtwork(id: number): Promise<void> {
    try {
      const savedArtworks = await this.getAllSavedArtworks()
      const updatedArtworks = savedArtworks.filter(
        (artwork) => artwork.id !== id
      )
      await localStorageService.setItem(this.STORAGE_KEY, updatedArtworks)
    } catch (error) {
      console.error('Error removing artwork:', error)
      throw error
    }
  }

  /**
   * Get all saved artworks
   */
  async getAllSavedArtworks(): Promise<SavedArtwork[]> {
    try {
      const savedArtworks = await localStorageService.getItem<SavedArtwork[]>(
        this.STORAGE_KEY
      )
      return savedArtworks ?? []
    } catch (error) {
      console.error('Error getting saved artworks:', error)
      throw error
    }
  }

  /**
   * Check if an artwork is saved
   */
  async isArtworkSaved(id: number): Promise<boolean> {
    try {
      const savedArtworks = await this.getAllSavedArtworks()
      return savedArtworks.some((artwork) => artwork.id === id)
    } catch (error) {
      console.error('Error checking if artwork is saved:', error)
      throw error
    }
  }

  async clearArtworks(): Promise<void> {
    try {
      await localStorageService.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing saved artworks:', error)
      throw error
    }
  }
}

// Export a singleton instance
export const savedArtworkRepository = new SavedArtworkRepositoryImpl()
