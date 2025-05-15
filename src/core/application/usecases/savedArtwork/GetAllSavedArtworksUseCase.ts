import type { SavedArtwork } from '../../../domain/entities/Artwork'
import type { ISavedArtworkRepository } from '../../interfaces/ISavedArtworkRepository'

/**
 * Use case for retrieving all saved artworks
 */
export class GetAllSavedArtworksUseCase {
  private savedArtworkRepository: ISavedArtworkRepository
  constructor(savedArtworkRepository: ISavedArtworkRepository) {
    this.savedArtworkRepository = savedArtworkRepository
  }

  /**
   * Execute the use case
   */
  async execute(): Promise<SavedArtwork[]> {
    return this.savedArtworkRepository.getAllSavedArtworks()
  }
}
