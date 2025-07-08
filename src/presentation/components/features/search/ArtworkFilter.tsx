'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { Select } from '@/presentation/components/ui/select'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/presentation/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip'
import type { ArtworkFilters } from '@/core/application/interfaces/IArtworkRepository'
import { useTranslation } from 'react-i18next'

interface ArtworkFilterProps {
  filters: ArtworkFilters
  onFiltersChange: (filters: ArtworkFilters) => void
}

// Common filter options based on Art Institute of Chicago data
const DEPARTMENT_OPTIONS = [
  'American Art',
  'Contemporary Art',
  'European Painting and Sculpture',
  'Asian Art',
  'Modern Art',
  'Arts of Africa',
  'Photography and Media',
  'Prints and Drawings',
  'Textiles',
  'Ancient Art',
]

const ARTWORK_TYPE_OPTIONS = [
  'Painting',
  'Sculpture',
  'Drawing',
  'Print',
  'Photograph',
  'Textile',
  'Ceramic',
  'Vessel',
  'Furniture',
  'Jewelry',
]

const PLACE_OF_ORIGIN_OPTIONS = [
  'United States',
  'France',
  'Italy',
  'Germany',
  'China',
  'Japan',
  'United Kingdom',
  'Spain',
  'Netherlands',
  'Greece',
]

const MEDIUM_OPTIONS = [
  'Oil on canvas',
  'Bronze',
  'Marble',
  'Watercolor',
  'Ink on paper',
  'Gelatin silver print',
  'Ceramic',
  'Wood',
  'Gold',
  'Glass',
]

/**
 * Filter component for artwork filtering
 */
export function ArtworkFilter({
  filters,
  onFiltersChange,
}: Readonly<ArtworkFilterProps>) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  )

  const handleFilterChange = (key: keyof ArtworkFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    }
    // Use utility to clean filters
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
    setIsExpanded(false)
  }

  const getFilterSummary = () => {
    const activeFilters = Object.entries(filters).filter(([, value]) => value)
    if (activeFilters.length === 0)
      return t(
        'filter.summary',
        'Browse and filter artworks by department, type, origin, and medium'
      )

    return activeFilters
      .map(([key, value]) => {
        switch (key) {
          case 'department':
            return t('filter.department', 'Department') + ': ' + value
          case 'artworkType':
            return t('filter.artworkType', 'Type') + ': ' + value
          case 'placeOfOrigin':
            return t('filter.placeOfOrigin', 'Origin') + ': ' + value
          case 'medium':
            return t('filter.medium', 'Medium') + ': ' + value
          default:
            return key + ': ' + value
        }
      })
      .join(' • ')
  }

  return (
    <Popover open={isExpanded} onOpenChange={setIsExpanded}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground h-12 w-42 cursor-pointer rounded-full transition-all duration-200 ${
                hasActiveFilters
                  ? 'border-primary text-primary shadow-sm'
                  : 'border-gray-200'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('filter.filters', 'Filters')}
              {hasActiveFilters && (
                <Badge
                  variant="destructive"
                  className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {Object.values(filters).filter((v) => v).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>{getFilterSummary()}</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 p-0" align="end">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1 }}
          className="p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-foreground font-semibold">
              {t('filter.title', 'Filter Artworks')}
            </h3>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                {t('filter.clearAll', 'Clear All')}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Select
                label={t('filter.department', 'Department')}
                value={filters.department || ''}
                onChange={(e) =>
                  handleFilterChange('department', e.target.value)
                }
                className="w-full"
              >
                <option value="">
                  {t('filter.allDepartments', 'All Departments')}
                </option>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                label={t('filter.artworkType', 'Artwork Type')}
                value={filters.artworkType || ''}
                onChange={(e) =>
                  handleFilterChange('artworkType', e.target.value)
                }
                className="w-full"
              >
                <option value="">
                  {t('filter.allArtworkTypes', 'All Artwork Types')}
                </option>
                {ARTWORK_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                label={t('filter.placeOfOrigin', 'Place of Origin')}
                value={filters.placeOfOrigin || ''}
                onChange={(e) =>
                  handleFilterChange('placeOfOrigin', e.target.value)
                }
                className="w-full"
              >
                <option value="">
                  {t('filter.allPlacesOfOrigin', 'All Places of Origin')}
                </option>
                {PLACE_OF_ORIGIN_OPTIONS.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                label={t('filter.medium', 'Medium')}
                value={filters.medium || ''}
                onChange={(e) => handleFilterChange('medium', e.target.value)}
                className="w-full"
              >
                <option value="">
                  {t('filter.allMediums', 'All Mediums')}
                </option>
                {MEDIUM_OPTIONS.map((medium) => (
                  <option key={medium} value={medium}>
                    {medium}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex flex-wrap gap-1">
                {Object.entries(filters)
                  .filter(([, value]) => value)
                  .map(([key, value]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="cursor-pointer text-xs hover:bg-red-100 hover:text-red-700"
                      onClick={() =>
                        handleFilterChange(key as keyof ArtworkFilters, '')
                      }
                    >
                      {value}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}
