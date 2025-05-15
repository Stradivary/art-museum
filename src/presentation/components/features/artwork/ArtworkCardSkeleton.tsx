import { Skeleton } from '@/presentation/components/ui/skeleton'

/**
 * Skeleton loader for the artwork card
 */
export function ArtworkCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}
