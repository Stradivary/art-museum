import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import { ImageViewer } from '@/presentation/components/shared/ImageViewer'
import { TeachingTipProvider } from '@/presentation/components/shared/teachingTip/TeachingTipProvider'

// Mock dependencies
// Update the import path to match the actual import in ImageViewer
vi.mock('@/presentation/components/shared/useImageViewer', async () => {
  const actual = await vi.importActual<any>(
    '@/presentation/components/shared/useImageViewer'
  )
  return {
    ...actual,
    useImageViewer: () => ({
      zoom: 1,
      rotation: 0,
      drag: { x: 0, y: 0 },
      handleTouchStart: vi.fn(),
      handleTouchMove: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleMouseDown: vi.fn(),
      handleMouseMove: vi.fn(),
      handleMouseUp: vi.fn(),
      handleWheel: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      rotate: vi.fn(),
      reset: vi.fn(),
    }),
  }
})
vi.mock('@/presentation/components/shared//teachingTip', () => ({
  useRegisterTeachingTip: () => ({ ref: React.createRef() }),
  TeachingTipTrigger: (props: any) => <button {...props} />,
}))
vi.mock('@/presentation/components/ui/dialog', () => ({
  Dialog: ({ open, onOpenChange, children }: any) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children, ...props }: any) => (
    <div data-testid="dialog" role="dialog" {...props}>
      {children}
    </div>
  ),
  DialogOverlay: () => <div data-testid="dialog-overlay" />,
}))

vi.mock('@/presentation/components/shared/button', () => ({
  Button: React.forwardRef(({ children, ...props }: any, ref) => (
    <button ref={ref} {...props}>
      {children}
    </button>
  )),
}))

describe('ImageViewer', () => {
  const src = 'test-image.jpg'
  const alt = 'Test Image'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens dialog when image is clicked', () => {
    render(
      <TeachingTipProvider>
        <ImageViewer src={src} alt={alt} />
      </TeachingTipProvider>
    )
    fireEvent.click(screen.getByAltText(alt))
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
  })

  it('opens dialog when "View & Zoom" button is clicked', () => {
    render(
      <TeachingTipProvider>
        <ImageViewer src={src} alt={alt} />
      </TeachingTipProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: /view & zoom/i }))
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
  })

  it('renders zoom, rotate, and fullscreen buttons in dialog', () => {
    render(
      <TeachingTipProvider>
        <ImageViewer src={src} alt={alt} />
      </TeachingTipProvider>
    )
    fireEvent.click(screen.getByAltText(alt))
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /zoom out/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rotate/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /enter fullscreen/i })
    ).toBeInTheDocument()
  })

  it('renders teaching tip trigger when preference.showTeachingTips is true', () => {
    render(
      <TeachingTipProvider>
        <ImageViewer src={src} alt={alt} />
      </TeachingTipProvider>
    )
    fireEvent.click(screen.getByAltText(alt))
    expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument()
  })
})
