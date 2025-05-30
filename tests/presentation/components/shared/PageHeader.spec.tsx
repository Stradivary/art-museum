/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { PageHeader } from '@/presentation/components/shared/PageHeader'
import { ThemeProvider } from '@/presentation/components/shared/ThemeProvider'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => (
      <header {...props}>{children}</header>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="arrow-left-icon" />,
  Moon: () => <svg data-testid="moon-icon" />,
}))

// Mock the Button component
vi.mock('@/presentation/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

const mockNavigate = vi.fn()

vi.mock('react-router', async (importOriginal) => {
  const actual: any = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </MemoryRouter>
  )
}

describe('PageHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the title correctly', () => {
    renderWithRouter(<PageHeader title="Test Title" />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should not show back button by default', () => {
    renderWithRouter(<PageHeader title="Test Title" />)

    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument()
  })

  it('should show back button when showBackButton is true', () => {
    renderWithRouter(<PageHeader title="Test Title" showBackButton={true} />)

    expect(screen.getByLabelText('Go back')).toBeInTheDocument()
    expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument()
  })

  it('should call navigate(-1) when back button is clicked and no onBackClick provided', () => {
    renderWithRouter(<PageHeader title="Test Title" showBackButton={true} />)

    const backButton = screen.getByLabelText('Go back')
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('should call custom onBackClick when provided', () => {
    const mockOnBackClick = vi.fn()

    renderWithRouter(
      <PageHeader
        title="Test Title"
        showBackButton={true}
        onBackClick={mockOnBackClick}
      />
    )

    const backButton = screen.getByLabelText('Go back')
    fireEvent.click(backButton)

    expect(mockOnBackClick).toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should render children when provided', () => {
    renderWithRouter(
      <PageHeader title="Test Title">
        <div data-testid="header-children">Header Actions</div>
      </PageHeader>
    )

    expect(screen.getByTestId('header-children')).toBeInTheDocument()
    expect(screen.getByText('Header Actions')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    renderWithRouter(
      <PageHeader title="Test Title" className="custom-header-class" />
    )

    const header = screen.getByRole('banner')
    expect(header).toHaveClass('custom-header-class')
  })

  it('should set view transition name based on title', () => {
    renderWithRouter(<PageHeader title="Art Gallery" />)

    const titleElement = screen.getByText('Art Gallery')
    expect(titleElement).toHaveStyle({
      viewTransitionName: 'page-title-art-gallery',
    })
  })

  it('should handle titles with multiple words and special characters', () => {
    renderWithRouter(<PageHeader title="My Art Collection!" />)

    const titleElement = screen.getByText('My Art Collection!')
    expect(titleElement).toHaveStyle({
      viewTransitionName: 'page-title-my-art-collection!',
    })
  })

  it('should have proper accessibility attributes', () => {
    renderWithRouter(<PageHeader title="Test Title" showBackButton={true} />)

    const backButton = screen.getByLabelText('Go back')
    expect(backButton).toHaveAttribute('aria-label', 'Go back')
  })

  it('should maintain header structure with proper classes', () => {
    renderWithRouter(<PageHeader title="Test Title" />)

    const header = screen.getByRole('banner')
    expect(header).toHaveClass('sticky', 'top-0', 'z-20')
  })
})
