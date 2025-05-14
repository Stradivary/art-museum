"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/presentation/hooks/useDebounce";
import { useNavigate } from "react-router";

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

/**
 * Search bar component for searching artworks
 */
export function SearchBar({ initialQuery = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  // Update the URL when the search query changes
  useEffect(() => {
    onSearch(debouncedQuery);

    // Update URL with query parameter
    if (debouncedQuery) {
      navigate(`/?q=${encodeURIComponent(debouncedQuery)}`);
    } else {
      navigate("/",);
    }
  }, [debouncedQuery, onSearch]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="relative mb-6">
      <div className="relative rounded-full border overflow-hidden">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 pl-12 pr-10 bg-white text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-[#a20000]"
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
  );
}