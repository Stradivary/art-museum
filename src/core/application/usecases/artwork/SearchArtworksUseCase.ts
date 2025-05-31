import type { Artwork } from '../../../domain/entities/Artwork'
import type {
  IArtworkRepository,
  ArtworkFilters,
  ArtworkPaginationResult,
} from '../../interfaces/IArtworkRepository'

/**
 * Use case for searching artworks by query
 */
export class SearchArtworksUseCase {
  private readonly artworkRepository: IArtworkRepository
  constructor(artworkRepository: IArtworkRepository) {
    this.artworkRepository = artworkRepository
  }

  /**
   * Execute the use case
   * @param query Search query string
   * @param filters Optional filters to apply
   */
  async execute(query: string, filters?: ArtworkFilters): Promise<Artwork[]> {
    return this.artworkRepository.searchArtworks(query, filters)
  }

  /**
   * Execute the use case with pagination
   * @param query Search query string
   * @param page Page number (starting from 1)
   * @param limit Number of items per page
   * @param filters Optional filters to apply
   */
  async executePaginated(
    query: string,
    page = 1,
    limit = 10,
    filters?: ArtworkFilters
  ): Promise<ArtworkPaginationResult> {
    return this.artworkRepository.searchArtworksPaginated(
      query,
      page,
      limit,
      filters
    )
  }
}
