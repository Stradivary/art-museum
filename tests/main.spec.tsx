import { test } from 'vitest' 
import { render } from '@testing-library/react'

test('renders name', async () => {
    const { getByText } = render(<div>Hello world!</div>) 

    expect(getByText('Hello world!')).toBeDefined()
})