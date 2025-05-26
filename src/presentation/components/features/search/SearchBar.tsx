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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mb-2"
    >
      <div className="relative overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm transition-all duration-200 focus-within:border-[#a20000] focus-within:shadow-md hover:shadow-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-3 w-3 text-gray-400 transition-colors duration-200" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full bg-transparent p-3 pr-10 pl-10 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none"
          placeholder="Search for artworks, artists, movements..."
          data-testid="search-query"
          aria-label="Search"
        />
        {query && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
