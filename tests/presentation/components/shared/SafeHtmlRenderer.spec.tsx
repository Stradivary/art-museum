import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SafeHtmlRenderer } from '@/presentation/components/shared/SafeHtmlRenderer'
import DOMPurify from 'dompurify'

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(),
  },
}))

describe('SafeHtmlRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render sanitized HTML content', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    const originalHtml = '<p>Hello <script>alert("xss")</script>World</p>'
    const sanitizedHtml = '<p>Hello World</p>'

    mockSanitize.mockReturnValue(sanitizedHtml)

    render(<SafeHtmlRenderer html={originalHtml} />)

    expect(mockSanitize).toHaveBeenCalledWith(originalHtml)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should sanitize malicious scripts', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    const maliciousHtml = '<img src="x" onerror="alert(1)" />'
    const sanitizedHtml = '<img src="x" />'

    mockSanitize.mockReturnValue(sanitizedHtml)

    render(<SafeHtmlRenderer html={maliciousHtml} />)

    expect(mockSanitize).toHaveBeenCalledWith(maliciousHtml)
  })

  it('should apply custom className when provided', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    mockSanitize.mockReturnValue('<p>Content</p>')

    render(
      <SafeHtmlRenderer html="<p>Content</p>" className="custom-html-class" />
    )

    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass('custom-html-class')
  })

  it('should handle empty HTML string', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    mockSanitize.mockReturnValue('')

    const { container } = render(<SafeHtmlRenderer html="" />)

    expect(mockSanitize).toHaveBeenCalledWith('')
    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('should preserve safe HTML elements and attributes', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    const safeHtml =
      '<p class="text-bold">Safe <em>content</em> with <a href="/link">link</a></p>'

    mockSanitize.mockReturnValue(safeHtml)

    render(<SafeHtmlRenderer html={safeHtml} />)

    expect(mockSanitize).toHaveBeenCalledWith(safeHtml)
    // Check for the paragraph element specifically
    expect(screen.getByRole('paragraph').textContent).toBe(
      'Safe content with link'
    )
    expect(screen.getByRole('link', { name: 'link' })).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('should sanitize potentially dangerous HTML', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    const dangerousHtml = '<div onclick="alert(\'xss\')">Click me</div>'
    const sanitizedHtml = '<div>Click me</div>'

    mockSanitize.mockReturnValue(sanitizedHtml)

    render(<SafeHtmlRenderer html={dangerousHtml} />)

    expect(mockSanitize).toHaveBeenCalledWith(dangerousHtml)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle complex nested HTML structures', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    const complexHtml = `
      <div>
        <h2>Title</h2>
        <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    `

    mockSanitize.mockReturnValue(complexHtml)

    render(<SafeHtmlRenderer html={complexHtml} />)

    expect(mockSanitize).toHaveBeenCalledWith(complexHtml)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('bold')).toBeInTheDocument()
    expect(screen.getByText('italic')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('should render with dangerouslySetInnerHTML', () => {
    const mockSanitize = vi.mocked(DOMPurify.sanitize)
    const htmlContent = '<p>Test content</p>'

    mockSanitize.mockReturnValue(htmlContent)

    const { container } = render(<SafeHtmlRenderer html={htmlContent} />)

    expect(container.firstChild).toHaveProperty('innerHTML', htmlContent)
  })
})
