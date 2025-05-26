import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SecurityProvider } from '@/presentation/components/shared/SecurityProvider'
import { usePreventScreenshot } from '@/presentation/hooks/usePreventScreenshot'

// Mock the usePreventScreenshot hook
vi.mock('@/presentation/hooks/usePreventScreenshot', () => ({
  usePreventScreenshot: vi.fn(),
}))

describe('SecurityProvider', () => {
  let mockUsePreventScreenshot: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePreventScreenshot = vi.mocked(usePreventScreenshot)
  })

  afterEach(() => {
    cleanup()
  })

  it('should render children correctly', () => {
    render(
      <SecurityProvider>
        <div data-testid="child-content">Test content</div>
      </SecurityProvider>
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should call usePreventScreenshot hook', () => {
    render(
      <SecurityProvider>
        <div>Content</div>
      </SecurityProvider>
    )

    expect(mockUsePreventScreenshot).toHaveBeenCalled()
  })

  it('should apply security-protected class to wrapper div', () => {
    render(
      <SecurityProvider>
        <div data-testid="child">Content</div>
      </SecurityProvider>
    )

    const wrapper = screen.getByTestId('child').parentElement
    expect(wrapper).toHaveClass('security-protected')
  })

  it('should apply minimum height and relative positioning', () => {
    render(
      <SecurityProvider>
        <div data-testid="child">Content</div>
      </SecurityProvider>
    )

    const wrapper = screen.getByTestId('child').parentElement
    expect(wrapper).toHaveStyle({
      minHeight: '100vh',
      position: 'relative',
    })
  })

  it('should handle multiple children correctly', () => {
    render(
      <SecurityProvider>
        <div data-testid="child1">First child</div>
        <div data-testid="child2">Second child</div>
        <span data-testid="child3">Third child</span>
      </SecurityProvider>
    )

    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
    expect(screen.getByTestId('child3')).toBeInTheDocument()
    expect(screen.getByText('First child')).toBeInTheDocument()
    expect(screen.getByText('Second child')).toBeInTheDocument()
    expect(screen.getByText('Third child')).toBeInTheDocument()
  })

  it('should work with complex nested component structures', () => {
    render(
      <SecurityProvider>
        <div>
          <header data-testid="header">Header</header>
          <main data-testid="main">
            <section>
              <h1>Title</h1>
              <p>Content</p>
            </section>
          </main>
          <footer data-testid="footer">Footer</footer>
        </div>
      </SecurityProvider>
    )

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('main')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should render as a div with security class', () => {
    const { container } = render(
      <SecurityProvider>
        <div>Test</div>
      </SecurityProvider>
    )

    const securityDiv = container.querySelector('.security-protected')
    expect(securityDiv).toBeInTheDocument()
    expect(securityDiv?.tagName).toBe('DIV')
  })

  it('should have proper wrapper structure', () => {
    render(
      <SecurityProvider>
        <span data-testid="inner">Inner content</span>
      </SecurityProvider>
    )

    const innerElement = screen.getByTestId('inner')
    const wrapper = innerElement.parentElement
    
    expect(wrapper).toHaveClass('security-protected')
    expect(wrapper).toHaveStyle('min-height: 100vh')
    expect(wrapper).toHaveStyle('position: relative')
  })
})
