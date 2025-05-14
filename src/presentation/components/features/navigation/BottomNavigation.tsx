"use client"

import { Link, useLocation } from "react-router"
import { Home, Bookmark, User } from "lucide-react"

/**
 * Bottom navigation bar for mobile devices
 */
export function BottomNavigation() {
  const { pathname } = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-3 bg-[#a20000] text-white">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-3 transition-colors duration-200 ${
              pathname === "/" ? "bg-[#8a0000]" : "hover:bg-[#8a0000]"
            }`}
          >
            <Home className="mb-1" size={20} />
            <span className="text-sm">Home</span>
            {pathname === "/" && <div className="absolute bottom-0 h-1 w-12 bg-white" />}
          </Link>

          <Link
            to="/saved"
            className={`flex flex-col items-center justify-center py-3 transition-colors duration-200 ${
              pathname === "/saved" ? "bg-[#8a0000]" : "hover:bg-[#8a0000]"
            }`}
          >
            <Bookmark className="mb-1" size={20} />
            <span className="text-sm">Saved</span>
            {pathname === "/saved" && <div className="absolute bottom-0 h-1 w-12 bg-white" />}
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center py-3 transition-colors duration-200 ${
              pathname === "/profile" ? "bg-[#8a0000]" : "hover:bg-[#8a0000]"
            }`}
          >
            <User className="mb-1" size={20} />
            <span className="text-sm">Profile</span>
            {pathname === "/profile" && <div className="absolute bottom-0 h-1 w-12 bg-white" />}
          </Link>
        </div>
      </div>
    </div>
  )
}