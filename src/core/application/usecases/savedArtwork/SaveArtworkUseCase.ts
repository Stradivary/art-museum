import type { Artwork } from '@/core/domain/entities/Artwork'
import type { ISavedArtworkRepository } from '../../interfaces/ISavedArtworkRepository'

/**
 * Use case for saving an artwork to the user's collection
 */
export class SaveArtworkUseCase {
  private savedArtworkRepository: ISavedArtworkRepository

  constructor(savedArtworkRepository: ISavedArtworkRepository) {
    this.savedArtworkRepository = savedArtworkRepository
  }

  /**
   * Execute the use case
   * @param artwork Artwork to save
   */
  async execute(artwork: Artwork): Promise<void> {
    return this.savedArtworkRepository.saveArtwork(artwork)
  }
}
