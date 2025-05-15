/**
 * Core domain entity representing an artwork
 */
export interface Artwork {
  id: number
  title: string
  artist_title: string | null
  date_display: string | null
  image_id: string | null
  description: string | null
  provenance_text: string | null
  publication_history: string | null
  exhibition_history: string | null
  credit_line: string | null
  place_of_origin: string | null
  medium_display: string | null
  dimensions: string | null
  artwork_type_title: string | null
  department_title: string | null
  artist_display: string | null
}

/**
 * Extension of Artwork that includes a saved timestamp
 */
export interface SavedArtwork extends Artwork {
  savedAt: number
}
