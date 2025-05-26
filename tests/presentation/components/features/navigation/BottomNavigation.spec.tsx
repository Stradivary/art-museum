import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { BottomNavigation } from '@/presentation/components/features/navigation/BottomNavigation'

describe('BottomNavigation', () => {
  const renderBottomNavigation = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <BottomNavigation />
      </MemoryRouter>
    )
  }

  it('should render all navigation links', () => {
    renderBottomNavigation()

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /saved/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
  })

  it('should have correct href attributes', () => {
    renderBottomNavigation()

    const homeLink = screen.getByRole('link', { name: /home/i })
    const savedLink = screen.getByRole('link', { name: /saved/i })
    const profileLink = screen.getByRole('link', { name: /profile/i })

    expect(homeLink).toHaveAttribute('href', '/')
    expect(savedLink).toHaveAttribute('href', '/saved')
    expect(profileLink).toHaveAttribute('href', '/profile')
  })

  it('should highlight home link when on home page', () => {
    renderBottomNavigation('/')

    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toHaveClass('bg-[#8a0000]')

    // Should show active indicator
    const indicator = homeLink.querySelector('.absolute.bottom-0')
    expect(indicator).toBeInTheDocument()
  })

  it('should highlight saved link when on saved page', () => {
    renderBottomNavigation('/saved')

    const savedLink = screen.getByRole('link', { name: /saved/i })
    expect(savedLink).toHaveClass('bg-[#8a0000]')

    // Should show active indicator
    const indicator = savedLink.querySelector('.absolute.bottom-0')
    expect(indicator).toBeInTheDocument()
  })

  it('should highlight profile link when on profile page', () => {
    renderBottomNavigation('/profile')

    const profileLink = screen.getByRole('link', { name: /profile/i })
    expect(profileLink).toHaveClass('bg-[#8a0000]')

    // Should show active indicator
    const indicator = profileLink.querySelector('.absolute.bottom-0')
    expect(indicator).toBeInTheDocument()
  })

  it('should not highlight any link when on other pages', () => {
    renderBottomNavigation('/artwork/123')

    const homeLink = screen.getByRole('link', { name: /home/i })
    const savedLink = screen.getByRole('link', { name: /saved/i })
    const profileLink = screen.getByRole('link', { name: /profile/i })

    expect(homeLink).not.toHaveClass('bg-[#8a0000]')
    expect(savedLink).not.toHaveClass('bg-[#8a0000]')
    expect(profileLink).not.toHaveClass('bg-[#8a0000]')
  })

  it('should display icons for each navigation item', () => {
    renderBottomNavigation()

    // Check for SVG elements (Lucide icons render as SVGs)
    const homeLink = screen.getByText('Home').closest('a')
    const savedLink = screen.getByText('Saved').closest('a')
    const profileLink = screen.getByText('Profile').closest('a')

    expect(homeLink?.querySelector('svg')).toBeInTheDocument()
    expect(savedLink?.querySelector('svg')).toBeInTheDocument()
    expect(profileLink?.querySelector('svg')).toBeInTheDocument()
  })

  it('should display text labels for each navigation item', () => {
    renderBottomNavigation()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    renderBottomNavigation()

    const navigation = document.querySelector(
      '.fixed.right-0.bottom-0.left-0.z-10'
    )
    expect(navigation).toBeInTheDocument()

    const grid = document.querySelector('.grid.grid-cols-3')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('bg-[#a20000]', 'text-white')
  })

  it('should have hover states on non-active links', () => {
    renderBottomNavigation('/saved') // Saved is active

    const homeLink = screen.getByRole('link', { name: /home/i })
    const profileLink = screen.getByRole('link', { name: /profile/i })

    expect(homeLink).toHaveClass('hover:bg-[#8a0000]')
    expect(profileLink).toHaveClass('hover:bg-[#8a0000]')
  })

  it('should handle URL with query parameters', () => {
    renderBottomNavigation('/?q=search')

    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toHaveClass('bg-[#8a0000]')
  })

  it('should be fixed positioned at bottom', () => {
    renderBottomNavigation()

    const navigation = document.querySelector('.fixed.right-0.bottom-0.left-0')
    expect(navigation).toBeInTheDocument()
    expect(navigation).toHaveClass('z-10', 'border-t', 'bg-white')
  })

  it('should have proper responsive layout', () => {
    renderBottomNavigation()

    const container = document.querySelector('.mx-auto.max-w-7xl')
    expect(container).toBeInTheDocument()
  })
})
