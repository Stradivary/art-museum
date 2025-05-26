import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from '@/presentation/components/ui/skeleton'

describe('Skeleton Component', () => {
  it('should render with default classes', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton')
    expect(skeleton.className).toContain('animate-pulse')
    expect(skeleton.className).toContain('rounded-md')
  })

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton.className).toContain('custom-class')
    expect(skeleton.className).toContain('animate-pulse')
  })

  it('should pass through other props', () => {
    const { container } = render(<Skeleton data-testid="skeleton-test" />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton).toHaveAttribute('data-testid', 'skeleton-test')
  })

  it('should render as a div element', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton.tagName).toBe('DIV')
  })
})
