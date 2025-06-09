/**
 * Service for tracking which teaching tips have been shown to users
 * Uses localStorage to persist the information across sessions
 */
export class TeachingTipTrackingService {
  private static readonly STORAGE_KEY = 'teaching-tips-shown'
  private static readonly VERSION_KEY = 'teaching-tips-version'
  private static readonly CURRENT_VERSION = '1.0.0'

  /**
   * Get all shown tip IDs
   */
  static getShownTips(): Set<string> {
    try {
      // Check if we need to reset due to version change
      const storedVersion = localStorage.getItem(this.VERSION_KEY)
      if (storedVersion !== this.CURRENT_VERSION) {
        this.resetAllTips()
        localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION)
        return new Set()
      }

      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return new Set()

      const tipIds = JSON.parse(stored)
      return new Set(Array.isArray(tipIds) ? tipIds : [])
    } catch (error) {
      console.warn('Failed to load shown tips:', error)
      return new Set()
    }
  }

  /**
   * Mark a tip as shown
   */
  static markTipAsShown(tipId: string): void {
    try {
      const shownTips = this.getShownTips()
      shownTips.add(tipId)
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(Array.from(shownTips))
      )
    } catch (error) {
      console.warn('Failed to mark tip as shown:', error)
    }
  }

  /**
   * Mark multiple tips as shown
   */
  static markTipsAsShown(tipIds: string[]): void {
    try {
      const shownTips = this.getShownTips()
      tipIds.forEach((id) => shownTips.add(id))
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(Array.from(shownTips))
      )
    } catch (error) {
      console.warn('Failed to mark tips as shown:', error)
    }
  }

  /**
   * Check if a specific tip has been shown
   */
  static isTipShown(tipId: string): boolean {
    return this.getShownTips().has(tipId)
  }

  /**
   * Reset a specific tip (mark as not shown)
   */
  static resetTip(tipId: string): void {
    try {
      const shownTips = this.getShownTips()
      shownTips.delete(tipId)
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(Array.from(shownTips))
      )
    } catch (error) {
      console.warn('Failed to reset tip:', error)
    }
  }

  /**
   * Reset all tips (mark all as not shown)
   */
  static resetAllTips(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to reset all tips:', error)
    }
  }

  /**
   * Get tips that haven't been shown from a list of tip IDs
   */
  static getUnshownTips(tipIds: string[]): string[] {
    const shownTips = this.getShownTips()
    return tipIds.filter((id) => !shownTips.has(id))
  }

  /**
   * Check if any tips from a list haven't been shown
   */
  static hasUnshownTips(tipIds: string[]): boolean {
    return this.getUnshownTips(tipIds).length > 0
  }
}
