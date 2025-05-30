import type { DislikedArtwork } from '@/core/domain/entities/Artwork'
import type { IDislikedArtworkRepository } from '../../interfaces/IDislikedArtworkRepository'

/**
 * Use case for getting all disliked artworks from the user's collection
 */
export class GetAllDislikedArtworksUseCase {
  private readonly dislikedArtworkRepository: IDislikedArtworkRepository

  constructor(dislikedArtworkRepository: IDislikedArtworkRepository) {
    this.dislikedArtworkRepository = dislikedArtworkRepository
  }

  /**
   * Execute the use case
   */
  async execute(): Promise<DislikedArtwork[]> {
    return this.dislikedArtworkRepository.getAllDislikedArtworks()
  }
}
