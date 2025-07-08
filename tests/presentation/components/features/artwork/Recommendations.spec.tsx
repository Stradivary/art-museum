import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Recommendations } from '@/presentation/components/features/artwork/Recommendations'
import React from 'react'

// Mock child components
vi.mock('@/presentation/components/features/artwork/ArtworkCard', () => ({
  ArtworkCard: ({ artwork }: any) => <div data-testid="artwork-card">{artwork.title}</div>,
}))
vi.mock('@/presentation/components/features/artwork/ArtworkCardSkeleton', () => ({
  ArtworkCardSkeleton: () => <div data-testid="artwork-card-skeleton" />,
}))
vi.mock('@/presentation/components/ui/carousel', () => ({
  Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: any) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children }: any) => <div data-testid="carousel-item">{children}</div>,
  CarouselNext: () => <button data-testid="carousel-next" />,
  CarouselPrevious: () => <button data-testid="carousel-previous" />,
}))
vi.mock('@/presentation/components/ui/hover-card', () => ({
  HoverCard: ({ children }: any) => <div data-testid="hover-card">{children}</div>,
  HoverCardTrigger: ({ children }: any) => <div data-testid="hover-card-trigger">{children}</div>,
  HoverCardContent: ({ children }: any) => <div data-testid="hover-card-content">{children}</div>,
}))
vi.mock('@/presentation/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}))
vi.mock('@/presentation/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props} data-testid="button">
      {children}
    </button>
  ),
}))

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultText: string) => defaultText,
  }),
}))

describe('Recommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state with skeletons', () => {
    render(<Recommendations recommendations={null} isLoading={true} />)
    expect(screen.getByText('Recommended for You')).toBeInTheDocument()
    expect(screen.getAllByTestId('artwork-card-skeleton')).toHaveLength(6)
  })

  it('renders error state', () => {
    render(<Recommendations recommendations={null} isLoading={false} error={new Error('fail')} />)
    expect(
      screen.getByText('Failed to load recommendations. Please try again later.')
    ).toBeInTheDocument()
  })

  it('renders empty state when no recommendations', () => {
    const refetch = vi.fn()
    render(
      <Recommendations
        recommendations={{ recommendations: [], summary: { totalRecommendations: 0, reasons: [] } }}
        isLoading={false}
        refetch={refetch}
      />
    )
    expect(screen.getByText('Discover Your Taste')).toBeInTheDocument()
    expect(
      screen.getByText('Save some artworks you love to get personalized recommendations!')
    ).toBeInTheDocument()
    expect(screen.getByText('Refresh Recommendations')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Refresh Recommendations'))
    expect(refetch).toHaveBeenCalled()
    expect(
      screen.getByTestId('recommendations-tip')
    ).toBeInTheDocument()
  })

  it('renders recommendations carousel and summary', () => {
    const recommendations = {
      recommendations: [
        { id: 1, title: 'Artwork 1' },
        { id: 2, title: 'Artwork 2' },
      ],
      summary: {
        totalRecommendations: 2,
        reasons: ['Because you liked Impressionism', 'From your favorite department'],
      },
    }
    render(<Recommendations recommendations={recommendations} isLoading={false} />)
    expect(screen.getByText('Recommended for You')).toBeInTheDocument()
    expect(screen.getByTestId('badge')).toHaveTextContent('2')
    expect(screen.getAllByTestId('artwork-card')).toHaveLength(2)
    expect(screen.getByText('How recommendations work')).toBeInTheDocument()
    expect(screen.getByText('Why these recommendations?')).toBeInTheDocument()
    expect(screen.getByText('Because you liked Impressionism')).toBeInTheDocument()
    expect(screen.getByText('From your favorite department')).toBeInTheDocument()
    expect(
      screen.getByText('Like what you see? Save more artworks to improve your recommendations!')
    ).toBeInTheDocument()
    expect(screen.getByText('Browse All Artworks')).toBeInTheDocument()
  })

  it('renders empty state if recommendations prop is null', () => {
    render(<Recommendations recommendations={null} isLoading={false} />)
    expect(screen.getByText('Discover Your Taste')).toBeInTheDocument()
  })
})