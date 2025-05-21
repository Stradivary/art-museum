'use client'

import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { BottomNavigation } from '../components/features/navigation/BottomNavigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/infrastructure/services/queryClientService'
import { SecurityProvider } from '../components/shared/SecurityProvider'

/**
 * Main layout component for the application
 */
export function MainLayout() {
  return (
    <SecurityProvider>
      <div className="min-h-screen pb-16">
        <QueryClientProvider client={queryClient}>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
          <Suspense fallback={null}>
            <BottomNavigation />
          </Suspense>
        </QueryClientProvider>
      </div>
    </SecurityProvider>
  )
}
