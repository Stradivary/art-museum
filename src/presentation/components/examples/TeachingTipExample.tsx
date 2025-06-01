'use client'

import { TeachingTipTrigger } from '@/presentation/components/shared/teachingTip/TeachingTipTrigger'
import { Button } from '@/presentation/components/ui/button'
import { useRegisterTeachingTip } from '@/presentation/hooks/useRegisterTeachingTip'
import { Download, Heart, Search, Share } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

/**
 * Example component demonstrating how to use the Teaching Tip system
 */
export function TeachingTipExample() {
  // Register multiple teaching tips
  const searchTip = useRegisterTeachingTip({
    id: 'search-feature',
    title: 'Search Artworks',
    description:
      'Use the search bar to find specific artworks by title, artist, or keywords. Try searching for your favorite art style!',
    position: 'bottom',
  })

  const saveTip = useRegisterTeachingTip({
    id: 'save-feature',
    title: 'Save Your Favorites',
    description:
      'Click the heart icon to save artworks to your personal collection. You can view them later in the Saved page.',
    position: 'top',
  })

  const shareTip = useRegisterTeachingTip({
    id: 'share-feature',
    title: 'Share Artworks',
    description:
      'Share beautiful artworks with friends using the share button. Spread the love for art!',
    position: 'left',
  })

  const downloadTip = useRegisterTeachingTip({
    id: 'download-feature',
    title: 'Download Images',
    description:
      'Download high-quality images for offline viewing. Perfect for using as wallpapers or reference.',
    position: 'right',
  })

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Teaching Tips Demo
            <TeachingTipTrigger variant="button" showAll size="sm">
              Start Tutorial
            </TeachingTipTrigger>
          </CardTitle>
          <CardDescription>
            This demonstrates the teaching tip system. Click "Start Tutorial" to
            see it in action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Feature */}
          <div className="flex items-center gap-4">
            <div
              ref={searchTip.ref as React.RefObject<HTMLDivElement>}
              className="bg-muted/50 flex items-center gap-2 rounded-lg border p-3"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search artworks...</span>
            </div>
            <TeachingTipTrigger
              variant="icon"
              tipId="search-feature"
              className="h-6 w-6"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              ref={saveTip.ref as React.RefObject<HTMLButtonElement>}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Save
            </Button>

            <Button
              ref={shareTip.ref as React.RefObject<HTMLButtonElement>}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>

            <Button
              ref={downloadTip.ref as React.RefObject<HTMLButtonElement>}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>

          {/* Individual tip triggers */}
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <TeachingTipTrigger variant="link" tipId="search-feature">
              Show search tip
            </TeachingTipTrigger>
            <TeachingTipTrigger variant="link" tipId="save-feature">
              Show save tip
            </TeachingTipTrigger>
            <TeachingTipTrigger variant="link" tipId="share-feature">
              Show share tip
            </TeachingTipTrigger>
            <TeachingTipTrigger variant="link" tipId="download-feature">
              Show download tip
            </TeachingTipTrigger>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
