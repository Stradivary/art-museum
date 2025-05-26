import type { Artwork } from '../../../domain/entities/Artwork'
import type {
  IArtworkRepository,
  ArtworkFilters,
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
}
