import type { IDislikedArtworkRepository } from '../../interfaces/IDislikedArtworkRepository'

/**
 * Use case for checking if an artwork is disliked
 */
export class IsArtworkDislikedUseCase {
  private readonly dislikedArtworkRepository: IDislikedArtworkRepository
  constructor(dislikedArtworkRepository: IDislikedArtworkRepository) {
    this.dislikedArtworkRepository = dislikedArtworkRepository
  }

  /**
   * Execute the use case
   * @param id ID of the artwork to check
   */
  async execute(id: number): Promise<boolean> {
    return this.dislikedArtworkRepository.isArtworkDisliked(id)
  }
}
