import { vi } from 'vitest'

interface MockProps {
  children?: React.ReactNode
  [key: string]: unknown
}

export const motion = {
  div: ({ children, ...props }: MockProps) => <div {...props}>{children}</div>,
  span: ({ children, ...props }: MockProps) => (
    <span {...props}>{children}</span>
  ),
  button: ({ children, ...props }: MockProps) => (
    <button {...props}>{children}</button>
  ),
  p: ({ children, ...props }: MockProps) => <p {...props}>{children}</p>,
}

export const AnimatePresence = ({ children }: MockProps) => children
