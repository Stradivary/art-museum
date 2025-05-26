import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '@/presentation/components/ui/select'

describe('Select', () => {
  it('should render with default props', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('should render with label', () => {
    render(
      <Select label="Choose option">
        <option value="option1">Option 1</option>
      </Select>
    )

    expect(screen.getByText('Choose option')).toBeInTheDocument()
    expect(screen.getByLabelText('Choose option')).toBeInTheDocument()
  })

  it('should handle value changes', () => {
    const onChange = vi.fn()
    render(
      <Select onChange={onChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option2' } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(select).toHaveValue('option2')
  })

  it('should be disabled when disabled prop is true', () => {
    render(
      <Select disabled>
        <option value="option1">Option 1</option>
      </Select>
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
    expect(select).toHaveClass('disabled:cursor-not-allowed')
  })

  it('should accept custom className', () => {
    render(
      <Select className="custom-class">
        <option value="option1">Option 1</option>
      </Select>
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('custom-class')
  })

  it('should handle focus and blur events', () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    render(
      <Select onFocus={onFocus} onBlur={onBlur}>
        <option value="option1">Option 1</option>
      </Select>
    )

    const select = screen.getByRole('combobox')

    fireEvent.focus(select)
    expect(onFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(select)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('should apply focus styles', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
      </Select>
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('focus:ring-2')
    expect(select).toHaveClass('focus:ring-[#a20000]')
  })

  it('should handle required attribute', () => {
    render(
      <Select required>
        <option value="">Choose...</option>
        <option value="option1">Option 1</option>
      </Select>
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeRequired()
  })

  it('should display chevron icon', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
      </Select>
    )

    // The ChevronDown icon should be rendered
    const chevron = document.querySelector('.lucide-chevron-down')
    expect(chevron).toBeInTheDocument()
  })

  it('should handle default value', () => {
    render(
      <Select defaultValue="option2">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('option2')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(
      <Select ref={ref}>
        <option value="option1">Option 1</option>
      </Select>
    )

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSelectElement))
  })
})
