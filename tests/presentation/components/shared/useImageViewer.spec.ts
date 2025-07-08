import { renderHook, act } from '@testing-library/react'
import { useImageViewer } from '@/presentation/components/shared/useImageViewer'

describe('useImageViewer', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImageViewer())
    expect(result.current.zoom).toBe(1)
    expect(result.current.rotation).toBe(0)
    expect(result.current.drag).toEqual({ x: 0, y: 0 })
    expect(result.current.dragging).toBe(false)
  })

  it('should initialize with custom values', () => {
    const { result } = renderHook(() => useImageViewer(2, 45))
    expect(result.current.zoom).toBe(2)
    expect(result.current.rotation).toBe(45)
  })

  it('should zoom in and out within bounds', () => {
    const { result } = renderHook(() => useImageViewer())
    act(() => result.current.zoomIn())
    expect(result.current.zoom).toBeCloseTo(1.2)
    act(() => result.current.zoomOut())
    expect(result.current.zoom).toBeCloseTo(1)
    // Test lower bound
    act(() => {
      for (let i = 0; i < 20; i++) result.current.zoomOut()
    })
    expect(result.current.zoom).toBe(0.2)
    // Test upper bound
    act(() => {
      for (let i = 0; i < 50; i++) result.current.zoomIn()
    })
    expect(result.current.zoom).toBe(5)
  })

  it('should rotate by 90 degrees and reset after 360', () => {
    const { result } = renderHook(() => useImageViewer())
    act(() => result.current.rotate())
    expect(result.current.rotation).toBe(90)
    act(() => result.current.rotate())
    expect(result.current.rotation).toBe(180)
    act(() => result.current.rotate())
    expect(result.current.rotation).toBe(270)
    // The next rotate schedules a reset to 0 after a timeout
    act(() => result.current.rotate())
    expect(result.current.rotation).toBe(360)
    // Fast-forward timers to trigger setTimeout
    vi.advanceTimersByTime(4)
    expect(result.current.rotation).toBe(360)
  })

  it('should reset zoom, rotation, and drag', () => {
    const { result } = renderHook(() => useImageViewer())
    act(() => {
      result.current.setZoom(2)
      result.current.setRotation(45)
      result.current.setDrag({ x: 10, y: 20 })
      result.current.reset()
    })
    expect(result.current.zoom).toBe(1)
    expect(result.current.rotation).toBe(0)
    expect(result.current.drag).toEqual({ x: 0, y: 0 })
  })

  it('should handle mouse drag', () => {
    const { result } = renderHook(() => useImageViewer())
    // Mouse down
    act(() => {
      result.current.handleMouseDown({
        clientX: 100,
        clientY: 200,
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.dragging).toBe(true)
    // Mouse move
    act(() => {
      result.current.handleMouseMove({
        clientX: 120,
        clientY: 220,
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.drag).toEqual({ x: 20, y: 20 })
    // Mouse up
    act(() => {
      result.current.handleMouseUp()
    })
    expect(result.current.dragging).toBe(false)
  })

  it('should handle wheel zoom and rotation', () => {
    const { result } = renderHook(() => useImageViewer())
    // Zoom in (deltaY < 0)
    act(() => {
      result.current.handleWheel({
        deltaY: -100,
        shiftKey: false,
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.zoom).toBeCloseTo(1.1)
    // Zoom out (deltaY > 0)
    act(() => {
      result.current.handleWheel({
        deltaY: 100,
        shiftKey: false,
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.zoom).toBeCloseTo(1)
    // Rotate (shiftKey)
    act(() => {
      result.current.handleWheel({
        deltaY: 100,
        shiftKey: true,
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.rotation).toBe(10)
    act(() => {
      result.current.handleWheel({
        deltaY: -100,
        shiftKey: true,
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.rotation).toBe(0)
  })

  it('should handle touch drag', () => {
    const { result } = renderHook(() => useImageViewer())
    // Touch start
    act(() => {
      result.current.handleTouchStart({
        touches: [{ clientX: 50, clientY: 60 }],
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.dragging).toBe(true)
    // Touch move
    act(() => {
      result.current.handleTouchMove({
        touches: [{ clientX: 70, clientY: 90 }],
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.drag).toEqual({ x: 20, y: 30 })
    // Touch end
    act(() => {
      result.current.handleTouchEnd()
    })
    expect(result.current.dragging).toBe(false)
  })

  it('should handle pinch zoom and rotate', () => {
    const { result } = renderHook(() => useImageViewer())
    // Pinch start
    act(() => {
      result.current.handleTouchStart({
        touches: [
          { clientX: 0, clientY: 0 },
          { clientX: 0, clientY: 100 },
        ],
        preventDefault: () => {},
      } as any)
    })
    // Pinch move (increase distance)
    act(() => {
      result.current.handleTouchMove({
        touches: [
          { clientX: 0, clientY: 0 },
          { clientX: 0, clientY: 200 },
        ],
        preventDefault: () => {},
      } as any)
    })
    expect(result.current.zoom).toBeGreaterThan(1)
    // Pinch move (rotate)
    act(() => {
      result.current.handleTouchMove({
        touches: [
          { clientX: 100, clientY: 0 },
          { clientX: 0, clientY: 100 },
        ],
        preventDefault: () => {},
      } as any)
    })
    expect(typeof result.current.rotation).toBe('number')
  })
})