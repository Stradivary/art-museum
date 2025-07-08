'use client'

import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { BottomNavigation } from '../components/features/navigation/BottomNavigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/infrastructure/services/queryClientService'
import { SecurityProvider } from '../components/shared/SecurityProvider'
import { ErrorBoundary } from '../components/shared/ErrorBoundary'
import { PageLoadingFallback } from '../components/shared/Loading'
import { TooltipProvider } from '../components/ui/tooltip'
import { TeachingTipProvider } from '../components/shared/teachingTip/TeachingTipProvider'
import { TeachingTipOverlay } from '../components/shared/teachingTip/TeachingTipOverlay'
/**
 * Main layout component for the application
 */
export function MainLayout() {
  return (
    <SecurityProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <TeachingTipProvider>
            <ErrorBoundary>
              <div className="h-screen overflow-auto pb-16">
                <Suspense
                  fallback={<PageLoadingFallback text="Loading page..." />}
                >
                  <Outlet />
                </Suspense>
                <Suspense fallback={null}>
                  <BottomNavigation />
                </Suspense>
              </div>
              <TeachingTipOverlay />
            </ErrorBoundary>
          </TeachingTipProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </SecurityProvider>
  )
}
