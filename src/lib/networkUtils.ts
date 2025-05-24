/**
 * Utility functions for network error detection and offline handling
 */

/**
 * Check if an error is network-related (fetch failed, no connection, etc.)
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false

  const errorMessage =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase()

  // Common network error patterns
  const networkErrorPatterns = [
    'failed to fetch',
    'network error',
    'network request failed',
    'net::err_',
    'connection refused',
    'connection timeout',
    'no internet connection',
    'offline',
    'unreachable',
  ]

  return networkErrorPatterns.some((pattern) => errorMessage.includes(pattern))
}

/**
 * Check if we should show offline fallback based on error and online status
 */
export function shouldShowOfflineFallback(
  error: unknown,
  hasData: boolean = false
): boolean {
  // If we have cached data, don't show offline fallback
  if (hasData) return false

  // Only show offline fallback for network-related errors
  return isNetworkError(error)
}

/**
 * Enhanced online status that considers actual connectivity
 */
export function useNetworkStatus() {
  // For now, we'll rely on React Query's error handling
  // This can be enhanced with more sophisticated network detection in the future
  return navigator.onLine
}
