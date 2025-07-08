import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PreferenceRepository, Preference } from '@/infrastructure/repositories/PreferenceRepository'
import localforage from 'localforage'
import { localStorageService } from '@/infrastructure/services/LocalStorageService'

vi.mock('localforage')
vi.mock('@/infrastructure/services/LocalStorageService', () => ({
  localStorageService: {
    setItemSync: vi.fn(),
    getItemSync: vi.fn(),
    removeItemSync: vi.fn(),
  }
}))

describe('PreferenceRepository.set', () => {
  const pref: Preference = {
    theme: 'dark',
    language: 'en',
    showTeachingTips: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should store preference in localforage and localStorageService', async () => {
    // @ts-ignore
    localforage.setItem.mockResolvedValue(undefined)

    await PreferenceRepository.set(pref)

    expect(localforage.setItem).toHaveBeenCalledWith('user-preference', pref)
    expect(localStorageService.setItemSync).toHaveBeenCalledWith('user-preference', pref)
  })

  it('should await localforage.setItem before calling localStorageService.setItemSync', async () => {
    const setItemSpy = vi.fn().mockResolvedValue(undefined)
    // @ts-ignore
    localforage.setItem = setItemSpy

    await PreferenceRepository.set(pref)

    expect(setItemSpy).toHaveBeenCalledBefore(localStorageService.setItemSync as any)
  })

  describe('PreferenceRepository.get', () => {
    const pref: Preference = {
      theme: 'dark',
      language: 'en',
      showTeachingTips: true,
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should return preference from localforage if available', async () => {
      // @ts-ignore
      localforage.getItem.mockResolvedValue(pref)
      // @ts-ignore
      localStorageService.getItemSync.mockReturnValue(null)

      const result = await PreferenceRepository.get()
      expect(localforage.getItem).toHaveBeenCalledWith('user-preference')
      expect(result).toEqual(pref)
      expect(localStorageService.getItemSync).not.toHaveBeenCalled()
    })

    it('should return preference from localStorageService if not in localforage', async () => {
      // @ts-ignore
      localforage.getItem.mockResolvedValue(null)
      // @ts-ignore
      localStorageService.getItemSync.mockReturnValue(pref)

      const result = await PreferenceRepository.get()
      expect(localforage.getItem).toHaveBeenCalledWith('user-preference')
      expect(localStorageService.getItemSync).toHaveBeenCalledWith('user-preference')
      expect(result).toEqual(pref)
    })

    it('should return null if preference not found in both storages', async () => {
      // @ts-ignore
      localforage.getItem.mockResolvedValue(null)
      // @ts-ignore
      localStorageService.getItemSync.mockReturnValue(null)

      const result = await PreferenceRepository.get()
      expect(result).toBeNull()
    })
  })

  describe('PreferenceRepository.clear', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should remove preference from localforage and localStorageService', async () => {
      // @ts-ignore
      localforage.removeItem.mockResolvedValue(undefined)

      await PreferenceRepository.clear()

      expect(localforage.removeItem).toHaveBeenCalledWith('user-preference')
      expect(localStorageService.removeItemSync).toHaveBeenCalledWith('user-preference')
    })

    it('should await localforage.removeItem before calling localStorageService.removeItemSync', async () => {
      const removeItemSpy = vi.fn().mockResolvedValue(undefined)
      // @ts-ignore
      localforage.removeItem = removeItemSpy

      await PreferenceRepository.clear()

      expect(removeItemSpy).toHaveBeenCalledBefore(localStorageService.removeItemSync as any)
    })
  })
})