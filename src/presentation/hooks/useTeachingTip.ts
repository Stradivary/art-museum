import { useContext } from 'react'
import { TeachingTipContext } from '@/presentation/components/shared/teachingTip/TeachingTipProvider'

export function useTeachingTip() {
  const context = useContext(TeachingTipContext)
  if (!context) {
    throw new Error('useTeachingTip must be used within a TeachingTipProvider')
  }
  return context
}
