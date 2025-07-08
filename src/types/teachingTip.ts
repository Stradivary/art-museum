export interface TeachingTip {
  id: string
  targetRef: React.RefObject<HTMLElement>
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  allowBackdropClick?: boolean
  showSkipAll?: boolean
  nextButtonText?: string
  skipButtonText?: string
  finishButtonText?: string
}

export interface TeachingTipContextType {
  // State management
  isActive: boolean
  currentTip: TeachingTip | null
  currentIndex: number
  totalTips: number

  // Tip management
  registerTip: (tip: TeachingTip) => void
  unregisterTip: (id: string) => void
  showTip: (id: string) => void
  showAllTips: () => void
  nextTip: () => void
  previousTip: () => void
  skipTip: () => void
  skipAllTips: () => void
  closeTips: () => void

  // Utilities
  isTipRegistered: (id: string) => boolean
  getTipById: (id: string) => TeachingTip | undefined
  restartTips: () => void
  restartCurrentTip: () => void
}

export interface TeachingTipProviderProps {
  children: React.ReactNode
  onComplete?: () => void
  onSkip?: () => void
}
