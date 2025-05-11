import type { IArtworkRepository, ArtworkPaginationResult } from "../../interfaces/IArtworkRepository"

/**
 * Use case for retrieving paginated artworks
 */
export class GetArtworksUseCase {
  private artworkRepository: IArtworkRepository
  constructor(artworkRepository: IArtworkRepository) {
    this.artworkRepository = artworkRepository
  }

  /**
   * Execute the use case
   * @param page Page number (starting from 1)
   * @param limit Number of items per page
   */
  async execute(page = 1, limit = 10): Promise<ArtworkPaginationResult> {
    return this.artworkRepository.getArtworks(page, limit)
  }
}