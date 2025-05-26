import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/presentation/components/ui/button'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
    expect(button).toHaveAttribute('data-slot', 'button')
  })

  it('should handle click events', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should apply variant classes correctly', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)

    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border')

    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent')

    rerender(<Button variant="link">Link</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('underline-offset-4')
  })

  it('should apply size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)

    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-8')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-10')

    rerender(<Button size="icon">Icon</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('size-9')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none')
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveTextContent('Link Button')
  })

  it('should handle keyboard events', () => {
    const onKeyDown = vi.fn()
    render(<Button onKeyDown={onKeyDown}>Keyboard</Button>)

    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })

    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })

  it('should apply focus styles', () => {
    render(<Button>Focus me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus-visible:ring-ring/50')
  })
})
