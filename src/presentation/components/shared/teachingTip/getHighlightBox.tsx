'use client'
import type React from 'react'
import type { HighlightBox } from './TeachingTipOverlay'

export function getElementBorderRadius(element: HTMLElement): string {
  const computedStyle = window.getComputedStyle(element)
  return computedStyle.borderRadius || '8px'
}

export function getHighlightBox(element: HTMLElement): HighlightBox {
  const rect = element.getBoundingClientRect()
  const borderRadius = getElementBorderRadius(element)

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    borderRadius,
  }
}

export function calculateTooltipPosition(
  highlightBox: HighlightBox,
  tooltipRef: React.RefObject<HTMLDivElement>,
  preferredPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
) {
  const padding = 16
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  if (!tooltipRef.current) {
    return { top: 0, left: 0, position: preferredPosition }
  }

  const tooltipRect = tooltipRef.current.getBoundingClientRect()
  let position = preferredPosition
  let top = 0
  let left = 0

  switch (position) {
    case 'top':
      top = highlightBox.top - tooltipRect.height - padding
      left = highlightBox.left + (highlightBox.width - tooltipRect.width) / 2

      // Check if tooltip goes above viewport
      if (top < padding) {
        // eslint-disable-next-line sonarjs/no-redundant-assignments
        position = 'bottom'
        top = highlightBox.top + highlightBox.height + padding
      }
      break

    case 'bottom':
      top = highlightBox.top + highlightBox.height + padding
      left = highlightBox.left + (highlightBox.width - tooltipRect.width) / 2

      // Check if tooltip goes below viewport
      if (top + tooltipRect.height > viewportHeight - padding) {
        position = 'top'
        top = highlightBox.top - tooltipRect.height - padding
      }
      break

    case 'left':
      top = highlightBox.top + (highlightBox.height - tooltipRect.height) / 2
      left = highlightBox.left - tooltipRect.width - padding

      // Check if tooltip goes beyond left edge
      if (left < padding) {
        position = 'right'
        left = highlightBox.left + highlightBox.width + padding
      }
      break

    case 'right':
      top = highlightBox.top + (highlightBox.height - tooltipRect.height) / 2
      left = highlightBox.left + highlightBox.width + padding

      // Check if tooltip goes beyond right edge
      if (left + tooltipRect.width > viewportWidth - padding) {
        position = 'left'
        left = highlightBox.left - tooltipRect.width - padding
      }
      break
  }

  // Ensure tooltip stays within viewport bounds
  left = Math.max(
    padding,
    Math.min(left, viewportWidth - tooltipRect.width - padding)
  )
  top = Math.max(
    padding,
    Math.min(top, viewportHeight - tooltipRect.height - padding)
  )

  return { top, left, position }
}
