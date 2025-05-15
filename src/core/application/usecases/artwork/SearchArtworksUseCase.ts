import type { Artwork } from '../../../domain/entities/Artwork'
import type { IArtworkRepository } from '../../interfaces/IArtworkRepository'

/**
 * Use case for searching artworks by query
 */
export class SearchArtworksUseCase {
  private artworkRepository: IArtworkRepository
  constructor(artworkRepository: IArtworkRepository) {
    this.artworkRepository = artworkRepository
  }

  /**
   * Execute the use case
   * @param query Search query string
   */
  async execute(query: string): Promise<Artwork[]> {
    return this.artworkRepository.searchArtworks(query)
  }
}
