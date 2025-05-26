import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ArtworkCardSkeleton } from '@/presentation/components/features/artwork/ArtworkCardSkeleton'

vi.mock('@/presentation/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

describe('ArtworkCardSkeleton Component', () => {
  it('should render skeleton structure', () => {
    const { container } = render(<ArtworkCardSkeleton />)

    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass(
      'h-full',
      'overflow-hidden',
      'rounded-lg'
    )
  })

  it('should render image skeleton with correct aspect ratio', () => {
    const { container } = render(<ArtworkCardSkeleton />)

    const imageContainer = container.querySelector('.aspect-\\[3\\/4\\]')
    expect(imageContainer).toBeInTheDocument()

    const imageSkeleton = container.querySelector('[data-testid="skeleton"]')
    expect(imageSkeleton).toBeInTheDocument()
    expect(imageSkeleton).toHaveClass('h-full', 'w-full')
  })

  it('should render content skeletons', () => {
    const { getAllByTestId } = render(<ArtworkCardSkeleton />)

    const skeletons = getAllByTestId('skeleton')

    // Should have 4 skeletons: 1 for image + 3 for content (title, artist, date)
    expect(skeletons).toHaveLength(4)

    // Check content skeleton sizes
    const contentSkeletons = skeletons.slice(1) // Skip image skeleton
    expect(contentSkeletons[0]).toHaveClass('h-4', 'w-3/4') // Title
    expect(contentSkeletons[1]).toHaveClass('h-3', 'w-1/2') // Artist
    expect(contentSkeletons[2]).toHaveClass('h-3', 'w-1/4') // Date
  })

  it('should have proper spacing structure', () => {
    const { container } = render(<ArtworkCardSkeleton />)

    const contentContainer = container.querySelector('.space-y-2.p-3')
    expect(contentContainer).toBeInTheDocument()
  })

  it('should match the aspect ratio of actual artwork cards', () => {
    const { container } = render(<ArtworkCardSkeleton />)

    const aspectRatioContainer = container.querySelector('.aspect-\\[3\\/4\\]')
    expect(aspectRatioContainer).toBeInTheDocument()
    expect(aspectRatioContainer).toHaveClass(
      'w-full',
      'overflow-hidden',
      'bg-gray-100'
    )
  })
})
