import { useRef, useState, useCallback } from 'react'

export function useImageViewer(initialZoom = 1, initialRotation = 0) {
  const [zoom, setZoom] = useState(initialZoom)
  const [rotation, setRotation] = useState(initialRotation)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const lastTouch = useRef<{ x: number; y: number } | null>(null)
  const lastDistance = useRef<number | null>(null)
  const lastAngle = useRef<number | null>(null)
  const lastRotation = useRef<number>(initialRotation)
  const lastZoom = useRef<number>(initialZoom)
  const dragStart = useRef<{ x: number; y: number } | null>(null)

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        setDragging(true)
        lastTouch.current = {
          x: e.touches[0].clientX - drag.x,
          y: e.touches[0].clientY - drag.y,
        }
      } else if (e.touches.length === 2) {
        setDragging(false)
        lastDistance.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        lastAngle.current = Math.atan2(
          e.touches[1].clientY - e.touches[0].clientY,
          e.touches[1].clientX - e.touches[0].clientX
        )
        lastZoom.current = zoom
        lastRotation.current = rotation
      }
    },
    [drag.x, drag.y, zoom, rotation]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && dragging && lastTouch.current) {
        setDrag({
          x: e.touches[0].clientX - lastTouch.current.x,
          y: e.touches[0].clientY - lastTouch.current.y,
        })
      } else if (
        e.touches.length === 2 &&
        lastDistance.current &&
        lastAngle.current !== null
      ) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const angle = Math.atan2(
          e.touches[1].clientY - e.touches[0].clientY,
          e.touches[1].clientX - e.touches[0].clientX
        )
        // Pinch zoom
        const scale = dist / lastDistance.current
        setZoom(Math.max(0.2, Math.min(lastZoom.current * scale, 5)))
        // Rotate
        const deltaAngle = ((angle - lastAngle.current) * 180) / Math.PI
        setRotation(Math.round(lastRotation.current + deltaAngle))
      }
    },
    [dragging]
  )

  const handleTouchEnd = useCallback(() => {
    setDragging(false)
    lastTouch.current = null
    lastDistance.current = null
    lastAngle.current = null
  }, [])

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true)
      dragStart.current = { x: e.clientX - drag.x, y: e.clientY - drag.y }
    },
    [drag.x, drag.y]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !dragStart.current) return
      setDrag({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    },
    [dragging]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  // Wheel event handler for zoom/rotate
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.shiftKey) {
      // Rotate
      setRotation((r) => {
        let next = r + (e.deltaY > 0 ? 10 : -10)
        if (next < 0) next += 360
        if (next >= 360) next -= 360
        return next
      })
    } else {
      // Zoom
      setZoom((z) => {
        const next = z + (e.deltaY > 0 ? -0.1 : 0.1)
        return Math.max(0.2, Math.min(next, 5))
      })
    }
  }, [])

  // Utility controls
  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.2, 5)), [])
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.2, 0.2)), [])
  const rotate = useCallback(() => {
    setRotation((prev) => {
      const next = prev + 90
      if (next === 360) {
        setTimeout(() => setRotation(0), 4)
        return 360
      }
      return next % 360
    })
  }, [])

  const reset = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setDrag({ x: 0, y: 0 })
  }, [])

  return {
    zoom,
    setZoom,
    rotation,
    setRotation,
    drag,
    setDrag,
    dragging,
    setDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    zoomIn,
    zoomOut,
    rotate,
    reset,
  }
}
