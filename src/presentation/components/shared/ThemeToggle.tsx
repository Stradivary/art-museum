import { useTheme } from '../../hooks/useTheme'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '../ui/button'
import { usePreference } from '@/presentation/hooks/usePreference'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { updatePreference } = usePreference()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const handleToggleTheme = () => {
    toggleTheme()
    updatePreference({ theme: theme === 'dark' ? 'light' : 'dark' })
  }
  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={handleToggleTheme}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
