import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SavedArtworkRepositoryImpl } from '@/infrastructure/repositories/SavedArtworkRepositoryImpl'
import { mockArtwork, mockSavedArtwork } from '../../__mocks__/data'
import { localStorageService } from '@/infrastructure/services/LocalStorageService'

// Mock the LocalStorageService
vi.mock('@/infrastructure/services/LocalStorageService', () => ({
  localStorageService: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn(),
  },
}))

describe('SavedArtworkRepositoryImpl', () => {
  let repository: SavedArtworkRepositoryImpl
  const STORAGE_KEY = 'saved_artworks' // Use the correct storage key from the implementation

  // Get mocked version
  const mockedLocalStorage = vi.mocked(localStorageService)

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    repository = new SavedArtworkRepositoryImpl()
  })

  describe('saveArtwork', () => {
    it('should save artwork with timestamp', async () => {
      // Arrange - use a different artwork that doesn't exist yet
      const newArtwork = { ...mockArtwork, id: 999, title: 'New Artwork' }
      const existingSavedArtworks = [mockSavedArtwork]
      mockedLocalStorage.getItem.mockResolvedValue(existingSavedArtworks)
      mockedLocalStorage.setItem.mockResolvedValue(undefined)

      // Mock date for consistent test results
      const mockTimestamp = 1234567890000
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp)

      // Act
      await repository.saveArtwork(newArtwork)

      // Assert
      expect(mockedLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
      expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.arrayContaining([
          mockSavedArtwork,
          expect.objectContaining({
            ...newArtwork,
            savedAt: mockTimestamp,
          }),
        ])
      )

      // Cleanup
      dateSpy.mockRestore()
    })

    it('should not duplicate existing artwork', async () => {
      // Arrange
      const existingSavedArtwork = { ...mockArtwork, savedAt: 123456789 }
      mockedLocalStorage.getItem.mockResolvedValue([existingSavedArtwork])

      // Act
      await repository.saveArtwork(mockArtwork)

      // Assert
      expect(mockedLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
      expect(mockedLocalStorage.setItem).not.toHaveBeenCalled()
    })

    it('should handle empty storage', async () => {
      // Arrange
      mockedLocalStorage.getItem.mockResolvedValue(null)

      // Mock timestamp
      const mockTimestamp = 1234567890000
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp)

      // Act
      await repository.saveArtwork(mockArtwork)

      // Assert
      expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, [
        expect.objectContaining({
          ...mockArtwork,
          savedAt: mockTimestamp,
        }),
      ])

      // Cleanup
      dateSpy.mockRestore()
    })

    it('should handle error when saving artwork', async () => {
      // Arrange
      const error = new Error('Storage error')
      mockedLocalStorage.getItem.mockRejectedValue(error)
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      // Act & Assert
      await expect(repository.saveArtwork(mockArtwork)).rejects.toThrow(
        'Storage error'
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving artwork:',
        error
      )

      // Cleanup
      consoleErrorSpy.mockRestore()
    })
  })

  describe('removeArtwork', () => {
    it('should remove artwork by id', async () => {
      // Arrange
      const existingSavedArtworks = [mockSavedArtwork]
      mockedLocalStorage.getItem.mockResolvedValue(existingSavedArtworks)

      // Act
      await repository.removeArtwork(mockArtwork.id)

      // Assert
      expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, [])
    })

    it('should handle non-existent artwork', async () => {
      // Arrange
      const existingSavedArtworks = [mockSavedArtwork]
      mockedLocalStorage.getItem.mockResolvedValue(existingSavedArtworks)

      // Act
      await repository.removeArtwork(999)

      // Assert
      expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        existingSavedArtworks
      )
    })

    it('should handle error when removing artwork', async () => {
      // Arrange
      const error = new Error('Storage error')
      mockedLocalStorage.getItem.mockRejectedValue(error)
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      // Act & Assert
      await expect(repository.removeArtwork(mockArtwork.id)).rejects.toThrow(
        'Storage error'
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error removing artwork:',
        error
      )

      // Cleanup
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getAllSavedArtworks', () => {
    it('should return all saved artworks', async () => {
      // Arrange
      const savedArtworks = [mockSavedArtwork]
      mockedLocalStorage.getItem.mockResolvedValue(savedArtworks)

      // Act
      const result = await repository.getAllSavedArtworks()

      // Assert
      expect(mockedLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY)
      expect(result).toEqual(savedArtworks)
    })

    it('should return empty array when no saved artworks', async () => {
      // Arrange
      mockedLocalStorage.getItem.mockResolvedValue(null)

      // Act
      const result = await repository.getAllSavedArtworks()

      // Assert
      expect(result).toEqual([])
    })

    it('should handle error when getting saved artworks', async () => {
      // Arrange
      const error = new Error('Storage error')
      mockedLocalStorage.getItem.mockRejectedValue(error)
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      // Act & Assert
      await expect(repository.getAllSavedArtworks()).rejects.toThrow(
        'Storage error'
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting saved artworks:',
        error
      )

      // Cleanup
      consoleErrorSpy.mockRestore()
    })
  })

  describe('isArtworkSaved', () => {
    it('should return true for saved artwork', async () => {
      // Arrange
      const savedArtworks = [mockSavedArtwork]
      mockedLocalStorage.getItem.mockResolvedValue(savedArtworks)

      // Act
      const result = await repository.isArtworkSaved(mockArtwork.id)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false for non-saved artwork', async () => {
      // Arrange
      const savedArtworks = [mockSavedArtwork]
      mockedLocalStorage.getItem.mockResolvedValue(savedArtworks)

      // Act
      const result = await repository.isArtworkSaved(999)

      // Assert
      expect(result).toBe(false)
    })

    it('should return false when no saved artworks', async () => {
      // Arrange
      mockedLocalStorage.getItem.mockResolvedValue(null)

      // Act
      const result = await repository.isArtworkSaved(mockArtwork.id)

      // Assert
      expect(result).toBe(false)
    })

    it('should handle error when checking if artwork is saved', async () => {
      // Arrange
      const error = new Error('Storage error')
      mockedLocalStorage.getItem.mockRejectedValue(error)
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      // Act & Assert
      await expect(repository.isArtworkSaved(mockArtwork.id)).rejects.toThrow(
        'Storage error'
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error checking if artwork is saved:',
        error
      )

      // Cleanup
      consoleErrorSpy.mockRestore()
    })

    describe('clearArtworks', () => {
      it('should clear all saved artworks', async () => {
        // Arrange
        mockedLocalStorage.removeItem.mockResolvedValue(undefined)

        // Act
        await repository.clearArtworks()

        // Assert
        expect(mockedLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
      })

      it('should handle error when clearing artworks', async () => {
        // Arrange
        const error = new Error('Storage error')
        mockedLocalStorage.removeItem.mockRejectedValue(error)
        const consoleErrorSpy = vi
          .spyOn(console, 'error')
          .mockImplementation(() => {})

        // Act & Assert
        await expect(repository.clearArtworks()).rejects.toThrow('Storage error')
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error clearing saved artworks:',
          error
        )

        // Cleanup
        consoleErrorSpy.mockRestore()
      })
    })
  })
})
