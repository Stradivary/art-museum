import type { Artwork } from '../../../domain/entities/Artwork'
import type { IArtworkRepository } from '../../interfaces/IArtworkRepository'

/**
 * Use case for retrieving detailed artwork info by ID (for detail pages)
 */
export class GetArtworkDetailByIdUseCase {
  private readonly artworkRepository: IArtworkRepository
  constructor(artworkRepository: IArtworkRepository) {
    this.artworkRepository = artworkRepository
  }

  /**
   * Execute the use case
   * @param id Artwork ID to retrieve
   */
  async execute(id: number): Promise<Artwork> {
    return this.artworkRepository.getArtworkDetailById(id)
  }
}
