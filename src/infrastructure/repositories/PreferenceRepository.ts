import { localStorageService } from '../services/LocalStorageService'
import localforage from 'localforage'

export interface Preference {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

export class PreferenceRepository {
  private static LS_KEY = 'user-preference'
  private static FORAGE_KEY = 'user-preference'

  static async get(): Promise<Preference | null> {
    // Try IndexedDB first
    const pref = await localforage.getItem<Preference>(this.FORAGE_KEY)
    if (pref) return pref
    // Fallback to localStorage
    const raw = localStorageService.getItemSync<Preference>(this.LS_KEY)
    if (raw) return raw
    return null
  }

  static async set(pref: Preference): Promise<void> {
    await localforage.setItem(this.FORAGE_KEY, pref)
    localStorageService.setItemSync(this.LS_KEY, pref)
  }

  static async clear(): Promise<void> {
    await localforage.removeItem(this.FORAGE_KEY)
    localStorageService.removeItemSync(this.LS_KEY)
  }
}
