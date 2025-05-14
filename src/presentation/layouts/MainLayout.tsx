"use client"

import { Suspense } from "react"
import { Outlet } from "react-router"
import { BottomNavigation } from "../components/features/navigation/BottomNavigation"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/infrastructure/services/queryClientService"


/**
 * Main layout component for the application
 */
export function MainLayout() {
  return (
    <div className="min-h-screen pb-16">
      <QueryClientProvider client={queryClient}>

        <Suspense fallback={
          <div className="min-h-screen flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
        <Suspense fallback={null}>
          <BottomNavigation />
        </Suspense>
      </QueryClientProvider>
    </div>
  )
}