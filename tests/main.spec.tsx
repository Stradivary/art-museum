import { test } from 'vitest'
import HelloWorld from '../src/routes/App'
import { render } from '@testing-library/react'

test('renders name', async () => {
    const { getByText } = render(<HelloWorld />) 

    expect(getByText('Hello world!')).toBeDefined()
})