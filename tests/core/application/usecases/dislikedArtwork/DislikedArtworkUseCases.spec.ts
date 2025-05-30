import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DislikeArtworkUseCase } from '@/core/application/usecases/dislikedArtwork/DislikeArtworkUseCase'
import { RemoveDislikedArtworkUseCase } from '@/core/application/usecases/dislikedArtwork/RemoveDislikedArtworkUseCase'
import { GetAllDislikedArtworksUseCase } from '@/core/application/usecases/dislikedArtwork/GetAllDislikedArtworksUseCase'
import { IsArtworkDislikedUseCase } from '@/core/application/usecases/dislikedArtwork/IsArtworkDislikedUseCase'
import type { IDislikedArtworkRepository } from '@/core/application/interfaces/IDislikedArtworkRepository'
import type { Artwork, DislikedArtwork } from '@/core/domain/entities/Artwork'

// Mock artwork data
const mockArtwork: Artwork = {
  id: 1,
  title: 'Test Artwork',
  artist_title: 'Test Artist',
  image_id: 'test-image',
  date_display: '2023',
  artist_display: 'Test Artist',
  place_of_origin: 'Test Place',
  description: 'Test description',
  medium_display: 'Oil on canvas',
  dimensions: '100 x 100 cm',
  credit_line: 'Test Museum',
  main_reference_number: 'TEST.001',
  has_not_been_viewed_much: false,
  boost_rank: null,
  date_start: 2023,
  date_end: 2023,
  date_qualifier_title: null,
  date_qualifier_id: null,
  artist_id: 1,
  artist_ids: [1],
  category_ids: [],
  category_titles: [],
  term_titles: [],
  style_id: null,
  style_title: null,
  alt_style_ids: [],
  style_ids: [],
  style_titles: [],
  classification_id: null,
  classification_title: null,
  alt_classification_ids: [],
  classification_ids: [],
  classification_titles: [],
  subject_id: null,
  alt_subject_ids: [],
  subject_ids: [],
  subject_titles: [],
  material_id: null,
  alt_material_ids: [],
  material_ids: [],
  material_titles: [],
  technique_id: null,
  alt_technique_ids: [],
  technique_ids: [],
  technique_titles: [],
  theme_titles: [],
  image_url: null,
  thumbnail: null,
  is_on_view: false,
  on_loan_display: null,
  gallery_title: null,
  gallery_id: null,
  nomisma_id: null,
  artwork_type_title: 'Painting',
  artwork_type_id: 1,
  department_title: 'Test Department',
  department_id: 1,
  artist_title_raw: 'Test Artist',
  catalogue_display: null,
  publication_history: null,
  exhibition_history: null,
  provenance_text: null,
  edition: null,
  publishing_verification_level: 'Web Cataloged',
  internal_department_id: 1,
  fiscal_year: 2023,
  fiscal_year_deaccession: null,
  is_public_domain: true,
  is_zoomable: true,
  max_zoom_window_size: 843,
  copyright_notice: null,
  has_multimedia_resources: false,
  has_educational_resources: false,
  has_advanced_imaging: false,
  colorfulness: 50,
  color: null,
  latitude: null,
  longitude: null,
  latlon: null,
  is_deaccession: false,
  is_public: true,
  is_highlight: false,
  is_iconic: false,
  color_dominance: null,
}

describe('Disliked Artwork Use Cases', () => {
  let mockRepository: IDislikedArtworkRepository
  let dislikeArtworkUseCase: DislikeArtworkUseCase
  let removeDislikedArtworkUseCase: RemoveDislikedArtworkUseCase
  let getAllDislikedArtworksUseCase: GetAllDislikedArtworksUseCase
  let isArtworkDislikedUseCase: IsArtworkDislikedUseCase

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      dislikeArtwork: vi.fn(),
      removeDislikedArtwork: vi.fn(),
      getAllDislikedArtworks: vi.fn(),
      isArtworkDisliked: vi.fn(),
    }

    // Initialize use cases
    dislikeArtworkUseCase = new DislikeArtworkUseCase(mockRepository)
    removeDislikedArtworkUseCase = new RemoveDislikedArtworkUseCase(
      mockRepository
    )
    getAllDislikedArtworksUseCase = new GetAllDislikedArtworksUseCase(
      mockRepository
    )
    isArtworkDislikedUseCase = new IsArtworkDislikedUseCase(mockRepository)
  })

  describe('DislikeArtworkUseCase', () => {
    it('should call repository dislikeArtwork method', async () => {
      await dislikeArtworkUseCase.execute(mockArtwork)

      expect(mockRepository.dislikeArtwork).toHaveBeenCalledWith(mockArtwork)
      expect(mockRepository.dislikeArtwork).toHaveBeenCalledTimes(1)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Repository error')
      vi.mocked(mockRepository.dislikeArtwork).mockRejectedValue(error)

      await expect(dislikeArtworkUseCase.execute(mockArtwork)).rejects.toThrow(
        'Repository error'
      )
    })
  })

  describe('RemoveDislikedArtworkUseCase', () => {
    it('should call repository removeDislikedArtwork method', async () => {
      await removeDislikedArtworkUseCase.execute(mockArtwork.id)

      expect(mockRepository.removeDislikedArtwork).toHaveBeenCalledWith(
        mockArtwork.id
      )
      expect(mockRepository.removeDislikedArtwork).toHaveBeenCalledTimes(1)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Repository error')
      vi.mocked(mockRepository.removeDislikedArtwork).mockRejectedValue(error)

      await expect(
        removeDislikedArtworkUseCase.execute(mockArtwork.id)
      ).rejects.toThrow('Repository error')
    })
  })

  describe('GetAllDislikedArtworksUseCase', () => {
    it('should return all disliked artworks from repository', async () => {
      const dislikedArtworks: DislikedArtwork[] = [
        {
          ...mockArtwork,
          dislikedAt: Date.now(),
        },
      ]
      vi.mocked(mockRepository.getAllDislikedArtworks).mockResolvedValue(
        dislikedArtworks
      )

      const result = await getAllDislikedArtworksUseCase.execute()

      expect(result).toEqual(dislikedArtworks)
      expect(mockRepository.getAllDislikedArtworks).toHaveBeenCalledTimes(1)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Repository error')
      vi.mocked(mockRepository.getAllDislikedArtworks).mockRejectedValue(error)

      await expect(getAllDislikedArtworksUseCase.execute()).rejects.toThrow(
        'Repository error'
      )
    })
  })

  describe('IsArtworkDislikedUseCase', () => {
    it('should return true when artwork is disliked', async () => {
      vi.mocked(mockRepository.isArtworkDisliked).mockResolvedValue(true)

      const result = await isArtworkDislikedUseCase.execute(mockArtwork.id)

      expect(result).toBe(true)
      expect(mockRepository.isArtworkDisliked).toHaveBeenCalledWith(
        mockArtwork.id
      )
      expect(mockRepository.isArtworkDisliked).toHaveBeenCalledTimes(1)
    })

    it('should return false when artwork is not disliked', async () => {
      vi.mocked(mockRepository.isArtworkDisliked).mockResolvedValue(false)

      const result = await isArtworkDislikedUseCase.execute(mockArtwork.id)

      expect(result).toBe(false)
      expect(mockRepository.isArtworkDisliked).toHaveBeenCalledWith(
        mockArtwork.id
      )
      expect(mockRepository.isArtworkDisliked).toHaveBeenCalledTimes(1)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Repository error')
      vi.mocked(mockRepository.isArtworkDisliked).mockRejectedValue(error)

      await expect(
        isArtworkDislikedUseCase.execute(mockArtwork.id)
      ).rejects.toThrow('Repository error')
    })
  })
})
