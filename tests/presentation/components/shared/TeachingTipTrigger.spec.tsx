import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
// Mock useTeachingTip hook before importing the component
let mockUseTeachingTipReturn: any = {
  showTip: vi.fn(),
  showAllTips: vi.fn(),
  isActive: false,
}
vi.mock('@/presentation/hooks/useTeachingTip', () => ({
  useTeachingTip: () => mockUseTeachingTipReturn,
}))

import { TeachingTipTrigger } from '@/presentation/components/shared/teachingTip/TeachingTipTrigger'

const getMockedHook = (overrides = {}) => ({
  showTip: vi.fn(),
  showAllTips: vi.fn(),
  isActive: false,
  ...overrides,
})


describe('TeachingTipTrigger', () => {
  beforeEach(() => {
    // Reset all mocks and the mock return value before each test
    vi.clearAllMocks()
    mockUseTeachingTipReturn = {
      showTip: vi.fn(),
      showAllTips: vi.fn(),
      isActive: false,
    }
    vi.resetModules()
  })

  it('renders icon button by default', () => {
    render(<TeachingTipTrigger />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('title', 'Show help')
  })

  it('renders children if provided', () => {
    render(<TeachingTipTrigger>Custom</TeachingTipTrigger>)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('calls showTip with tipId when clicked', () => {
    mockUseTeachingTipReturn = getMockedHook()
    render(<TeachingTipTrigger tipId="tip-1" />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockUseTeachingTipReturn.showTip).toHaveBeenCalledWith('tip-1')
    expect(mockUseTeachingTipReturn.showAllTips).not.toHaveBeenCalled()
  })

  it('calls showAllTips when showAll is true and no tipId', () => {
    mockUseTeachingTipReturn = getMockedHook()
    render(<TeachingTipTrigger showAll />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockUseTeachingTipReturn.showAllTips).toHaveBeenCalled()
    expect(mockUseTeachingTipReturn.showTip).not.toHaveBeenCalled()
  })

  it('does not call anything if isActive is true', () => {
    mockUseTeachingTipReturn = getMockedHook({ isActive: true })
    render(<TeachingTipTrigger tipId="tip-1" />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockUseTeachingTipReturn.showTip).not.toHaveBeenCalled()
    expect(mockUseTeachingTipReturn.showAllTips).not.toHaveBeenCalled()
  })

  it('button is disabled when isActive is true', () => {
    mockUseTeachingTipReturn = getMockedHook({ isActive: true })
    render(<TeachingTipTrigger />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
 

  it('applies custom className', () => {
    render(<TeachingTipTrigger className="custom-class" />)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
