'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Heart, ChevronRight, Info } from 'lucide-react'
import { ArtworkCard } from '../artwork/ArtworkCard'
import { ArtworkCardSkeleton } from '../artwork/ArtworkCardSkeleton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/presentation/components/ui/carousel'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/presentation/components/ui/hover-card'
import { Badge } from '@/presentation/components/ui/badge'
import type { RecommendationResult } from '@/core/application/usecases/artwork/GetRecommendationsUseCase'
import { Button } from '../../ui/button'
import { useTranslation } from 'react-i18next'

interface RecommendationsProps {
  recommendations: RecommendationResult | null | undefined
  isLoading: boolean
  error?: Error | null
}

/**
 * Component to display personalized artwork recommendations
 */
export function Recommendations({
  recommendations,
  isLoading,
  error,
}: Readonly<RecommendationsProps>) {
  const { t } = useTranslation()
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#a20000]" />
          <h2 className="text-foreground text-xl font-semibold">
            {t('recommendations.title', 'Recommended for You')}
          </h2>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {Array.from({ length: 6 }, (_, i) => (
              <CarouselItem
                key={`rec-skeleton-${i}`}
                className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6"
              >
                <ArtworkCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4"
      >
        <p className="text-red-600">
          {t(
            'recommendations.error',
            'Failed to load recommendations. Please try again later.'
          )}
        </p>
      </motion.div>
    )
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 rounded-lg border bg-gradient-to-r from-card to-background p-6"
      >
        <div className="mb-3 flex items-center gap-3">
          <Heart className="h-5 w-5 text-[#a20000]" />
          <h2 className="text-foreground text-xl font-semibold">
            {t('recommendations.discover', 'Discover Your Taste')}
          </h2>
        </div>
        <p className="mb-4 text-gray-600">
          {t(
            'recommendations.saveSome',
            'Save some artworks you love to get personalized recommendations!'
          )}
        </p>
        <div className="text-foreground0 flex items-center text-sm">
          <span>
            💡{' '}
            {t(
              'recommendations.tip',
              'Tip: Click the heart icon on any artwork to save it'
            )}
          </span>
        </div>
      </motion.div>
    )
  }

  const { recommendations: artworks, summary } = recommendations

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      {/* Simplified Header */}
      <div className="mb-6 flex items-center gap-3">
        <Lightbulb className="h-5 w-5 text-[#a20000]" />
        <h2 className="text-foreground text-xl font-semibold">
          {t('recommendations.title', 'Recommended for You')}
        </h2>
        <Badge variant="secondary" className="text-xs">
          {summary.totalRecommendations}
        </Badge>

        {/* Consolidated hover card with recommendations info */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <Info className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-96" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="text-foreground mb-2 font-semibold">
                  {t('recommendations.howTitle', 'How recommendations work')}
                </h4>
                <p className="mb-3 text-sm text-gray-600">
                  {t(
                    'recommendations.howDesc',
                    'Our recommendation engine analyzes your saved artworks to identify patterns in departments, artwork types, geographic origins, and artistic mediums.'
                  )}
                </p>
              </div>

              <div>
                <h5 className="text-foreground mb-2 font-medium">
                  {t('recommendations.whyTitle', 'Why these recommendations?')}
                </h5>
                <ul className="space-y-1">
                  {summary.reasons.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <ChevronRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#a20000]" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Recommendations carousel */}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {artworks.map((artwork, index) => (
            <CarouselItem
              key={`rec-${artwork.id}`}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {artworks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="text-foreground inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a20000]/20 to-[#a20000]/15 px-4 py-2 text-sm">
            <Heart className="h-4 w-4 text-[#a20000]" />
            {t(
              'recommendations.likeMore',
              'Like what you see? Save more artworks to improve your recommendations!'
            )}
          </div>
        </motion.div>
      )}

      {/* Visual separator */}
      <div className="mt-12 mb-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background text-foreground px-4">
              {t('recommendations.browseAll', 'Browse All Artworks')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
