import type {
  IArtworkRepository,
  ArtworkPaginationResult,
  ArtworkFilters,
} from '../../interfaces/IArtworkRepository'

/**
 * Use case for retrieving paginated artworks
 */
export class GetArtworksUseCase {
  private readonly artworkRepository: IArtworkRepository
  constructor(artworkRepository: IArtworkRepository) {
    this.artworkRepository = artworkRepository
  }

  /**
   * Execute the use case
   * @param page Page number (starting from 1)
   * @param limit Number of items per page
   * @param filters Optional filters to apply
   */
  async execute(
    page = 1,
    limit = 10,
    filters?: ArtworkFilters
  ): Promise<ArtworkPaginationResult> {
    return this.artworkRepository.getArtworks(page, limit, filters)
  }
}
