'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../ui/button'
import { X, ChevronRight, ChevronLeft, SkipForward as Skip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTeachingTip } from '.'
import { getHighlightBox, calculateTooltipPosition } from './getHighlightBox';
export interface HighlightBox {
  top: number
  left: number
  width: number
  height: number
  borderRadius: string
}

export function TeachingTipOverlay() {
  const {
    isActive,
    currentTip,
    currentIndex,
    totalTips,
    nextTip,
    previousTip,
    skipAllTips,
    closeTips,
    restartTips,
    restartCurrentTip, // use restartCurrentTip for single tip
  } = useTeachingTip()

  const [highlightBox, setHighlightBox] = useState<HighlightBox | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number
    left: number
    position: 'top' | 'bottom' | 'left' | 'right'
  }>({
    top: 0,
    left: 0,
    position: 'bottom' as const,
  })
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isActive || !currentTip?.targetRef.current) {
      setHighlightBox(null)
      return
    }

    const updateHighlight = () => {
      if (currentTip.targetRef.current) {
        const box = getHighlightBox(currentTip.targetRef.current)
        setHighlightBox(box)

        // Scroll element into view if needed
        currentTip.targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }
    }

    updateHighlight()

    // Update on scroll and resize
    const handleUpdate = () => updateHighlight()
    window.addEventListener('scroll', handleUpdate, { passive: true })
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [isActive, currentTip])

  useEffect(() => {
    if (highlightBox && tooltipRef.current && currentTip) {
      const position = calculateTooltipPosition(
        highlightBox,
        tooltipRef as React.RefObject<HTMLDivElement>,
        currentTip.position
      )
      setTooltipPosition(position)
    }
  }, [highlightBox, currentTip])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget &&
      currentTip?.allowBackdropClick !== false
    ) {
      skipAllTips()
    }
  }

  if (!mounted || !isActive || !currentTip || !highlightBox) {
    return null
  }

  const isFirstTip = currentIndex === 0
  const isLastTip = currentIndex === totalTips - 1

  const tipsEnding = isLastTip ? (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={restartTips}>
        Restart
      </Button>
      {/* <Button size="sm" onClick={closeTips}>
        {currentTip.finishButtonText || 'Finish'}
      </Button> */}
    </div>
  ) : (
    <Button size="sm" onClick={nextTip}>
      {currentTip.nextButtonText || 'Next'}
      <ChevronRight className="ml-1 h-3 w-3" />
    </Button>
  )

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-auto fixed inset-0 z-[9999]"
        onClick={handleBackdropClick}
      >
        {/* Overlay with cutout */}
        <div className="absolute inset-0">
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
          >
            <defs>
              <mask id="teaching-tip-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={highlightBox.left - 4}
                  y={highlightBox.top - 4}
                  width={highlightBox.width + 8}
                  height={highlightBox.height + 8}
                  rx={highlightBox.borderRadius}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.7)"
              mask="url(#teaching-tip-mask)"
            />
          </svg>
        </div>

        {/* Highlight border */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="border-primary pointer-events-none absolute border-2 shadow-lg"
          style={{
            top: highlightBox.top - 4,
            left: highlightBox.left - 4,
            width: highlightBox.width + 8,
            height: highlightBox.height + 8,
            borderRadius: highlightBox.borderRadius,
          }}
        />

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
          className={cn(
            'bg-background pointer-events-auto absolute max-w-sm rounded-lg border p-4 shadow-xl',
            'before:bg-background before:absolute before:h-3 before:w-3 before:rotate-45 before:border',
            {
              'before:bottom-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-t-0 before:border-l-0':
                tooltipPosition.position === 'top',
              'before:top-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-r-0 before:border-b-0':
                tooltipPosition.position === 'bottom',
              'before:top-1/2 before:right-[-7px] before:-translate-y-1/2 before:border-t-0 before:border-r-0':
                tooltipPosition.position === 'left',
              'before:top-1/2 before:left-[-7px] before:-translate-y-1/2 before:border-b-0 before:border-l-0':
                tooltipPosition.position === 'right',
            }
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={closeTips}
          >
            <X className="h-3 w-3" />
          </Button>

          {/* Content */}
          <div className="pr-1">
            <h3 className="mb-2 text-sm font-semibold">{currentTip.title}</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {currentTip.description}
            </p>

            {/* Progress indicator */}
            {totalTips > 1 && (
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: totalTips }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-1.5 rounded-full transition-colors',
                      index === currentIndex
                        ? 'bg-primary w-4'
                        : 'bg-muted w-1.5'
                    )}
                  />
                ))}
                <span className="text-muted-foreground ml-2 text-xs">
                  {currentIndex + 1} of {totalTips}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!isFirstTip && (
                  <Button variant="outline" size="sm" onClick={previousTip}>
                    <ChevronLeft className="mr-1 h-3 w-3" />
                    Back
                  </Button>
                )}

                {currentTip.showSkipAll !== false && totalTips > 1 && (
                  <Button variant="ghost" size="sm" onClick={skipAllTips}>
                    <Skip className="mr-1 h-3 w-3" />
                    {currentTip.skipButtonText || 'Skip all'}
                  </Button>
                )}
              </div>

              {/* Show Restart only for single tip mode on finish */}
              {isLastTip && totalTips === 1 ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={restartCurrentTip}
                  >
                    Restart
                  </Button>
                  <Button size="sm" onClick={closeTips}>
                    {currentTip.finishButtonText || 'Finish'}
                  </Button>
                </div>
              ) : (
                tipsEnding
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
