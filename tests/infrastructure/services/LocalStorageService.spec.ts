import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageService } from '@/infrastructure/services/LocalStorageService'

// Mock localforage
vi.mock('localforage', () => ({
  default: {
    config: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn(),
  },
}))

describe('LocalStorageService', () => {
  let service: LocalStorageService
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLocalForage: any

  beforeEach(async () => {
    mockLocalForage = await import('localforage')
    service = new LocalStorageService()
  })

  it('should initialize with correct config', () => {
    expect(mockLocalForage.default.config).toHaveBeenCalledWith({
      name: 'art-gallery',
      storeName: 'saved_artworks',
    })
  })

  describe('getItem', () => {
    it('should get item from storage', async () => {
      const key = 'test-key'
      const value = { test: 'data' }
      mockLocalForage.default.getItem.mockResolvedValue(value)

      const result = await service.getItem(key)

      expect(mockLocalForage.default.getItem).toHaveBeenCalledWith(key)
      expect(result).toEqual(value)
    })

    it('should return null when item not found', async () => {
      const key = 'nonexistent-key'
      mockLocalForage.default.getItem.mockResolvedValue(null)

      const result = await service.getItem(key)

      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      const key = 'error-key'
      const error = new Error('Storage error')
      mockLocalForage.default.getItem.mockRejectedValue(error)

      await expect(service.getItem(key)).rejects.toThrow('Storage error')
    })
  })

  describe('setItem', () => {
    it('should set item in storage', async () => {
      const key = 'test-key'
      const value = { test: 'data' }
      mockLocalForage.default.setItem.mockResolvedValue(undefined)

      await service.setItem(key, value)

      expect(mockLocalForage.default.setItem).toHaveBeenCalledWith(key, value)
    })

    it('should handle errors', async () => {
      const key = 'error-key'
      const value = { test: 'data' }
      const error = new Error('Storage error')
      mockLocalForage.default.setItem.mockRejectedValue(error)

      await expect(service.setItem(key, value)).rejects.toThrow('Storage error')
    })
  })

  describe('removeItem', () => {
    it('should remove item from storage', async () => {
      const key = 'test-key'
      mockLocalForage.default.removeItem.mockResolvedValue(undefined)

      await service.removeItem(key)

      expect(mockLocalForage.default.removeItem).toHaveBeenCalledWith(key)
    })

    it('should handle errors', async () => {
      const key = 'error-key'
      const error = new Error('Storage error')
      mockLocalForage.default.removeItem.mockRejectedValue(error)

      await expect(service.removeItem(key)).rejects.toThrow('Storage error')
    })
  })
})
