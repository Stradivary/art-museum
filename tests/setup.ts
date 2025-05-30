import '@testing-library/jest-dom/vitest'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock fetch
global.fetch = vi.fn()

// Mock i18n for react-i18next
import i18n from './__mocks__/i18nForTests'

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next')
  return {
    ...actual,
    useTranslation: () => ({
      t: i18n.t.bind(i18n),
      i18n,
    }),
    Trans: (props: { children: React.ReactNode }) => props.children,
    withTranslation: () => (Component: React.ComponentType) => Component,
    initReactI18next: { type: '3rdParty', init: () => {} },
  }
})

// Setup cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})
