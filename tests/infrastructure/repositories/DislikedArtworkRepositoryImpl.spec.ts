import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { DislikedArtworkRepositoryImpl } from '@/infrastructure/repositories/DislikedArtworkRepositoryImpl'
import type { Artwork, DislikedArtwork } from '@/core/domain/entities/Artwork'
import { localStorageService } from '@/infrastructure/services/LocalStorageService'

vi.mock('@/infrastructure/services/LocalStorageService', () => ({
  localStorageService: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}))

const mockArtwork: Artwork = {
  id: 1,
  title: 'Mona Lisa',
  artist_title: 'Leonardo da Vinci',
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

describe('DislikedArtworkRepositoryImpl', () => {
  let repo: DislikedArtworkRepositoryImpl

  beforeEach(() => {
    repo = new DislikedArtworkRepositoryImpl()
    vi.clearAllMocks()
  })

  it('should add a new artwork to disliked list if not already disliked', async () => {
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce([])
    ;(localStorageService.setItem as Mock).mockResolvedValueOnce(undefined)

    await repo.dislikeArtwork(mockArtwork)

    expect(localStorageService.setItem).toHaveBeenCalledTimes(1)
    const [key, value] = (localStorageService.setItem as Mock).mock.calls[0]
    expect(key).toBe('disliked_artworks')
    expect(value).toHaveLength(1)
    expect(value[0]).toMatchObject({
      ...mockArtwork,
      dislikedAt: expect.any(Number),
    })
  })

  it('should not add artwork if already disliked', async () => {
    const disliked: DislikedArtwork[] = [
      { ...mockArtwork, dislikedAt: Date.now() },
    ]
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce(disliked)

    await repo.dislikeArtwork(mockArtwork)

    expect(localStorageService.setItem).not.toHaveBeenCalled()
  })

  it('should throw and log error if setItem fails', async () => {
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce([])
    const error = new Error('setItem failed')
    ;(localStorageService.setItem as Mock).mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(repo.dislikeArtwork(mockArtwork)).rejects.toThrow(
      'setItem failed'
    )
    expect(consoleSpy).toHaveBeenCalledWith('Error disliking artwork:', error)

    consoleSpy.mockRestore()
  })

  it('should remove an artwork from disliked list', async () => {
    const disliked: DislikedArtwork[] = [
      { ...mockArtwork, dislikedAt: 123 },
      {
        id: 2,
        title: 'Starry Night',
        artist_display: 'Vincent van Gogh',
        dislikedAt: 456,
      },
    ]
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce(disliked)
    ;(localStorageService.setItem as Mock).mockResolvedValueOnce(undefined)

    await repo.removeDislikedArtwork(1)

    expect(localStorageService.setItem).toHaveBeenCalledTimes(1)
    const [key, value] = (localStorageService.setItem as Mock).mock.calls[0]
    expect(key).toBe('disliked_artworks')
    expect(value).toEqual([
      {
        id: 2,
        title: 'Starry Night',
        artist_display: 'Vincent van Gogh',
        dislikedAt: 456,
      },
    ])
  })

  it('should do nothing if artwork to remove does not exist', async () => {
    const disliked: DislikedArtwork[] = [{ ...mockArtwork, dislikedAt: 123 }]
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce(disliked)
    ;(localStorageService.setItem as Mock).mockResolvedValueOnce(undefined)

    await repo.removeDislikedArtwork(999)

    expect(localStorageService.setItem).toHaveBeenCalledWith(
      'disliked_artworks',
      disliked
    )
  })

  it('should throw and log error if setItem fails during removal', async () => {
    const disliked: DislikedArtwork[] = [{ ...mockArtwork, dislikedAt: 123 }]
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce(disliked)
    const error = new Error('setItem failed')
    ;(localStorageService.setItem as Mock).mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(repo.removeDislikedArtwork(1)).rejects.toThrow(
      'setItem failed'
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error removing disliked artwork:',
      error
    )

    consoleSpy.mockRestore()
  })

  it('should return all disliked artworks from localStorage', async () => {
    const disliked: DislikedArtwork[] = [
      { ...mockArtwork, dislikedAt: 123 },
      {
        id: 2,
        title: 'Starry Night',
        artist_display: 'Vincent van Gogh',
        dislikedAt: 456,
      },
    ]
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce(disliked)

    const result = await repo.getAllDislikedArtworks()

    expect(localStorageService.getItem).toHaveBeenCalledWith(
      'disliked_artworks'
    )
    expect(result).toEqual(disliked)
  })

  it('should return an empty array if localStorage returns null or undefined', async () => {
    ;(localStorageService.getItem as Mock).mockResolvedValueOnce(null)

    const result = await repo.getAllDislikedArtworks()

    expect(localStorageService.getItem).toHaveBeenCalledWith(
      'disliked_artworks'
    )
    expect(result).toEqual([])
  })

  it('should throw and log error if getItem fails', async () => {
    const error = new Error('getItem failed')
    ;(localStorageService.getItem as Mock).mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(repo.getAllDislikedArtworks()).rejects.toThrow(
      'getItem failed'
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error getting disliked artworks:',
      error
    )

    consoleSpy.mockRestore()
  })

  it('should return true if artwork is disliked', async () => {
    const disliked: DislikedArtwork[] = [
      { ...mockArtwork, dislikedAt: 123 },
      {
        id: 2,
        title: 'Starry Night',
        artist_display: 'Vincent van Gogh',
        dislikedAt: 456,
      },
    ]
    vi.spyOn(repo, 'getAllDislikedArtworks').mockResolvedValueOnce(disliked)

    const result = await repo.isArtworkDisliked(1)
    expect(result).toBe(true)
  })

  it('should return false if artwork is not disliked', async () => {
    const disliked: DislikedArtwork[] = [
      {
        id: 2,
        title: 'Starry Night',
        artist_display: 'Vincent van Gogh',
        dislikedAt: 456,
      },
    ]
    vi.spyOn(repo, 'getAllDislikedArtworks').mockResolvedValueOnce(disliked)

    const result = await repo.isArtworkDisliked(1)
    expect(result).toBe(false)
  })

  it('should return false if disliked artworks list is empty', async () => {
    vi.spyOn(repo, 'getAllDislikedArtworks').mockResolvedValueOnce([])

    const result = await repo.isArtworkDisliked(1)
    expect(result).toBe(false)
  })

  it('should throw and log error if getAllDislikedArtworks fails', async () => {
    const error = new Error('getAllDislikedArtworks failed')
    vi.spyOn(repo, 'getAllDislikedArtworks').mockRejectedValueOnce(error)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(repo.isArtworkDisliked(1)).rejects.toThrow(
      'getAllDislikedArtworks failed'
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error checking if artwork is disliked:',
      error
    )

    consoleSpy.mockRestore()
  })

  // All main behaviors and error cases are already covered in the provided tests.
  // For completeness, let's add a test to ensure STORAGE_KEY is correct and that the class can be instantiated.

  it('should use the correct STORAGE_KEY', () => {
    expect((repo as any).STORAGE_KEY).toBe('disliked_artworks')
  })

  it('should instantiate without errors', () => {
    expect(() => new DislikedArtworkRepositoryImpl()).not.toThrow()
  })
})
