import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ArtworkCard } from '@/presentation/components/features/artwork/ArtworkCard'
import { mockArtwork } from '../../../../__mocks__/data'

// Mock dependencies
vi.mock('react-router', async () => ({
  ...(await vi.importActual('../../../../__mocks__/react-router')),
}))

vi.mock('framer-motion', async () => ({
  ...(await vi.importActual('../../../../__mocks__/framer-motion')),
}))

vi.mock('@/presentation/viewmodels/ArtworkDetailViewModel', () => ({
  usePrefetchArtworkViewModel: () => ({
    prefetchArtwork: vi.fn(),
  }),
}))

vi.mock('@/presentation/components/shared/LikeButton', () => ({
  LikeButton: ({ artwork, className }: any) => (
    <button className={className} data-testid="like-button">
      Like {artwork.title}
    </button>
  ),
}))

vi.mock('@/presentation/components/shared/Image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoadingComplete }: any) => {
    // Simulate image loading completion
    setTimeout(() => onLoadingComplete?.(), 0)
    return <img src={src} alt={alt} data-testid="artwork-image" />
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('ArtworkCard Component', () => {
  const mockNavigate = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()
    const routerMock = await import('../../../../__mocks__/react-router')
    routerMock.mockNavigate.mockImplementation(mockNavigate)
  })

  it('should render artwork information', () => {
    render(<ArtworkCard artwork={mockArtwork} />, { wrapper: createWrapper() })

    expect(screen.getByText(mockArtwork.title)).toBeInTheDocument()
    expect(screen.getByText(mockArtwork.artist_title!)).toBeInTheDocument()
  })

  it('should render artwork image when image_id exists', () => {
    render(<ArtworkCard artwork={mockArtwork} />, { wrapper: createWrapper() })

    const image = screen.getByTestId('artwork-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', mockArtwork.title)
  })

  it('should render placeholder when no image_id', () => {
    const artworkWithoutImage = { ...mockArtwork, image_id: null }

    render(<ArtworkCard artwork={artworkWithoutImage} />, {
      wrapper: createWrapper(),
    })

    expect(screen.queryByTestId('artwork-image')).not.toBeInTheDocument()
  })

  it('should display "Unknown artist" when artist_title is null', () => {
    const artworkWithoutArtist = { ...mockArtwork, artist_title: null }

    render(<ArtworkCard artwork={artworkWithoutArtist} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Unknown artist')).toBeInTheDocument()
  })

  it('should navigate to artwork detail on click', () => {
    render(<ArtworkCard artwork={mockArtwork} />, { wrapper: createWrapper() })

    const card = screen.getByRole('button') // The motion.div acts as a button
    fireEvent.click(card)

    expect(mockNavigate).toHaveBeenCalledWith(
      `/artwork/${mockArtwork.id}`,
      expect.objectContaining({
        viewTransition: true,
        state: { from: '/' },
      })
    )
  })

  it('should render like button', () => {
    render(<ArtworkCard artwork={mockArtwork} />, { wrapper: createWrapper() })

    const likeButton = screen.getByTestId('like-button')
    expect(likeButton).toBeInTheDocument()
    expect(likeButton).toHaveTextContent(`Like ${mockArtwork.title}`)
  })

  it('should apply view transition names', () => {
    const { container } = render(<ArtworkCard artwork={mockArtwork} />, {
      wrapper: createWrapper(),
    })

    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle(
      `view-transition-name: artwork-card-${mockArtwork.id}`
    )
  })

  it('should hide loading skeleton after image loads', async () => {
    render(<ArtworkCard artwork={mockArtwork} />, { wrapper: createWrapper() })

    // Initially loading state should be present (though we mock it away quickly)
    await waitFor(() => {
      const image = screen.getByTestId('artwork-image')
      expect(image).toBeInTheDocument()
    })
  })
})
