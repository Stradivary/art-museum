'use client'

import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { useSavedArtworkViewModel } from '../../../viewmodels/SavedArtworkViewModel'
import { SavedArtworkCard } from './SavedArtworkCard'
import { Link } from 'react-router'
import { useRegisterTeachingTip } from '@/presentation/hooks/useRegisterTeachingTip'

/**
 * Component to display the saved artworks page content
 */
export function SavedPageContent() {
  // Register teaching tip for saved artworks page
  const savedTip = useRegisterTeachingTip<HTMLDivElement>({
    id: 'saved-artworks',
    title: 'Saved Artworks',
    description:
      'View and manage artworks you have saved for later. Remove artworks from your saved list at any time.',
    position: 'top',
  })
  const { savedArtworks, isLoading, removeSavedArtwork } =
    useSavedArtworkViewModel()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center" ref={savedTip.ref}>
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (savedArtworks.length === 0) {
    return (
      <motion.div
        className="rounded-lg border border-dashed p-8 py-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        ref={savedTip.ref}
      >
        <Bookmark className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="mb-4 text-gray-500">No saved artworks yet.</p>
        <Link
          to="/"
          className="rounded-md bg-[#a20000] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#8a0000]"
        >
          Browse the gallery
        </Link>
      </motion.div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
      ref={savedTip.ref}
    >
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
