import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LikeButton } from '@/presentation/components/shared/LikeButton'
import { mockArtwork } from '../../../__mocks__/data'
import * as SavedArtworkViewModel from '@/presentation/viewmodels/SavedArtworkViewModel'

// Mock the SavedArtworkViewModel
const mockUseSavedArtworkViewModel = vi.fn()
vi.spyOn(SavedArtworkViewModel, 'useSavedArtworkViewModel').mockImplementation(
  mockUseSavedArtworkViewModel
)

// Mock framer-motion is already set up in __mocks__/framer-motion.tsx

describe('LikeButton', () => {
  let queryClient: QueryClient
  const mockIsArtworkSaved = vi.fn()
  const mockSaveArtwork = vi.fn()
  const mockRemoveSavedArtwork = vi.fn()

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mockIsArtworkSaved.mockReturnValue(false)
    mockSaveArtwork.mockResolvedValue(undefined)
    mockRemoveSavedArtwork.mockResolvedValue(undefined)

    mockUseSavedArtworkViewModel.mockReturnValue({
      isArtworkSaved: mockIsArtworkSaved,
      saveArtwork: mockSaveArtwork,
      removeSavedArtwork: mockRemoveSavedArtwork,
    })
  })

  const renderLikeButton = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LikeButton artwork={mockArtwork} {...props} />
      </QueryClientProvider>
    )
  }

  it('should render with default props', () => {
    renderLikeButton()

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Save artwork')
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('should show saved state when artwork is saved', () => {
    mockIsArtworkSaved.mockReturnValue(true)
    renderLikeButton()

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Remove from saved artworks')
    expect(screen.getByText('Saved')).toBeInTheDocument()
  })

  it('should handle save action when clicked', async () => {
    renderLikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSaveArtwork).toHaveBeenCalledWith(mockArtwork)
    await waitFor(() => {
      expect(mockSaveArtwork).toHaveBeenCalledTimes(1)
    })
  })

  it('should handle remove action when artwork is saved', async () => {
    mockIsArtworkSaved.mockReturnValue(true)
    renderLikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockRemoveSavedArtwork).toHaveBeenCalledWith(mockArtwork.id)
    await waitFor(() => {
      expect(mockRemoveSavedArtwork).toHaveBeenCalledTimes(1)
    })
  })

  it('should render in compact mode', () => {
    renderLikeButton({ mode: 'compact', showLabel: false })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Save artwork') 
  })

  it('should prevent multiple clicks while loading', async () => {
    // Make saveArtwork take longer to resolve
    mockSaveArtwork.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    renderLikeButton()

    const button = screen.getByRole('button')

    // Click multiple times quickly
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    // Should only call saveArtwork once
    expect(mockSaveArtwork).toHaveBeenCalledTimes(1)
  })

  it('should show loading state during save operation', async () => {
    mockSaveArtwork.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    renderLikeButton()

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should show loading text
    expect(screen.getByText('Saving...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
    })
  })

  it('should show loading state during remove operation', async () => {
    mockIsArtworkSaved.mockReturnValue(true)
    mockRemoveSavedArtwork.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    renderLikeButton()

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
    mockSaveArtwork.mockRejectedValue(new Error('Save failed'))

    renderLikeButton()

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
    renderLikeButton({ className: 'custom-class' })

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should handle different sizes', () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <LikeButton artwork={mockArtwork} size="sm" />
      </QueryClientProvider>
    )

    let button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    rerender(
      <QueryClientProvider client={queryClient}>
        <LikeButton artwork={mockArtwork} size="lg" />
      </QueryClientProvider>
    )

    button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should handle different variants', () => {
    renderLikeButton({ variant: 'outline' })

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should stop event propagation', () => {
    const parentClickHandler = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <div onClick={parentClickHandler}>
          <LikeButton artwork={mockArtwork} />
        </div>
      </QueryClientProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(parentClickHandler).not.toHaveBeenCalled()
  })

  it('should prevent default event behavior', () => {
    renderLikeButton()

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
        <LikeButton artwork={mockArtwork} variant='labeled' />
      </QueryClientProvider>
    )

    expect(screen.getByText('Save')).toBeInTheDocument()

    rerender(
      <QueryClientProvider client={queryClient}>
        <LikeButton artwork={mockArtwork} variant='icon' />
      </QueryClientProvider>
    )

    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })
})
