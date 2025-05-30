import type { Artwork } from '@/core/domain/entities/Artwork'
import type { IDislikedArtworkRepository } from '../../interfaces/IDislikedArtworkRepository'

/**
 * Use case for adding an artwork to the user's disliked collection
 */
export class DislikeArtworkUseCase {
  private readonly dislikedArtworkRepository: IDislikedArtworkRepository

  constructor(dislikedArtworkRepository: IDislikedArtworkRepository) {
    this.dislikedArtworkRepository = dislikedArtworkRepository
  }

  /**
   * Execute the use case
   * @param artwork Artwork to dislike
   */
  async execute(artwork: Artwork): Promise<void> {
    return this.dislikedArtworkRepository.dislikeArtwork(artwork)
  }
}
