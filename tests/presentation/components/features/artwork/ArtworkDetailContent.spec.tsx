vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/presentation/viewmodels/ArtworkDetailViewModel', () => ({
  useArtworkDetailViewModel: () => vi.fn(),
}))

// Mock other components
vi.mock(
  '@/presentation/components/features/artwork/ArtworkDetailSkeleton',
  () => ({
    ArtworkDetailSkeleton: () => (
      <div data-testid="artwork-detail-skeleton">Loading...</div>
    ),
  })
)

vi.mock('@/presentation/components/shared/SafeHtmlRenderer', () => ({
  SafeHtmlRenderer: ({
    html,
    className,
  }: {
    html: string
    className?: string
  }) => (
    <div
      className={className}
      data-testid="safe-html-renderer"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ),
}))

vi.mock('@/presentation/components/features/OfflineFallback', () => ({
  OfflineFallback: () => <div data-testid="offline-fallback">Offline</div>,
}))

// Mock teaching tip hooks to prevent infinite loops
vi.mock('@/presentation/hooks/useRegisterTeachingTip', () => ({
  useRegisterTeachingTip: () => ({
    ref: { current: null },
    showTip: vi.fn(),
    isRegistered: false,
  }),
}))

// Mock TeachingTipTrackingService to prevent localStorage access
vi.mock('@/infrastructure/services/TeachingTipTrackingService', () => ({
  TeachingTipTrackingService: {
    getShownTips: () => new Set(),
    markTipAsShown: vi.fn(),
    markTipsAsShown: vi.fn(),
    getUnshownTips: (tipIds: string[]) => tipIds,
    resetAllTips: vi.fn(),
    isTipShown: () => false,
  },
}))

// Mock TeachingTipTrigger to prevent any teaching tip related issues
vi.mock('@/presentation/components/shared/teachingTip/TeachingTipTrigger', () => ({
  TeachingTipTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="teaching-tip-trigger">{children}</div>
  ),
}))


vi.mock('@/presentation/components/shared/Image', () => ({
  default: ({
    src,
    alt,
    className,
    ...props
  }: PropsWithChildren<{ src: string; alt: string; className: string }>) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid="artwork-image"
      {...props}
    />
  ),
}))

vi.mock('@/presentation/components/shared/LikeButton', () => ({
  LikeButton: ({
    artwork,
    artworkId,
  }: {
    artwork: Artwork
    artworkId: string
  }) => (
    <button data-testid="like-button" data-artwork-id={artworkId}>
      Like {artwork.title}
    </button>
  ),
}))

vi.mock('@/presentation/components/shared/DislikeButton', () => ({
  DislikeButton: ({
    artwork,
    artworkId,
  }: {
    artwork: Artwork
    artworkId: string
  }) => (
    <button data-testid="dislike-button" data-artwork-id={artworkId}>
      Dislike {artwork.title}
    </button>
  ),
}))

vi.mock('@/lib/networkUtils', () => ({
  shouldShowOfflineFallback: vi.fn(() => false),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: PropsWithChildren) => (
      <div {...props}>{children}</div>
    ),
  },
}))
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <TeachingTipProvider>
        <ThemeProvider>{ui}</ThemeProvider>
      </TeachingTipProvider>
    </QueryClientProvider>
  )
}

import type { Artwork } from '@/core/domain/entities/Artwork'
import { ArtworkDetailContent } from '@/presentation/components/features/artwork/ArtworkDetailContent'
import { TeachingTipProvider } from '@/presentation/components/shared/teachingTip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseArtworkDetailViewModel = vi.fn()
const mockShouldShowOfflineFallback = vi.fn()
describe('ArtworkDetailContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockShouldShowOfflineFallback.mockReturnValue(false)
  })

  it('should render loading skeleton when loading', () => {
    mockUseArtworkDetailViewModel.mockReturnValue({
      artwork: null,
      isLoading: true,
      error: null,
    })

    renderWithProviders(<ArtworkDetailContent id="123" />)

    expect(screen.getByTestId('artwork-detail-skeleton')).toBeInTheDocument()
  })
}) 
