'use client'

import localforage from 'localforage'

/**
 * Service for handling local storage operations using LocalForage
 */
export class LocalStorageService {
  constructor() {
    // Initialize localforage
    localforage.config({
      name: 'art-gallery',
      storeName: 'saved_artworks',
    })
  }

  /**
   * Get an item from storage
   * @param key Storage key
   * @returns The stored value or null if not found
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      return await localforage.getItem<T>(key)
    } catch (error) {
      console.error(`Error getting item '${key}' from storage:`, error)
      throw error
    }
  }

  /**
   * Store an item in storage
   * @param key Storage key
   * @param value Value to store
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await localforage.setItem(key, value)
    } catch (error) {
      console.error(`Error setting item '${key}' in storage:`, error)
      throw error
    }
  }

  /**
   * Remove an item from storage
   * @param key Storage key
   */
  async removeItem(key: string): Promise<void> {
    try {
      await localforage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item '${key}' from storage:`, error)
      throw error
    }
  }

  /**
   * Get an item from browser localStorage (sync fallback)
   */
  getItemSync<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  /**
   * Set an item in browser localStorage (sync fallback)
   */
  setItemSync<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * Remove an item from browser localStorage (sync fallback)
   */
  removeItemSync(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}

// Export a singleton instance
export const localStorageService = new LocalStorageService()
