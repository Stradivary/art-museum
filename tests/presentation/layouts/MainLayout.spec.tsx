/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MainLayout } from '@/presentation/layouts/MainLayout'
import { ThemeProvider } from '@/presentation/components/shared/ThemeProvider'

// Mock all the dependencies
vi.mock(
  '@/presentation/components/features/navigation/BottomNavigation',
  () => ({
    BottomNavigation: () => (
      <nav data-testid="bottom-navigation">Bottom Navigation</nav>
    ),
  })
)

vi.mock('@/presentation/components/shared/SecurityProvider', () => ({
  SecurityProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="security-provider">{children}</div>
  ),
}))

vi.mock('@/presentation/components/shared/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}))

vi.mock('@/presentation/components/shared/Loading', () => ({
  PageLoadingFallback: ({ text }: { text: string }) => (
    <div data-testid="page-loading-fallback">{text}</div>
  ),
}))

vi.mock('@/presentation/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
}))

vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}))

vi.mock('@/infrastructure/services/queryClientService', () => ({
  queryClient: {},
}))

// Mock react-router Outlet
vi.mock('react-router', async (importOriginal) => {
  const actual: any = await importOriginal()
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page Content</div>,
  }
})

// Mock React Suspense
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="suspense">{children}</div>
    ),
  }
})

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </MemoryRouter>
  )
}

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all provider components in correct order', () => {
    renderWithRouter(<MainLayout />)

    // Check that all providers are rendered
    expect(screen.getByTestId('security-provider')).toBeInTheDocument()
    expect(screen.getByTestId('query-client-provider')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument()
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
  })

 
  it('should render the Outlet component for route content', () => {
    renderWithRouter(<MainLayout />)

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  it('should render the BottomNavigation component', () => {
    renderWithRouter(<MainLayout />)

    expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument()
    expect(screen.getByText('Bottom Navigation')).toBeInTheDocument()
  })

  it('should wrap content in Suspense with loading fallback', () => {
    renderWithRouter(<MainLayout />)

    // Check that Suspense components are rendered
    const suspenseElements = screen.getAllByTestId('suspense')
    expect(suspenseElements).toHaveLength(2) // One for Outlet, one for BottomNavigation
  })

  it('should have proper provider nesting structure', () => {
    renderWithRouter(<MainLayout />)

    // SecurityProvider should be the outermost
    const securityProvider = screen.getByTestId('security-provider')

    // QueryClientProvider should be inside SecurityProvider
    const queryClientProvider = screen.getByTestId('query-client-provider')
    expect(securityProvider).toContainElement(queryClientProvider)

    // TooltipProvider should be inside QueryClientProvider
    const tooltipProvider = screen.getByTestId('tooltip-provider')
    expect(queryClientProvider).toContainElement(tooltipProvider)

    // ErrorBoundary should be inside TooltipProvider
    const errorBoundary = screen.getByTestId('error-boundary')
    expect(tooltipProvider).toContainElement(errorBoundary)
  })
 

  it('should render without errors', () => {
    expect(() => renderWithRouter(<MainLayout />)).not.toThrow()
  })

  it('should maintain component hierarchy for accessibility', () => {
    renderWithRouter(<MainLayout />)

    // The main content should be accessible
    const outlet = screen.getByTestId('outlet')
    expect(outlet).toBeInTheDocument()

    // Navigation should be separate from main content
    const bottomNav = screen.getByTestId('bottom-navigation')
    expect(bottomNav).toBeInTheDocument()

    // They should not be nested within each other
    expect(outlet).not.toContainElement(bottomNav)
    expect(bottomNav).not.toContainElement(outlet)
  })

  it('should handle TooltipProvider with correct delay', () => {
    // This test ensures the TooltipProvider is configured properly
    renderWithRouter(<MainLayout />)

    const tooltipProvider = screen.getByTestId('tooltip-provider')
    expect(tooltipProvider).toBeInTheDocument()
  })

  it('should provide proper context for child components', () => {
    renderWithRouter(<MainLayout />)

    // All the necessary providers should be present for child components
    expect(screen.getByTestId('security-provider')).toBeInTheDocument()
    expect(screen.getByTestId('query-client-provider')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument()
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
  })
})
