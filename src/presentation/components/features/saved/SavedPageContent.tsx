"use client"

import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import { useSavedArtworkViewModel } from "../../../viewmodels/SavedArtworkViewModel"
import { SavedArtworkCard } from "./SavedArtworkCard"
import { Link } from "react-router"

/**
 * Component to display the saved artworks page content
 */
export function SavedPageContent() {
  const { savedArtworks, isLoading, removeSavedArtwork } = useSavedArtworkViewModel()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (savedArtworks.length === 0) {
    return (
      <motion.div
        className="text-center py-10 rounded-lg border border-dashed p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-4">No saved artworks yet.</p>
        <Link
          to="/"
          className="text-white bg-[#a20000] hover:bg-[#8a0000] px-4 py-2 rounded-md transition-colors duration-200"
        >
          Browse the gallery
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {savedArtworks.map((artwork) => (
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SavedArtworkCard
            artwork={artwork}
            onDelete={() => removeSavedArtwork(artwork.id)}
          />
        </motion.div>
      ))}
    </div>
  )
}