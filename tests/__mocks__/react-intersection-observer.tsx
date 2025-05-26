import { vi } from 'vitest'

export const useInView = vi.fn().mockReturnValue({
  ref: () => {},
  inView: false,
  entry: undefined,
})
