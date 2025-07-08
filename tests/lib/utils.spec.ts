import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'
import { cleanFilters } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('bg-red-500', 'text-white')
    expect(result).toContain('bg-red-500')
    expect(result).toContain('text-white')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
  })

  it('should handle false conditional classes', () => {
    const isActive = false
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).not.toContain('active-class')
  })

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2'])
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })

  it('should resolve conflicting Tailwind classes', () => {
    const result = cn('bg-red-500', 'bg-blue-500')
    // Should only contain the last background color
    expect(result).toContain('bg-blue-500')
    expect(result).not.toContain('bg-red-500')
  })

  it('should handle empty or undefined inputs', () => {
    const result = cn('', undefined, null, 'valid-class')
    expect(result).toBe('valid-class')
  })

 
})
 describe('cleanFilters utility function', () => {
    it('should remove keys with empty string values', () => {
      const filters = { a: 'value', b: '', c: 'another' }
      const result = cleanFilters(filters)
      expect(result).toEqual({ a: 'value', c: 'another' })
    })

    it('should remove keys with undefined values', () => {
      const filters = { a: 'value', b: undefined, c: 'another' }
      const result = cleanFilters(filters)
      expect(result).toEqual({ a: 'value', c: 'another' })
    })

    it('should keep keys with falsy but valid values (e.g., 0, false, null)', () => {
      const filters = { a: 0, b: false, c: null, d: '', e: undefined }
      const result = cleanFilters(filters)
      expect(result).toEqual({ a: 0, b: false, c: null })
    })

    it('should return an empty object if all values are empty string or undefined', () => {
      const filters = { a: '', b: undefined }
      const result = cleanFilters(filters)
      expect(result).toEqual({})
    })

    it('should return the same object if no values are empty string or undefined', () => {
      const filters = { a: 1, b: 'test', c: false }
      const result = cleanFilters(filters)
      expect(result).toEqual(filters)
    })

    it('should handle an empty object', () => {
      const filters = {}
      const result = cleanFilters(filters)
      expect(result).toEqual({})
    })
  })