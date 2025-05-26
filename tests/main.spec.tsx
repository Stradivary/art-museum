import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

describe('Application Smoke Tests', () => {
  it('should render a basic component', () => {
    const { getByText } = render(<div>Art Museum App</div>)
    expect(getByText('Art Museum App')).toBeDefined()
  })

  it('should support JSX rendering', () => {
    const TestComponent = () => <span data-testid="test">Test Component</span>
    const { getByTestId } = render(<TestComponent />)
    expect(getByTestId('test')).toBeDefined()
  })
})
