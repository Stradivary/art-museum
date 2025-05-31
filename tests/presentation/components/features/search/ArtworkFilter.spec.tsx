import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArtworkFilter } from '@/presentation/components/features/search/ArtworkFilter'

vi.mock('@/presentation/components/ui/select', () => ({
  Select: (props: any) => <select {...props}>{props.children}</select>,
}))
vi.mock('@/presentation/components/ui/button', () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}))
vi.mock('@/presentation/components/ui/badge', () => ({
  Badge: (props: any) => <span {...props}>{props.children}</span>,
}))
vi.mock('@/presentation/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
}))
vi.mock('@/presentation/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
}))

describe('ArtworkFilter', () => {
  it('renders filter options and calls onFiltersChange', () => {
    const onFiltersChange = vi.fn()
    render(
      <ArtworkFilter
        filters={{ department: '', artwork_type_title: '' }}
        onFiltersChange={onFiltersChange}
      />
    )
    // Open filter popover
    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)
    // Change department
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Modern Art' } })
    expect(onFiltersChange).toHaveBeenCalledWith({ department: 'Modern Art', artwork_type_title: '' })
  })
})
