/* eslint-disable sonarjs/cognitive-complexity */
import { useEffect } from 'react'

// Helper to prevent PrintScreen (not foolproof)
export function usePreventScreenshot() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Block PrintScreen key
      if (e.key === 'PrintScreen' || e.key === 'PrtScn') {
        e.preventDefault()
        // Optionally, clear clipboard (not always possible)
        if (navigator.clipboard) {
          navigator.clipboard.writeText('Screenshots are disabled.')
        }
      }
      // Block Alt+PrintScreen (Windows)
      if (e.altKey && (e.key === 'PrintScreen' || e.key === 'PrtScn')) {
        e.preventDefault()
      }

      // Block Cmd+Shift+4 (Mac screenshot)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === '4') {
        e.preventDefault()
      }
      // Block Cmd+Shift+3 (Mac full screenshot)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === '3') {
        e.preventDefault()
      }
      // Block Ctrl+Shift+4 (Windows screenshot)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === '4') {
        e.preventDefault()
      }
      // Block Windows+PrintScreen (full screenshot)
      if (e.key === 'PrintScreen' && e.ctrlKey && e.altKey) {
        e.preventDefault()
      }

      // Block Ctrl+S (save page)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
      }

      // Block Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault()
      }

      // Block Ctrl+Shift+I (dev tools)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === 'i'
      ) {
        e.preventDefault()
      }

      // Block F12 (dev tools)
      if (e.key === 'F12') {
        e.preventDefault()
      }

      // Block Win+Ctrl+Shift+S Snipping Tool
      if (e.key === 'PrintScreen' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
      }

      // Block Ctrl+P (print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
