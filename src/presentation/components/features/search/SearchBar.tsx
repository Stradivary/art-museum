'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/presentation/hooks/useDebounce'
import { useNavigate } from 'react-router'

interface SearchBarProps {
  initialQuery?: string
  onSearch: (query: string) => void
}

/**
 * Search bar component for searching artworks
 */
export function SearchBar({
  initialQuery = '',
  onSearch,
}: Readonly<SearchBarProps>) {
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()

  // Update the URL when the search query changes
  useEffect(() => {
    onSearch(debouncedQuery)

    // Update URL with query parameter
    if (debouncedQuery) {
      navigate(`/?q=${encodeURIComponent(debouncedQuery)}`)
    } else {
      navigate('/')
    }
  }, [debouncedQuery, onSearch, navigate])

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className="relative mb-6">
      <div className="relative overflow-hidden rounded-full border">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full bg-white p-4 pr-10 pl-12 text-gray-900 focus:ring-2 focus:ring-[#a20000] focus:outline-none"
          placeholder="Search for artworks, artists, etc."
          aria-label="Search"
        />
        {query && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-gray-400" />
          </motion.button>
        )}
      </div>
    </div>
  )
}
