import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to clean filters by removing keys with empty string or undefined values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanFilters<T extends Record<string, any>>(
  filters: T
): Partial<T> {
  const cleaned: Partial<T> = {}
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      cleaned[key as keyof T] = value
    }
  })
  return cleaned
}
