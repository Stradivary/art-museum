import type { ISavedArtworkRepository } from '../../interfaces/ISavedArtworkRepository'

/**
 * Use case for checking if an artwork is saved in the user's collection
 */
export class IsArtworkSavedUseCase {
  private savedArtworkRepository: ISavedArtworkRepository
  constructor(savedArtworkRepository: ISavedArtworkRepository) {
    this.savedArtworkRepository = savedArtworkRepository
  }

  /**
   * Execute the use case
   * @param id ID of the artwork to check
   */
  async execute(id: number): Promise<boolean> {
    return this.savedArtworkRepository.isArtworkSaved(id)
  }
}
