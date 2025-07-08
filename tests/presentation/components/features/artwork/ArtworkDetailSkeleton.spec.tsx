import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ArtworkDetailSkeleton } from '@/presentation/components/features/artwork/ArtworkDetailSkeleton'

// Mock the Skeleton component to make it easier to query
vi.mock('@/presentation/components/ui/skeleton', () => ({
  Skeleton: (props: { className?: string }) => (
    <div data-testid="skeleton" className={props.className} />
  ),
}))

describe('ArtworkDetailSkeleton', () => {
  it('renders the main container with animate-pulse class', () => {
    render(<ArtworkDetailSkeleton />)
    const container = document.querySelector('.animate-pulse')
    expect(container).toBeTruthy()
    expect(container).toHaveClass('animate-pulse')
  })

  it('renders the correct number of Skeleton components', () => {
    render(<ArtworkDetailSkeleton />)
    // There are 16 Skeleton components in the component
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(17)
  })

  it('renders Skeletons with expected classNames', () => {
    render(<ArtworkDetailSkeleton />)
    // Check for some specific Skeletons by their className
    expect(screen.getAllByTestId('skeleton', { selector: '.h-[40vh].w-full' })).toBeDefined()
    expect(screen.getAllByTestId('skeleton', { selector: '.h-10.w-24.rounded-full' })).toBeDefined()
    expect(screen.getAllByTestId('skeleton', { selector: '.h-8.w-3/4' })).toBeDefined()
    expect(screen.getAllByTestId('skeleton', { selector: '.h-6.w-1/2' })).toBeDefined()
    expect(screen.getAllByTestId('skeleton', { selector: '.h-4.w-1/4' })).toBeDefined()
  })
})

// We recommend installing an extension to run vitest tests.