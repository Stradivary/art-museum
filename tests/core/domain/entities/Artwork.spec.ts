import { describe, it, expect } from 'vitest'
import type { Artwork, SavedArtwork } from '@/core/domain/entities/Artwork'

describe('Artwork Entity', () => {
  it('should have all required properties', () => {
    const artwork: Artwork = {
      id: 1,
      title: 'Test Artwork',
      artist_title: 'Test Artist',
      date_display: '2023',
      image_id: 'test-image',
      description: 'Test description',
      provenance_text: 'Test provenance',
      publication_history: 'Test publication',
      exhibition_history: 'Test exhibition',
      credit_line: 'Test credit',
      place_of_origin: 'Test place',
      medium_display: 'Test medium',
      dimensions: 'Test dimensions',
      artwork_type_title: 'Test type',
      department_title: 'Test department',
      artist_display: 'Test artist display',
    }

    expect(artwork).toBeDefined()
    expect(artwork.id).toBe(1)
    expect(artwork.title).toBe('Test Artwork')
    expect(artwork.artist_title).toBe('Test Artist')
  })

  it('should allow null values for optional properties', () => {
    const artwork: Artwork = {
      id: 1,
      title: 'Test Artwork',
      artist_title: null,
      date_display: null,
      image_id: null,
      description: null,
      provenance_text: null,
      publication_history: null,
      exhibition_history: null,
      credit_line: null,
      place_of_origin: null,
      medium_display: null,
      dimensions: null,
      artwork_type_title: null,
      department_title: null,
      artist_display: null,
    }

    expect(artwork).toBeDefined()
    expect(artwork.artist_title).toBeNull()
    expect(artwork.image_id).toBeNull()
  })
})

describe('SavedArtwork Entity', () => {
  it('should extend Artwork with savedAt timestamp', () => {
    const now = Date.now()
    const savedArtwork: SavedArtwork = {
      id: 1,
      title: 'Test Artwork',
      artist_title: 'Test Artist',
      date_display: '2023',
      image_id: 'test-image',
      description: 'Test description',
      provenance_text: 'Test provenance',
      publication_history: 'Test publication',
      exhibition_history: 'Test exhibition',
      credit_line: 'Test credit',
      place_of_origin: 'Test place',
      medium_display: 'Test medium',
      dimensions: 'Test dimensions',
      artwork_type_title: 'Test type',
      department_title: 'Test department',
      artist_display: 'Test artist display',
      savedAt: now,
    }

    expect(savedArtwork).toBeDefined()
    expect(savedArtwork.savedAt).toBe(now)
    expect(savedArtwork.id).toBe(1)
    expect(savedArtwork.title).toBe('Test Artwork')
  })
})
