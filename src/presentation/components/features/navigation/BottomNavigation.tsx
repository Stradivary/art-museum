'use client'

import { Link, useLocation } from 'react-router'
import { Home, Bookmark, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * Bottom navigation bar for mobile devices
 */
export function BottomNavigation() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <div className="bg-background text-foreground dark:bg-background dark:text-foreground fixed right-0 bottom-0 left-0 z-10 border-t">
      <div className="mx-auto max-w-7xl">
        <div className="bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground grid grid-cols-3">
          <Link
            to="/"
            className={cn(
              'relative flex flex-col items-center justify-center py-3 transition-colors duration-200',
              pathname === '/'
                ? 'bg-primary/80 text-primary-foreground dark:bg-primary/90'
                : 'hover:bg-primary/70 hover:text-primary-foreground dark:hover:bg-primary/80'
            )}
          >
            <Home className="mb-1" size={20} />
            <span className="text-sm">{t('nav.home', 'Home')}</span>
            {pathname === '/' && (
              <div className="bg-foreground/80 dark:bg-primary-foreground absolute bottom-0 h-1 w-12" />
            )}
          </Link>

          <Link
            to="/saved"
            className={cn(
              'relative flex flex-col items-center justify-center py-3 transition-colors duration-200',
              pathname === '/saved'
                ? 'bg-primary/80 text-primary-foreground dark:bg-primary/90'
                : 'hover:bg-primary/70 hover:text-primary-foreground dark:hover:bg-primary/80'
            )}
          >
            <Bookmark className="mb-1" size={20} />
            <span className="text-sm">{t('nav.saved', 'Saved')}</span>
            {pathname === '/saved' && (
              <div className="bg-foreground/80 dark:bg-primary-foreground absolute bottom-0 h-1 w-12" />
            )}
          </Link>

          <Link
            to="/profile"
            className={cn(
              'relative flex flex-col items-center justify-center py-3 transition-colors duration-200',
              pathname === '/profile'
                ? 'bg-primary/80 text-primary-foreground dark:bg-primary/90'
                : 'hover:bg-primary/70 hover:text-primary-foreground dark:hover:bg-primary/80'
            )}
          >
            <User className="mb-1" size={20} />
            <span className="text-sm">{t('nav.profile', 'Profile')}</span>
            {pathname === '/profile' && (
              <div className="bg-foreground/80 dark:bg-primary-foreground absolute bottom-0 h-1 w-12" />
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
