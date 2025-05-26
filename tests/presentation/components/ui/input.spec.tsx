import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/presentation/components/ui/input'

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('data-slot', 'input')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should handle value changes', () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('should apply different input types', () => {
    const { rerender } = render(<Input type="email" />)

    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    input = screen.getByDisplayValue('') // password inputs don't have textbox role
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:pointer-events-none')
  })

  it('should accept custom className', () => {
    render(<Input className="custom-class" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('should handle focus and blur events', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    render(<Input onFocus={onFocus} onBlur={onBlur} />)

    const input = screen.getByRole('textbox')

    fireEvent.focus(input)
    expect(onFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(input)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('should apply focus styles', () => {
    render(<Input />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('focus-visible:border-ring')
    expect(input).toHaveClass('focus-visible:ring-ring/50')
  })

  it('should handle required attribute', () => {
    render(<Input required />)

    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('should handle aria-invalid styling', () => {
    render(<Input aria-invalid="true" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('aria-invalid:ring-destructive/20')
  })

  it('should handle file input type', () => {
    render(<Input type="file" accept=".jpg,.png" />)

    const input = screen.getByDisplayValue('')
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('accept', '.jpg,.png')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })
})
