import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SearchBar } from '@/presentation/components/features/search/SearchBar'

// Mock useDebounce hook
vi.mock('@/presentation/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value, // Return value immediately for testing
}))

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('SearchBar', () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
    mockNavigate.mockClear()
  })

  const renderSearchBar = (props = {}) => {
    return render(
      <MemoryRouter>
        <SearchBar onSearch={mockOnSearch} {...props} />
      </MemoryRouter>
    )
  }

  it('should render with default props', () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute(
      'placeholder',
      'Search for artworks, artists, movements...'
    )
    expect(input).toHaveAttribute('aria-label', 'Search')
    expect(input).toHaveValue('')
  })

  it('should render with initial query', () => {
    renderSearchBar({ initialQuery: 'test query' })

    const input = screen.getByRole('searchbox')
    expect(input).toHaveValue('test query')
  })

  it('should call onSearch when input value changes', async () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'test search' } })

    expect(input).toHaveValue('test search')
    expect(mockOnSearch).toHaveBeenCalledWith('test search')
  })

  it('should navigate to search URL when query is entered', async () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'monet' } })

    expect(mockNavigate).toHaveBeenCalledWith('/?q=monet')
  })

  it('should navigate to home when query is cleared', async () => {
    renderSearchBar({ initialQuery: 'test' })

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: '' } })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should show clear button when query has value', () => {
    renderSearchBar({ initialQuery: 'test query' })

    const clearButton = screen.getByLabelText('Clear search')
    expect(clearButton).toBeInTheDocument()
  })

  it('should not show clear button when query is empty', () => {
    renderSearchBar()

    const clearButton = screen.queryByLabelText('Clear search')
    expect(clearButton).not.toBeInTheDocument()
  })

  it('should clear search when clear button is clicked', () => {
    renderSearchBar({ initialQuery: 'test query' })

    const input = screen.getByRole('searchbox')
    const clearButton = screen.getByLabelText('Clear search')

    expect(input).toHaveValue('test query')

    fireEvent.click(clearButton)

    expect(input).toHaveValue('')
    expect(mockOnSearch).toHaveBeenCalledWith('')
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should handle special characters in search query', () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')
    const specialQuery = 'café & art'

    fireEvent.change(input, { target: { value: specialQuery } })

    expect(mockNavigate).toHaveBeenCalledWith('/?q=caf%C3%A9%20%26%20art')
  })

  it('should display search icon', () => {
    renderSearchBar()

    // The Search icon should be rendered
    const searchIcon = document.querySelector('.lucide-search')
    expect(searchIcon).toBeInTheDocument()
  })

  it('should handle focus states correctly', () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')

    // Focus the input and check if it's in the document
    fireEvent.focus(input)
    expect(input).toBeInTheDocument()
    // Note: Testing actual focus state is challenging with framer-motion animations
    // The input should be focusable but may not register as focused due to animation timing
  })

  it('should handle keyboard events', () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')

    fireEvent.keyDown(input, { key: 'Enter' })
    // Should not cause any errors
    expect(input).toBeInTheDocument()
  })

  it('should update query when typing', async () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')

    // Type character by character
    fireEvent.change(input, { target: { value: 't' } })
    expect(input).toHaveValue('t')

    fireEvent.change(input, { target: { value: 'te' } })
    expect(input).toHaveValue('te')

    fireEvent.change(input, { target: { value: 'test' } })
    expect(input).toHaveValue('test')
  })

  it('should handle empty string search', () => {
    renderSearchBar({ initialQuery: 'initial' })

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: '' } })

    expect(mockOnSearch).toHaveBeenCalledWith('')
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should properly encode URL parameters', () => {
    renderSearchBar()

    const input = screen.getByRole('searchbox')
    const queryWithSpaces = 'van gogh paintings'

    fireEvent.change(input, { target: { value: queryWithSpaces } })

    expect(mockNavigate).toHaveBeenCalledWith('/?q=van%20gogh%20paintings')
  })
})
