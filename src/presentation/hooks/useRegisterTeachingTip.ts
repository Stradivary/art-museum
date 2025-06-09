'use client'

import { useEffect, useRef } from 'react'
import { useTeachingTip } from './useTeachingTip'
import type { TeachingTip } from '@/types/teachingTip'

export interface UseTeachingTipOptions {
  id: string
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  allowBackdropClick?: boolean
  showSkipAll?: boolean
  nextButtonText?: string
  skipButtonText?: string
  finishButtonText?: string
  enabled?: boolean
}

export function useRegisterTeachingTip<T extends HTMLElement = HTMLElement>(
  options: UseTeachingTipOptions
) {
  const ref = useRef<T>(null)
  const { registerTip, unregisterTip, showTip, isTipRegistered } =
    useTeachingTip()

  const {
    id,
    title,
    description,
    position,
    allowBackdropClick,
    showSkipAll,
    nextButtonText,
    skipButtonText,
    finishButtonText,
    enabled = true,
  } = options

  useEffect(() => {
    if (!enabled || !ref.current) return

    const tip: TeachingTip = {
      id,
      title,
      description,
      position,
      allowBackdropClick,
      showSkipAll,
      nextButtonText,
      skipButtonText,
      finishButtonText,
      targetRef: ref as React.RefObject<HTMLElement>,
    }

    registerTip(tip)

    return () => {
      unregisterTip(id)
    }
  }, [
    enabled,
    id,
    title,
    description,
    position,
    allowBackdropClick,
    showSkipAll,
    nextButtonText,
    skipButtonText,
    finishButtonText,
    registerTip,
    unregisterTip,
  ])

  const show = () => {
    if (enabled && isTipRegistered(id)) {
      showTip(id)
    }
  }

  return {
    ref,
    show,
    isRegistered: isTipRegistered(id),
  }
}
