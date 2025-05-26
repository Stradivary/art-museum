import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Image } from '@/presentation/components/shared/Image'

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/test' }),
  }
})

describe('Image', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
  }

  const renderImage = (props = {}) => {
    return render(
      <MemoryRouter>
        <Image {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  it('should render with default props', () => {
    renderImage()

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', defaultProps.src)
    expect(img).toHaveAttribute('alt', defaultProps.alt)
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('should handle custom loading prop', () => {
    renderImage({ loading: 'eager' })

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'eager')
  })

  it('should handle width and height props', () => {
    renderImage({ width: 300, height: 200 })

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('width', '300')
    expect(img).toHaveAttribute('height', '200')
  })

  it('should apply custom className', () => {
    renderImage({ className: 'custom-class' })

    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-class')
  })

  it('should handle error with fallback image', async () => {
    const fallbackSrc = 'https://example.com/fallback.jpg'
    renderImage({ fallbackSrc })

    const img = screen.getByRole('img')

    // Simulate image error
    fireEvent.error(img)

    await waitFor(() => {
      expect(img).toHaveAttribute('src', fallbackSrc)
    })
  })

  it('should handle onLoadingComplete callback', () => {
    const onLoadingComplete = vi.fn()
    renderImage({ onLoadingComplete })

    const img = screen.getByRole('img')
    fireEvent.load(img)

    expect(onLoadingComplete).toHaveBeenCalledTimes(1)
  })

  it('should render with fill layout', () => {
    renderImage({
      fill: true,
      wrapperClassName: 'wrapper-class',
      objectFit: 'contain',
    })

    const wrapper = document.querySelector('.wrapper-class')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveStyle({
      position: 'relative',
      width: '100%',
      height: '100%',
    })

    const img = screen.getByRole('img')
    expect(img).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    })
  })

  it('should apply custom styles', () => {
    const customStyle = { borderRadius: '8px', opacity: 0.8 }
    renderImage({ style: customStyle })

    const img = screen.getByRole('img')
    expect(img).toHaveStyle(customStyle)
  })

  it('should update src when prop changes', async () => {
    const { rerender } = render(
      <MemoryRouter>
        <Image {...defaultProps} />
      </MemoryRouter>
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', defaultProps.src)

    const newSrc = 'https://example.com/new-image.jpg'
    rerender(
      <MemoryRouter>
        <Image {...defaultProps} src={newSrc} />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(img).toHaveAttribute('src', newSrc)
    })
  })

  it('should handle objectFit without fill', () => {
    renderImage({ objectFit: 'contain' })

    const img = screen.getByRole('img')
    expect(img).toHaveStyle({ objectFit: 'contain' })
  })

  it('should pass through additional props', () => {
    renderImage({
      'data-testid': 'custom-image',
      title: 'Custom title',
    })

    const img = screen.getByTestId('custom-image')
    expect(img).toHaveAttribute('title', 'Custom title')
  })

  it('should not fallback if no fallbackSrc provided', () => {
    renderImage()

    const img = screen.getByRole('img')
    const originalSrc = img.getAttribute('src')

    fireEvent.error(img)

    // Should keep original src since no fallback provided
    expect(img).toHaveAttribute('src', originalSrc)
  })
})
