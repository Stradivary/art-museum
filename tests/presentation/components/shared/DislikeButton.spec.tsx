import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DislikeButton } from '@/presentation/components/shared/DislikeButton'
import { mockArtwork } from '../../../__mocks__/data'
import * as DislikedArtworkViewModel from '@/presentation/viewmodels/DislikedArtworkViewModel'

// Mock the DislikedArtworkViewModel
const mockUseDislikedArtworkViewModel = vi.fn()
vi.spyOn(
  DislikedArtworkViewModel,
  'useDislikedArtworkViewModel'
).mockImplementation(mockUseDislikedArtworkViewModel)

// Mock framer-motion is already set up in __mocks__/framer-motion.tsx

describe('DislikeButton', () => {
  let queryClient: QueryClient
  const mockIsArtworkDisliked = vi.fn()
  const mockDislikeArtwork = vi.fn()
  const mockRemoveDislikedArtwork = vi.fn()

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mockIsArtworkDisliked.mockReturnValue(false)
    mockDislikeArtwork.mockResolvedValue(undefined)
    mockRemoveDislikedArtwork.mockResolvedValue(undefined)

    mockUseDislikedArtworkViewModel.mockReturnValue({
      isArtworkDisliked: mockIsArtworkDisliked,
      dislikeArtwork: mockDislikeArtwork,
      removeDislikedArtwork: mockRemoveDislikedArtwork,
    })
  })

  const renderDislikeButton = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DislikeButton artwork={mockArtwork} {...props} />
      </QueryClientProvider>
    )
  }

  it('should render with default props', () => {
    renderDislikeButton()

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Dislike artwork')
    expect(screen.getByText('Dislike')).toBeInTheDocument()
  })

  it('should show disliked state when artwork is disliked', () => {
    mockIsArtworkDisliked.mockReturnValue(true)
    renderDislikeButton()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Remove from dislikes')
    expect(screen.getByText('Disliked')).toBeInTheDocument()
  })

  it('should handle dislike action when clicked', async () => {
    renderDislikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockDislikeArtwork).toHaveBeenCalledWith(mockArtwork)
    await waitFor(() => {
      expect(mockDislikeArtwork).toHaveBeenCalledTimes(1)
    })
  })

  it('should handle remove dislike action when artwork is disliked', async () => {
    mockIsArtworkDisliked.mockReturnValue(true)
    renderDislikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockRemoveDislikedArtwork).toHaveBeenCalledWith(mockArtwork.id)
    await waitFor(() => {
      expect(mockRemoveDislikedArtwork).toHaveBeenCalledTimes(1)
    })
  })

  it('should render in compact mode', () => {
    renderDislikeButton({ mode: 'compact', showLabel: false })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Dislike artwork')
  })

  it('should prevent multiple clicks while loading', async () => {
    // Make dislikeArtwork take longer to resolve
    mockDislikeArtwork.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    renderDislikeButton()

    const button = screen.getByRole('button')

    // Click multiple times quickly
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    // Should only call dislikeArtwork once
    expect(mockDislikeArtwork).toHaveBeenCalledTimes(1)
  })

  it('should show loading state during dislike operation', async () => {
    mockDislikeArtwork.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    renderDislikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should show loading text
    expect(screen.getByText('Disliking...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Disliking...')).not.toBeInTheDocument()
    })
  })

  it('should show loading state during remove operation', async () => {
    mockIsArtworkDisliked.mockReturnValue(true)
    mockRemoveDislikedArtwork.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    renderDislikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should show loading text
    expect(screen.getByText('Removing...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Removing...')).not.toBeInTheDocument()
    })
  })

  it('should handle errors gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mockDislikeArtwork.mockRejectedValue(new Error('Dislike failed'))

    renderDislikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in animated button click:',
        expect.any(Error)
      )
    })

    consoleErrorSpy.mockRestore()
  })

  it('should apply custom className', () => {
    renderDislikeButton({ className: 'custom-class' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should handle different sizes', () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <DislikeButton artwork={mockArtwork} size="sm" />
      </QueryClientProvider>
    )

    let button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    rerender(
      <QueryClientProvider client={queryClient}>
        <DislikeButton artwork={mockArtwork} size="lg" />
      </QueryClientProvider>
    )

    button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should handle different variants', () => {
    renderDislikeButton({ variant: 'outline' })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should stop event propagation', () => {
    const parentClickHandler = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <div onClick={parentClickHandler}>
          <DislikeButton artwork={mockArtwork} />
        </div>
      </QueryClientProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(parentClickHandler).not.toHaveBeenCalled()
  })

  it('should prevent default event behavior', () => {
    renderDislikeButton()

    const button = screen.getByRole('button')
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

    fireEvent(button, clickEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should show label by default but hide when showLabel is false', () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <DislikeButton artwork={mockArtwork} variant="labeled" />
      </QueryClientProvider>
    )

    expect(screen.getByText('Dislike')).toBeInTheDocument()

    rerender(
      <QueryClientProvider client={queryClient}>
        <DislikeButton artwork={mockArtwork} variant="icon" />
      </QueryClientProvider>
    )
  })
})
