import type { ISavedArtworkRepository } from '../../interfaces/ISavedArtworkRepository'

/**
 * Use case for removing a saved artwork from the user's collection
 */
export class RemoveSavedArtworkUseCase {
  private savedArtworkRepository: ISavedArtworkRepository
  constructor(savedArtworkRepository: ISavedArtworkRepository) {
    this.savedArtworkRepository = savedArtworkRepository
  }

  /**
   * Execute the use case
   * @param id ID of the artwork to remove
   */
  async execute(id: number): Promise<void> {
    return this.savedArtworkRepository.removeArtwork(id)
  }
}
