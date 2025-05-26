import type { Artwork, SavedArtwork } from '@/core/domain/entities/Artwork'
import type { ArtworkPaginationResult } from '@/core/application/interfaces/IArtworkRepository'

export const mockArtwork: Artwork = {
  id: 1,
  title: 'The Starry Night',
  artist_title: 'Vincent van Gogh',
  date_display: '1889',
  image_id: 'test-image-id',
  description: 'A famous painting of a swirling night sky',
  provenance_text: 'Test provenance',
  publication_history: 'Test publication history',
  exhibition_history: 'Test exhibition history',
  credit_line: 'Test credit line',
  place_of_origin: 'France',
  medium_display: 'Oil on canvas',
  dimensions: '73.7 cm × 92.1 cm',
  artwork_type_title: 'Painting',
  department_title: 'Modern Art',
  artist_display: 'Vincent van Gogh (Dutch, 1853-1890)',
}

export const mockArtwork2: Artwork = {
  id: 2,
  title: 'Mona Lisa',
  artist_title: 'Leonardo da Vinci',
  date_display: '1503-1519',
  image_id: 'test-image-id-2',
  description: 'Famous portrait painting',
  provenance_text: null,
  publication_history: null,
  exhibition_history: null,
  credit_line: 'Test credit line 2',
  place_of_origin: 'Italy',
  medium_display: 'Oil on wood',
  dimensions: '77 cm × 53 cm',
  artwork_type_title: 'Painting',
  department_title: 'European Art',
  artist_display: 'Leonardo da Vinci (Italian, 1452-1519)',
}

export const mockSavedArtwork: SavedArtwork = {
  ...mockArtwork,
  savedAt: Date.now(),
}

export const mockArtworkPaginationResult: ArtworkPaginationResult = {
  artworks: [mockArtwork, mockArtwork2],
  pagination: {
    total: 2,
    limit: 12,
    offset: 0,
    total_pages: 1,
    current_page: 1,
  },
}

export const mockApiResponse = {
  data: [
    {
      id: 1,
      title: 'The Starry Night',
      artist_title: 'Vincent van Gogh',
      date_display: '1889',
      image_id: 'test-image-id',
      description: 'A famous painting of a swirling night sky',
      provenance_text: 'Test provenance',
      publication_history: 'Test publication history',
      exhibition_history: 'Test exhibition history',
      credit_line: 'Test credit line',
      place_of_origin: 'France',
      medium_display: 'Oil on canvas',
      dimensions: '73.7 cm × 92.1 cm',
      artwork_type_title: 'Painting',
      department_title: 'Modern Art',
      artist_display: 'Vincent van Gogh (Dutch, 1853-1890)',
    },
  ],
  pagination: {
    total: 1,
    limit: 12,
    offset: 0,
    total_pages: 1,
    current_page: 1,
  },
}

export const mockPaginatedArtworks = mockArtworkPaginationResult
