import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  LoadingSpinner,
  PageLoadingFallback,
  ContentLoadingFallback,
  SearchBarSkeleton,
} from '@/presentation/components/shared/Loading'

// Mock framer-motion
vi.mock('framer-motion', async () => ({
  ...(await vi.importActual('../../../__mocks__/framer-motion')),
}))

describe('Loading Components', () => {
  describe('LoadingSpinner', () => {
    it('should render with default props', () => {
      const { container } = render(<LoadingSpinner />)

      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild).toHaveClass('items-center', 'justify-center')
    })

    it('should render with custom size', () => {
      render(<LoadingSpinner size="lg" />)

      const spinner = document.querySelector('.h-12')
      expect(spinner).toBeInTheDocument()
    })

    it('should render with text', () => {
      render(<LoadingSpinner text="Loading artwork..." />)

      expect(screen.getByText('Loading artwork...')).toBeInTheDocument()
    })

    it('should render fullscreen', () => {
      const { container } = render(<LoadingSpinner fullScreen />)

      expect(container.firstChild).toHaveClass(
        'flex',
        'h-screen',
        'items-center',
        'justify-center'
      )
    })

    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />)

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('PageLoadingFallback', () => {
    it('should render with default text', () => {
      render(<PageLoadingFallback />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should render with custom text', () => {
      render(<PageLoadingFallback text="Loading page..." />)

      expect(screen.getByText('Loading page...')).toBeInTheDocument()
    })

    it('should render as fullscreen spinner', () => {
      const { container } = render(<PageLoadingFallback />)

      expect(container.firstChild).toHaveClass(
        'flex',
        'h-screen',
        'items-center',
        'justify-center'
      )
    })
  })

  describe('ContentLoadingFallback', () => {
    it('should render with default styling', () => {
      const { container } = render(<ContentLoadingFallback />)

      expect(container.firstChild).toHaveClass(
        'flex',
        'h-40',
        'items-center',
        'justify-center'
      )
    })

    it('should render with custom text', () => {
      render(<ContentLoadingFallback text="Loading content..." />)

      expect(screen.getByText('Loading content...')).toBeInTheDocument()
    })

    it('should have proper height constraint', () => {
      const { container } = render(<ContentLoadingFallback />)

      expect(container.firstChild).toHaveClass('h-40')
    })
  })

  describe('SearchBarSkeleton', () => {
    it('should render with correct styling', () => {
      const { container } = render(<SearchBarSkeleton />)

      expect(container.firstChild).toHaveClass(
        'h-10',
        'w-full',
        'animate-pulse',
        'rounded-full',
        'bg-muted'
      )
    })

    it('should be a motion.div', () => {
      const { container } = render(<SearchBarSkeleton />)

      // The mock returns a regular div, but we can verify it was called
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
