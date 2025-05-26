import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorFallback } from '@/presentation/components/features/ErrorFallback'

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

describe('ErrorFallback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render error fallback with default message', () => {
    render(<ErrorFallback />)

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    expect(
      screen.getByText(
        'An unexpected error occurred. Please try refreshing the page or go back to the home page.'
      )
    ).toBeInTheDocument()
  })

  it('should render custom error message', () => {
    const customError = new Error('Custom error message')
    render(<ErrorFallback error={customError} />)

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('should show reset button when resetErrorBoundary is provided', () => {
    const mockReset = vi.fn()
    render(<ErrorFallback resetErrorBoundary={mockReset} />)

    const resetButton = screen.getByTestId('reset-button')
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).toHaveTextContent('Try Again')
  })

  it('should not show reset button when resetErrorBoundary is not provided', () => {
    render(<ErrorFallback />)

    expect(screen.queryByTestId('reset-button')).not.toBeInTheDocument()
  })

  it('should call resetErrorBoundary when reset button is clicked', () => {
    const mockReset = vi.fn()
    render(<ErrorFallback resetErrorBoundary={mockReset} />)

    const resetButton = screen.getByTestId('reset-button')
    fireEvent.click(resetButton)

    expect(mockReset).toHaveBeenCalledOnce()
  })

  it('should navigate to home when home button is clicked', () => {
    render(<ErrorFallback />)

    const homeButton = screen.getByText('Go Home')
    fireEvent.click(homeButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should render alert icon', () => {
    render(<ErrorFallback />)

    // Check for the presence of the AlertTriangle icon (Lucide icons render as SVGs)
    const alertIcon =
      document.querySelector('[data-lucide="alert-triangle"]') ||
      document.querySelector('svg')
    expect(alertIcon).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    render(<ErrorFallback />)

    const container = screen
      .getByText('Oops! Something went wrong')
      .closest('div')
    expect(container).toHaveClass(
      'w-full',
      'max-w-md',
      'rounded-xl',
      'bg-white'
    )
  })

  it('should render both error and reset props together', () => {
    const customError = new Error('Test error')
    const mockReset = vi.fn()

    render(<ErrorFallback error={customError} resetErrorBoundary={mockReset} />)

    expect(screen.getByText('Test error')).toBeInTheDocument()
    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
    expect(screen.getByText('Go Home')).toBeInTheDocument()
  })
})
