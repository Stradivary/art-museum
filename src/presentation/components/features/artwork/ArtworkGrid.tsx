"use client";

import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useArtworkListViewModel, useArtworkSearchViewModel } from "../../../viewmodels/ArtworkViewModel";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkCardSkeleton } from "./ArtworkCardSkeleton";

interface ArtworkGridProps {
  searchQuery: string;
}

/**
 * Grid component to display artworks with infinite scrolling or search results
 */
export function ArtworkGrid({ searchQuery }: ArtworkGridProps) {
  // Get view models for list and search functionality
  const {
    artworks: listArtworks,
    isLoading: listLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ref
  } = useArtworkListViewModel();

  const {
    searchResults,
    isLoading: searchLoading,
    isEmpty,
    isSearching
  } = useArtworkSearchViewModel(searchQuery);

  // Determine which data to use based on search query
  const artworks = isSearching ? searchResults : listArtworks;
  const isLoading = isSearching ? searchLoading : listLoading;

  // Always show skeletons during initial load
  if (isLoading && artworks.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <ArtworkCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty || !artworks?.length) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-center py-10 rounded-lg border border-dashed p-8"
      >
        <ImageOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No artworks found.</p>
        {isSearching && <p className="text-gray-500 mt-2">Try a different search term.</p>}
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {artworks.map((artwork, index) => (
          <motion.div
            key={'art-' + artwork.id + artwork.image_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ArtworkCard artwork={artwork} index={index} />
          </motion.div>
        ))}
      </div>

      {!isSearching && hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          ) : (
            <Button onClick={() => fetchNextPage()} variant="outline" className="bg-white hover:bg-gray-50">
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
}