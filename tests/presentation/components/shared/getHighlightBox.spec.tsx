import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getElementBorderRadius } from '@/presentation/components/shared/teachingTip/getHighlightBox'

describe('getElementBorderRadius', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.removeChild(element)
    vi.restoreAllMocks()
  })

  it('returns the borderRadius from computed style if present', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      borderRadius: '12px',
    } as any)

    expect(getElementBorderRadius(element)).toBe('12px')
  })

  it('returns "8px" if computed style borderRadius is empty', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      borderRadius: '',
    } as any)

    expect(getElementBorderRadius(element)).toBe('8px')
  })

  it('returns "8px" if computed style borderRadius is undefined', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      borderRadius: undefined,
    } as any)

    expect(getElementBorderRadius(element)).toBe('8px')
  })

  it('returns correct highlight box with borderRadius from computed style', async () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      borderRadius: '10px',
    } as any)

    const mockRect = {
      top: 10,
      left: 20,
      width: 100,
      height: 50,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect as any)

    const { getHighlightBox } = await import(
      '@/presentation/components/shared/teachingTip/getHighlightBox'
    )
    const result = getHighlightBox(element)
    expect(result).toEqual({
      top: 10,
      left: 20,
      width: 100,
      height: 50,
      borderRadius: '10px',
    })
  })

  it('returns highlight box with default borderRadius if computed style is empty', async () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      borderRadius: '',
    } as any)

    const mockRect = {
      top: 5,
      left: 15,
      width: 80,
      height: 40,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect as any)

    const { getHighlightBox } = await import(
      '@/presentation/components/shared/teachingTip/getHighlightBox'
    )
    const result = getHighlightBox(element)
    expect(result).toEqual({
      top: 5,
      left: 15,
      width: 80,
      height: 40,
      borderRadius: '8px',
    })
  })

  describe('calculateTooltipPosition', () => {
    let tooltipDiv: HTMLDivElement
    let tooltipRef: React.RefObject<HTMLDivElement>
    const highlightBox = {
      top: 100,
      left: 200,
      width: 150,
      height: 50,
      borderRadius: '8px',
    }

    beforeEach(() => {
      tooltipDiv = document.createElement('div')
      document.body.appendChild(tooltipDiv)
      tooltipRef = { current: tooltipDiv }
      // Default viewport size
      Object.defineProperty(window, 'innerWidth', {
        value: 800,
        configurable: true,
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 600,
        configurable: true,
      })
    })

    afterEach(() => {
      document.body.removeChild(tooltipDiv)
      vi.restoreAllMocks()
    })

    it('returns {top:0, left:0, position} if tooltipRef.current is null', async () => {
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(
        highlightBox,
        { current: null },
        'top'
      )
      expect(result).toEqual({ top: 0, left: 0, position: 'top' })
    })

    it('positions tooltip below highlightBox by default', async () => {
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 100,
        height: 40,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(
        highlightBox,
        tooltipRef,
        'bottom'
      )
      expect(result.position).toBe('bottom')
      expect(result.top).toBe(100 + 50 + 16)
      expect(result.left).toBe(200 + (150 - 100) / 2)
    })

    it('positions tooltip above highlightBox if not enough space below', async () => {
      Object.defineProperty(window, 'innerHeight', {
        value: 220,
        configurable: true,
      })
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(
        highlightBox,
        tooltipRef,
        'bottom'
      )
      expect(result.position).toBe('top')
      expect(result.top).toBe(16)
    })

    it('positions tooltip below highlightBox if not enough space above', async () => {
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(highlightBox, tooltipRef, 'top')
      expect(result.position).toBe('bottom')
      expect(result.top).toBe(100 + 50 + 16)
    })

    it('positions tooltip to the left of highlightBox', async () => {
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 60,
        height: 40,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(highlightBox, tooltipRef, 'left')
      expect(result.position).toBe('left')
      expect(result.left).toBe(200 - 60 - 16)
      expect(result.top).toBe(100 + (50 - 40) / 2)
    })

    it('positions tooltip to the right of highlightBox if not enough space on the left', async () => {
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 300,
        height: 40,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(highlightBox, tooltipRef, 'left')
      expect(result.position).toBe('right')
      expect(result.left).toBe(200 + 150 + 16)
    })

    it('positions tooltip to the right of highlightBox', async () => {
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 60,
        height: 40,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(highlightBox, tooltipRef, 'right')
      expect(result.position).toBe('right')
      expect(result.left).toBe(200 + 150 + 16)
      expect(result.top).toBe(100 + (50 - 40) / 2)
    })

    it('positions tooltip to the left of highlightBox if not enough space on the right', async () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 400,
        configurable: true,
      })
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 300,
        height: 40,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(highlightBox, tooltipRef, 'right')
      expect(result.position).toBe('left')
      expect(result.left).toBe(16)
    })

    it('clamps tooltip within viewport bounds', async () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 400,
        configurable: true,
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 200,
        configurable: true,
      })
      vi.spyOn(tooltipDiv, 'getBoundingClientRect').mockReturnValue({
        width: 390,
        height: 190,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
      const { calculateTooltipPosition } = await import(
        '@/presentation/components/shared/teachingTip/getHighlightBox'
      )
      const result = calculateTooltipPosition(
        highlightBox,
        tooltipRef,
        'bottom'
      )
      expect(result.left).toBe(16)
      expect(result.top).toBe(16)
    })
  })
})
