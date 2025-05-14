"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArtworkGrid } from "../artwork/ArtworkGrid"
import { SearchBar } from "../search/SearchBar"
import { useSearchParams } from "react-router"

interface HomePageContentProps {
  initialSearchQuery?: string
}

/**
 * Main content component for the homepage
 */
export function HomePageContent({ initialSearchQuery = "" }: HomePageContentProps) {
  const [searchParams, setSeachParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query)
    setSeachParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (query) {
        newParams.set("q", query)
      } else {
        newParams.delete("q")
      }
      return newParams
    })
  }, [setSeachParams])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <SearchBar initialQuery={searchQuery} onSearch={handleSearchQueryChange} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <ArtworkGrid searchQuery={searchQuery} />
      </motion.div>
    </>
  )
}