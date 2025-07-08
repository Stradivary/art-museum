import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OfflineFallback } from '@/presentation/components/features/OfflineFallback'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

// Mock react-router's useNavigate
vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}))

// Mock react-i18next's useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}))

describe('OfflineFallback', () => {
  const mockNavigate = vi.fn()
  const mockT = vi.fn((key: string, defaultValue: string) => defaultValue)

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate)
    ;(useTranslation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ t: mockT })
  })

  it('renders offline title and description', () => {
    render(<OfflineFallback />)
    expect(screen.getByText("You're offline")).toBeInTheDocument()
    expect(
      screen.getByText(
        'Some features or content may not be available while offline. Please check your internet connection and try again.'
      )
    ).toBeInTheDocument()
  })

  it('renders Try Again and Go Home buttons', () => {
    render(<OfflineFallback />)
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Go Home/i })).toBeInTheDocument()
  })

  it('calls window.location.reload when Try Again is clicked', () => {
    const originalLocation = window.location
    // @ts-expect-error override for test
    delete window.location
    // @ts-expect-error override for test
    window.location = { ...originalLocation, reload: vi.fn() }
    render(<OfflineFallback />)
    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }))
    expect(window.location.reload).toHaveBeenCalled()
    window.location = originalLocation
  })

  it('calls navigate("/") when Go Home is clicked', () => {
    render(<OfflineFallback />)
    fireEvent.click(screen.getByRole('button', { name: /Go Home/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('renders saved content info', () => {
    render(<OfflineFallback />)
    expect(
      screen.getByText('You can still browse saved content while offline')
    ).toBeInTheDocument()
  })
})