import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '@/presentation/components/shared/ErrorBoundary'

// Mock the ErrorFallback component
vi.mock('@/presentation/components/features/ErrorFallback', () => ({
  ErrorFallback: ({
    error,
    resetErrorBoundary,
  }: {
    error?: Error
    resetErrorBoundary?: () => void
  }) => (
    <div data-testid="error-fallback">
      <p>Error: {error?.message || 'Unknown error'}</p>
      {resetErrorBoundary && (
        <button onClick={resetErrorBoundary} data-testid="reset-button">
          Reset
        </button>
      )}
    </div>
  ),
}))

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
})

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    console.error = originalConsoleError
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child component</div>
      </ErrorBoundary>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child component')).toBeInTheDocument()
  })

  it('should render ErrorFallback when child component throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument()
    expect(screen.getByText('Error: Test error')).toBeInTheDocument()
  })

  it('should log error to console when error occurs', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error boundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should handle different error types', () => {
    const CustomError = ({ message }: { message: string }) => {
      throw new Error(message)
    }

    render(
      <ErrorBoundary>
        <CustomError message="Custom error message" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error: Custom error message')).toBeInTheDocument()
  })

  it('should handle component unmounting during error state', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument()

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow()
  })
})
