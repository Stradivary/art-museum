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
        filters={{ department: '', artworkType: '' }}
        onFiltersChange={onFiltersChange}
      />
    )
    // Open filter popover
    const filterBtn = screen.getByRole('button')
    fireEvent.click(filterBtn)
    // Change department
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Modern Art' } })
    expect(onFiltersChange).toHaveBeenCalledWith({
      department: 'Modern Art',
      artworkType: '',
    })
  })

  it('shows filter summary in tooltip when no filters are active', () => {
    render(
      <ArtworkFilter
        filters={{}}
        onFiltersChange={vi.fn()}
      />
    )
    expect(screen.getByText(/Browse and filter artworks/i)).toBeInTheDocument()
  })

  it('shows active filter summary in tooltip when filters are set', () => {
    render(
      <ArtworkFilter
        filters={{ department: 'Modern Art', artworkType: 'Painting' }}
        onFiltersChange={vi.fn()}
      />
    )
    expect(screen.getAllByText(/Modern Art/)).toBeDefined()
    expect(screen.getAllByText(/Painting/)).toBeDefined()
  })

  it('renders all select options', () => {
    render(
      <ArtworkFilter
        filters={{}}
        onFiltersChange={vi.fn()}
      />
    )
    // Open filter popover
    fireEvent.click(screen.getByRole('button'))
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBe(4)
    expect(screen.getByText('All Departments')).toBeInTheDocument()
    expect(screen.getByText('All Artwork Types')).toBeInTheDocument()
    expect(screen.getByText('All Places of Origin')).toBeInTheDocument()
    expect(screen.getByText('All Mediums')).toBeInTheDocument()
  })

  it('calls onFiltersChange with correct key/value for each filter', () => {
    const onFiltersChange = vi.fn()
    render(
      <ArtworkFilter
        filters={{}}
        onFiltersChange={onFiltersChange}
      />
    )
    fireEvent.click(screen.getByRole('button'))
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: 'Sculpture' } })
    expect(onFiltersChange).toHaveBeenCalledWith({
      artworkType: 'Sculpture',
    })
    fireEvent.change(selects[2], { target: { value: 'France' } })
    expect(onFiltersChange).toHaveBeenCalledWith({
      placeOfOrigin: 'France',
    })
    fireEvent.change(selects[3], { target: { value: 'Bronze' } })
    expect(onFiltersChange).toHaveBeenCalledWith({
      medium: 'Bronze',
    })
  })

  it('shows and clears active filter badges', () => {
    const onFiltersChange = vi.fn()
    render(
      <ArtworkFilter
        filters={{ department: 'Modern Art', artworkType: 'Painting' }}
        onFiltersChange={onFiltersChange}
      />
    )
    // Open the filter popover first by clicking the "Filters" button
    fireEvent.click(screen.getByText('Clear All'))
    // Badges for active filters
    expect(screen.getAllByText('Modern Art')).toBeDefined()
    expect(screen.getAllByText('Painting')).toBeDefined()
    // Click badge to clear department
    fireEvent.click(screen.getAllByText('Modern Art')[0])
    expect(onFiltersChange).toHaveBeenCalledWith({ 
    })
  })

  it('calls onFiltersChange with empty object when Clear All is clicked', () => {
    const onFiltersChange = vi.fn()
    render(
      <ArtworkFilter
        filters={{ department: 'Modern Art', artworkType: 'Painting' }}
        onFiltersChange={onFiltersChange}
      />
    )
    // Open the filter popover first by clicking the "Filters" button
    fireEvent.click(screen.getByText(/Filters/i))
    // Now click the "Clear All" button
    fireEvent.click(screen.getByText(/Clear All/i))
    expect(onFiltersChange).toHaveBeenCalledWith({})
  })

  it('shows badge count when filters are active', () => {
    render(
      <ArtworkFilter
        filters={{ department: 'Modern Art', artworkType: 'Painting' }}
        onFiltersChange={vi.fn()}
      />
    )
    // Badge with count 2
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
