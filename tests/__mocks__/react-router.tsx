import { vi } from 'vitest'

export const mockNavigate = vi.fn()
export const mockUseLocation = vi.fn(() => ({ pathname: '/' }))

export const useNavigate = () => mockNavigate
export const useLocation = () => mockUseLocation()

export const Link = ({ children, to, ...props }: any) => (
  <a href={to} {...props}>
    {children}
  </a>
)
