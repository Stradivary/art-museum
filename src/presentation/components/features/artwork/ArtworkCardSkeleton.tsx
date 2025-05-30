import { Skeleton } from '@/presentation/components/ui/skeleton'

/**
 * Skeleton loader for the artwork card
 */
export function ArtworkCardSkeleton() {
  return (
    <div className="bg-card h-full overflow-hidden rounded-lg shadow-sm">
      <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
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
