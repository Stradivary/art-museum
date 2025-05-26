import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreventScreenshot } from '@/presentation/hooks/usePreventScreenshot'

// Mock navigator clipboard
const mockNavigator = {
  clipboard: {
    writeText: vi.fn(),
  },
}

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
})

describe('usePreventScreenshot', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let addEventListenerSpy: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let removeEventListenerSpy: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Spy on window event listeners
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  describe('event listener setup', () => {
    it('should add keydown event listener on mount', () => {
      renderHook(() => usePreventScreenshot())

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })

    it('should remove keydown event listener on unmount', () => {
      const { unmount } = renderHook(() => usePreventScreenshot())

      // Get the handler function that was added
      const addedHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        addedHandler
      )
    })
  })

  describe('PrintScreen key prevention', () => {
    it('should prevent PrintScreen key default behavior', () => {
      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      expect(keydownHandler).toBeDefined()

      // Mock PrintScreen key event
      const mockEvent = {
        key: 'PrintScreen',
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should write fallback text to clipboard when PrintScreen is pressed', () => {
      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      // Mock PrintScreen key event
      const mockEvent = {
        key: 'PrintScreen',
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)

      expect(mockNavigator.clipboard.writeText).toHaveBeenCalledWith(
        'Screenshots are disabled.'
      )
    })

    it('should handle clipboard not being available', () => {
      // Remove clipboard from navigator
      const originalClipboard = navigator.clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      })

      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      // Mock PrintScreen key event
      const mockEvent = {
        key: 'PrintScreen',
        preventDefault: vi.fn(),
      }

      // Should not throw error
      expect(() => keydownHandler(mockEvent)).not.toThrow()
      expect(mockEvent.preventDefault).toHaveBeenCalled()

      // Restore clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
      })
    })
  })

  describe('print prevention (Ctrl+P / Cmd+P)', () => {
    it('should prevent Ctrl+P on Windows/Linux', () => {
      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      // Mock Ctrl+P key event
      const mockEvent = {
        key: 'p',
        ctrlKey: true,
        metaKey: false,
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should prevent Cmd+P on Mac', () => {
      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      // Mock Cmd+P key event
      const mockEvent = {
        key: 'p',
        ctrlKey: false,
        metaKey: true,
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should handle uppercase P key', () => {
      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      // Mock Ctrl+P with uppercase P
      const mockEvent = {
        key: 'P',
        ctrlKey: true,
        metaKey: false,
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)

      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should not prevent P key without modifier keys', () => {
      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      // Mock regular P key press
      const mockEvent = {
        key: 'p',
        ctrlKey: false,
        metaKey: false,
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('other keys', () => {
    it('should not prevent other key combinations', () => {
      renderHook(() => usePreventScreenshot())

      // Get the keydown handler
      const keydownHandler = addEventListenerSpy.mock.calls.find(
        (call: string[]) => call[0] === 'keydown'
      )?.[1]

      const testCases = [
        { key: 'a', ctrlKey: true }, // Ctrl+A
        { key: 'c', ctrlKey: true }, // Ctrl+C
        { key: 'v', ctrlKey: true }, // Ctrl+V
        { key: 'Enter' }, // Enter
        { key: 'Escape' }, // Escape
        { key: 'Tab' }, // Tab
      ]

      testCases.forEach((eventProps) => {
        const mockEvent = {
          key: eventProps.key,
          ctrlKey: eventProps.ctrlKey || false,
          metaKey: false,
          preventDefault: vi.fn(),
        }

        keydownHandler(mockEvent)

        expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      })
    })
  })

  describe('multiple hook instances', () => {
    it('should handle multiple hook instances correctly', () => {
      const { unmount: unmount1 } = renderHook(() => usePreventScreenshot())
      const { unmount: unmount2 } = renderHook(() => usePreventScreenshot())

      // Should have two event listeners added
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2)

      unmount1()

      // Should have one remove listener call
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)

      unmount2()

      // Should have two remove listener calls
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('hook re-renders', () => {
    it('should maintain the same event listener across re-renders', () => {
      const { rerender } = renderHook(() => usePreventScreenshot())

      const initialCallCount = addEventListenerSpy.mock.calls.length

      // Re-render the hook
      rerender()

      // Should not add additional event listeners
      expect(addEventListenerSpy).toHaveBeenCalledTimes(initialCallCount)
      expect(removeEventListenerSpy).not.toHaveBeenCalled()
    })
  })
})
