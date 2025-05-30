import type { IDislikedArtworkRepository } from '../../interfaces/IDislikedArtworkRepository'

/**
 * Use case for removing an artwork from the user's disliked collection
 */
export class RemoveDislikedArtworkUseCase {
  private readonly dislikedArtworkRepository: IDislikedArtworkRepository
  constructor(dislikedArtworkRepository: IDislikedArtworkRepository) {
    this.dislikedArtworkRepository = dislikedArtworkRepository
  }

  /**
   * Execute the use case
   * @param id ID of the artwork to remove from dislikes
   */
  async execute(id: number): Promise<void> {
    return this.dislikedArtworkRepository.removeDislikedArtwork(id)
  }
}
