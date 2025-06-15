'use client'

import { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import type {
  TeachingTip,
  TeachingTipContextType,
  TeachingTipProviderProps,
} from '@/types/teachingTip'
import { TeachingTipTrackingService } from '@/infrastructure/services/TeachingTipTrackingService'
import { v4 as uuidv4 } from 'uuid'

interface TeachingTipProviderPropsWithId extends TeachingTipProviderProps {
  id?: string
}

const TeachingTipContext = createContext<TeachingTipContextType | null>(null)

export { TeachingTipContext }

export function TeachingTipProvider({
  children,
  onComplete,
  onSkip,
  id = uuidv4(), // generate a unique id if not provided
}: TeachingTipProviderPropsWithId) {
  const [tips, setTips] = useState<Map<string, TeachingTip>>(new Map())
  const [isActive, setIsActive] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tipSequence, setTipSequence] = useState<string[]>([])
  const [currentTip, setCurrentTip] = useState<TeachingTip | null>(null)

  const totalTips = tipSequence.length

  const registerTip = useCallback((tip: TeachingTip) => {
    setTips((prev) => {
      const newTips = new Map(prev)
      newTips.set(tip.id, tip)
      return newTips
    })
  }, [])

  const unregisterTip = useCallback((id: string) => {
    setTips((prev) => {
      const newTips = new Map(prev)
      newTips.delete(id)
      return newTips
    })
    setTipSequence((prev) => prev.filter((tipId) => tipId !== id))
  }, [])

  const showTip = useCallback(
    (id: string) => {
      const tip = tips.get(id)
      if (!tip) return

      setTipSequence([id])
      setCurrentIndex(0)
      setCurrentTip(tip)
      setIsActive(true)
    },
    [tips]
  )

  const showAllTips = useCallback(() => {
    const allTipIds = Array.from(tips.keys())
    if (allTipIds.length === 0) return

    // Filter out tips that have already been shown (unless force showing)
    const unshownTips = TeachingTipTrackingService.getUnshownTips(allTipIds)
    const tipsToShow = unshownTips.length > 0 ? unshownTips : allTipIds

    setTipSequence(tipsToShow)
    setCurrentIndex(0)
    const firstTip = tips.get(tipsToShow[0])
    setCurrentTip(firstTip || null)
    setIsActive(true)
  }, [tips])

  const nextTip = useCallback(() => {
    // Mark current tip as shown
    if (currentTip) {
      TeachingTipTrackingService.markTipAsShown(currentTip.id)
    }

    if (currentIndex < tipSequence.length - 1) {
      const nextIndex = currentIndex + 1
      const nextTipId = tipSequence[nextIndex]
      const nextTip = tips.get(nextTipId)

      setCurrentIndex(nextIndex)
      setCurrentTip(nextTip || null)
      return
    }
    // Last tip, close the sequence
    setIsActive(false)
    setCurrentTip(null)
    setTipSequence([])
    setCurrentIndex(0)
    onComplete?.()
  }, [currentIndex, tipSequence, tips, onComplete, currentTip])

  const previousTip = useCallback(() => {
    if (currentIndex <= 0) {
      return
    }
    const prevIndex = currentIndex - 1
    const prevTipId = tipSequence[prevIndex]
    const prevTip = tips.get(prevTipId)

    setCurrentIndex(prevIndex)
    setCurrentTip(prevTip || null)
  }, [currentIndex, tipSequence, tips])

  const skipTip = useCallback(() => {
    nextTip()
  }, [nextTip])

  const skipAllTips = useCallback(() => {
    // Mark all remaining tips as shown
    if (currentTip) {
      const remainingTips = tipSequence.slice(currentIndex)
      TeachingTipTrackingService.markTipsAsShown(remainingTips)
    }

    setIsActive(false)
    setCurrentTip(null)
    setTipSequence([])
    setCurrentIndex(0)
    onSkip?.()
  }, [onSkip, currentTip, tipSequence, currentIndex])

  const closeTips = useCallback(() => {
    setIsActive(false)
    setCurrentTip(null)
    setTipSequence([])
    setCurrentIndex(0)
  }, [])

  const isTipRegistered = useCallback(
    (id: string) => {
      return tips.has(id)
    },
    [tips]
  )

  const getTipById = useCallback(
    (id: string) => {
      return tips.get(id)
    },
    [tips]
  )

  const restartTips = useCallback(() => {
    TeachingTipTrackingService.resetAllTips()
    setIsActive(false)
    setCurrentIndex(0)
  }, [])

  // Add restartCurrentTip for single-tip restart
  const restartCurrentTip = useCallback(() => {
    TeachingTipTrackingService.resetTip(currentTip?.id || '')
    if (!currentTip) return
    setCurrentIndex(0)
    setCurrentTip(tips.get(currentTip.id) || null)
    setIsActive(true)
  }, [currentTip, tips])

  // Handle keyboard events
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        skipAllTips()
      } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
        nextTip()
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        previousTip()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, currentIndex, nextTip, previousTip, skipAllTips])

  const contextValue = useMemo<TeachingTipContextType>(
    () => ({
      id,
      isActive,
      currentTip,
      currentIndex,
      totalTips,
      registerTip,
      unregisterTip,
      showTip,
      showAllTips,
      nextTip,
      previousTip,
      skipTip,
      skipAllTips,
      closeTips,
      isTipRegistered,
      getTipById,
      restartTips,
      restartCurrentTip, // add to context
    }),
    [
      id,
      isActive,
      currentTip,
      currentIndex,
      totalTips,
      registerTip,
      unregisterTip,
      showTip,
      showAllTips,
      nextTip,
      previousTip,
      skipTip,
      skipAllTips,
      closeTips,
      isTipRegistered,
      getTipById,
      restartTips,
      restartCurrentTip,
    ]
  )

  return (
    <TeachingTipContext.Provider value={contextValue}>
      {children}
    </TeachingTipContext.Provider>
  )
}
