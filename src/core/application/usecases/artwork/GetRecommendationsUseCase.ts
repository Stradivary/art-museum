import type { Artwork } from '../../../domain/entities/Artwork'
import type {
  IArtworkRepository,
  ArtworkFilters,
} from '../../interfaces/IArtworkRepository'
import type { ISavedArtworkRepository } from '../../interfaces/ISavedArtworkRepository'
import type { IDislikedArtworkRepository } from '../../interfaces/IDislikedArtworkRepository'

export interface RecommendationSummary {
  totalRecommendations: number
  reasons: string[]
  filters: ArtworkFilters
}

export interface RecommendationResult {
  recommendations: Artwork[]
  summary: RecommendationSummary
}

export type Preferences = {
  departments: [string, number][]
  artworkTypes: [string, number][]
  placesOfOrigin: [string, number][]
  mediums: [string, number][]
  artists: [string, number][]
}

/**
 * Use case for generating artwork recommendations based on user's saved artworks
 */
export class GetRecommendationsUseCase {
  private readonly artworkRepository: IArtworkRepository
  private readonly savedArtworkRepository: ISavedArtworkRepository
  private readonly dislikedArtworkRepository: IDislikedArtworkRepository

  constructor(
    artworkRepository: IArtworkRepository,
    savedArtworkRepository: ISavedArtworkRepository,
    dislikedArtworkRepository: IDislikedArtworkRepository
  ) {
    this.artworkRepository = artworkRepository
    this.savedArtworkRepository = savedArtworkRepository
    this.dislikedArtworkRepository = dislikedArtworkRepository
  }

  /**
   * Execute the use case
   */
  async execute(): Promise<RecommendationResult> {
    try {
      // Get user's saved artworks
      const savedArtworks =
        await this.savedArtworkRepository.getAllSavedArtworks()

      // Get user's disliked artworks
      const dislikedArtworks =
        await this.dislikedArtworkRepository.getAllDislikedArtworks()

      if (savedArtworks.length === 0) {
        return {
          recommendations: [],
          summary: {
            totalRecommendations: 0,
            reasons: [
              'No saved artworks found. Save some artworks to get recommendations!',
            ],
            filters: {},
          },
        }
      }

      // Analyze user preferences
      const preferences = this.analyzePreferences(savedArtworks)

      // Extract saved and disliked artwork IDs for filtering
      const savedArtworkIds = new Set(
        savedArtworks.map((artwork) => artwork.id)
      )

      const dislikedArtworkIds = new Set(
        dislikedArtworks.map((artwork) => artwork.id)
      )

      // Generate recommendations based on the most common preferences (excluding saved and disliked artworks)
      const recommendations = await this.generateRecommendations(
        preferences,
        savedArtworkIds,
        dislikedArtworkIds
      )

      // Create summary
      const summary = this.createSummary(preferences, recommendations.length)

      return {
        recommendations,
        summary,
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
      throw error
    }
  }

  /**
   * Analyze user preferences from saved artworks
   */
  private analyzePreferences(savedArtworks: Artwork[]) {
    const departments: { [key: string]: number } = {}
    const artworkTypes: { [key: string]: number } = {}
    const placesOfOrigin: { [key: string]: number } = {}
    const mediums: { [key: string]: number } = {}
    const artists: { [key: string]: number } = {}

    savedArtworks.forEach((artwork) => {
      if (artwork.department_title) {
        departments[artwork.department_title] =
          (departments[artwork.department_title] || 0) + 1
      }
      if (artwork.artwork_type_title) {
        artworkTypes[artwork.artwork_type_title] =
          (artworkTypes[artwork.artwork_type_title] || 0) + 1
      }
      if (artwork.place_of_origin) {
        placesOfOrigin[artwork.place_of_origin] =
          (placesOfOrigin[artwork.place_of_origin] || 0) + 1
      }
      if (artwork.medium_display) {
        mediums[artwork.medium_display] =
          (mediums[artwork.medium_display] || 0) + 1
      }
      if (artwork.artist_title) {
        artists[artwork.artist_title] = (artists[artwork.artist_title] || 0) + 1
      }
    })

    return {
      departments: this.sortByFrequency(departments),
      artworkTypes: this.sortByFrequency(artworkTypes),
      placesOfOrigin: this.sortByFrequency(placesOfOrigin),
      mediums: this.sortByFrequency(mediums),
      artists: this.sortByFrequency(artists),
    }
  }

  /**
   * Sort object by frequency (highest first)
   */
  private sortByFrequency(obj: { [key: string]: number }) {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3) // Take top 3 most common
  }

  /**
   * Generate recommendations based on user preferences
   */
  private async generateRecommendations(
    preferences: Preferences,
    savedArtworkIds: Set<number>,
    dislikedArtworkIds: Set<number>
  ): Promise<Artwork[]> {
    const recommendations: Artwork[] = []
    const seenIds = new Set<number>()
    const TARGET_RECOMMENDATIONS = 20
    const BATCH_SIZE = 12
    const MAX_PAGES_PER_STRATEGY = 3 // Limit to avoid infinite loops

    // Helper to progressively fetch and add artworks
    const addValidArtworksFromBatch = (
      artworks: Artwork[],
      seenIds: Set<number>,
      savedArtworkIds: Set<number>,
      dislikedArtworkIds: Set<number>,
      recommendations: Artwork[],
      target: number
    ): { added: number; complete: boolean } => {
      let added = 0
      for (const artwork of artworks) {
        if (
          !seenIds.has(artwork.id) &&
          !savedArtworkIds.has(artwork.id) &&
          !dislikedArtworkIds.has(artwork.id) &&
          artwork.image_id
        ) {
          recommendations.push(artwork)
          seenIds.add(artwork.id)
          added++
          if (recommendations.length >= target) {
            return { added, complete: true }
          }
        }
      }
      return { added, complete: false }
    }

    const fetchAndAddProgressively = async (
      filters: ArtworkFilters
    ): Promise<boolean> => {
      let page = 1
      let pagesAttempted = 0

      while (
        recommendations.length < TARGET_RECOMMENDATIONS &&
        pagesAttempted < MAX_PAGES_PER_STRATEGY
      ) {
        try {
          const result = await this.artworkRepository.getArtworks(
            page,
            BATCH_SIZE,
            filters
          )

          if (!result?.artworks || result.artworks.length === 0) {
            break
          }

          const { added, complete } = addValidArtworksFromBatch(
            result.artworks,
            seenIds,
            savedArtworkIds,
            dislikedArtworkIds,
            recommendations,
            TARGET_RECOMMENDATIONS
          )

          if (complete) {
            return true
          }

          if (added === 0 || result.artworks.length < BATCH_SIZE) {
            break
          }

          page++
          pagesAttempted++
        } catch (error) {
          console.warn(
            `Error fetching page ${page} for strategy:`,
            filters,
            error
          )
          break
        }
      }

      return recommendations.length >= TARGET_RECOMMENDATIONS
    }

    // Prepare strategies as filter objects (ordered by specificity)
    const strategies: ArtworkFilters[] = []

    // Most specific: department + artwork type
    if (
      preferences.departments.length > 0 &&
      preferences.artworkTypes.length > 0
    ) {
      strategies.push({
        department: preferences.departments[0][0],
        artworkType: preferences.artworkTypes[0][0],
      })
    }

    // Medium specificity: individual preferences
    if (preferences.departments.length > 0) {
      strategies.push({ department: preferences.departments[0][0] })
    }
    if (preferences.artworkTypes.length > 0) {
      strategies.push({ artworkType: preferences.artworkTypes[0][0] })
    }
    if (preferences.placesOfOrigin.length > 0) {
      strategies.push({ placeOfOrigin: preferences.placesOfOrigin[0][0] })
    }
    if (preferences.mediums.length > 0) {
      strategies.push({ medium: preferences.mediums[0][0] })
    }

    // Execute strategies until we have enough recommendations
    for (const filters of strategies) {
      try {
        const isComplete = await fetchAndAddProgressively(filters)
        if (isComplete) {
          break
        }
      } catch (error) {
        console.warn('Strategy failed:', filters, error)
      }
    }

    // If we still don't have enough recommendations, try a fallback without filters
    if (recommendations.length < TARGET_RECOMMENDATIONS) {
      try {
        console.log(
          `Only found ${recommendations.length} recommendations, trying fallback without filters`
        )
        await fetchAndAddProgressively({})
      } catch (error) {
        console.warn('Fallback strategy failed:', error)
      }
    }

    return recommendations
  }

  /**
   * Create recommendation summary
   */
  private createSummary(
    preferences: Preferences,
    totalRecommendations: number
  ): RecommendationSummary {
    const reasons: string[] = []
    const filters: ArtworkFilters = {}

    if (preferences.departments.length > 0) {
      const topDept = preferences.departments[0]
      reasons.push(
        `Based on your interest in ${topDept[0]} (${topDept[1]} saved artworks)`
      )
      filters.department = topDept[0]
    }

    if (preferences.artworkTypes.length > 0) {
      const topType = preferences.artworkTypes[0]
      reasons.push(`You seem to enjoy ${topType[0]} (${topType[1]} saved)`)
      if (!filters.department) filters.artworkType = topType[0]
    }

    if (preferences.placesOfOrigin.length > 0) {
      const topPlace = preferences.placesOfOrigin[0]
      reasons.push(
        `You've shown interest in art from ${topPlace[0]} (${topPlace[1]} saved)`
      )
    }

    if (preferences.mediums.length > 0) {
      const topMedium = preferences.mediums[0]
      reasons.push(`You favor ${topMedium[0]} (${topMedium[1]} saved)`)
    }

    if (preferences.artists.length > 0) {
      const topArtist = preferences.artists[0]
      reasons.push(
        `You appreciate works by ${topArtist[0]} (${topArtist[1]} saved)`
      )
    }

    if (reasons.length === 0) {
      reasons.push('Based on your saved artworks')
    }

    // Add insight about recommendation strategy
    if (totalRecommendations === 20) {
      reasons.push('✨ Found a rich collection matching your preferences')
    } else if (totalRecommendations > 15) {
      reasons.push('📚 Curated selection from available artworks')
    } else if (totalRecommendations > 0) {
      reasons.push('🔍 Explored multiple strategies to find these gems')
    }

    return {
      totalRecommendations,
      reasons,
      filters,
    }
  }
}
