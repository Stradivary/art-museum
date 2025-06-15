'use client'

import React from 'react'
import { Button } from '../../ui/button'
import { HelpCircle, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTeachingTip } from '@/presentation/hooks/useTeachingTip'

interface TeachingTipTriggerProps {
  variant?: 'button' | 'icon' | 'link'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  tipId?: string // Show specific tip
  showAll?: boolean // Show all registered tips
}

export function TeachingTipTrigger({
  variant = 'icon',
  size = 'md',
  className,
  children,
  tipId,
  showAll = true,
}: TeachingTipTriggerProps) {
  const { showTip, showAllTips, isActive } = useTeachingTip()

  const handleClick = () => {
    if (isActive) return

    if (tipId) {
      showTip(tipId)
    } else if (showAll) {
      showAllTips()
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', className)}
        onClick={handleClick}
        disabled={isActive}
        title="Show help"
      >
        {children || <HelpCircle className="h-4 w-4" />}
      </Button>
    )
  }

  if (variant === 'link') {
    return (
      <button
        className={cn(
          'text-primary hover:text-primary/80 text-sm underline-offset-4 hover:underline',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onClick={handleClick}
        disabled={isActive}
      >
        {children || 'Show tutorial'}
      </button>
    )
  }

  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isActive}
    >
      <Play className="mr-2 h-4 w-4" />
      {children || 'Start tutorial'}
    </Button>
  )
}
