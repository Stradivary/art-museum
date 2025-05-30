import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

export function OfflineFallback() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="bg-background dark:bg-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-card dark:bg-card border-border dark:border-border w-full max-w-md rounded-xl border p-8 text-center shadow-lg dark:shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
            <WifiOff className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        <h1 className="text-foreground mb-4 text-2xl font-bold">
          {t('offline.title', "You're offline")}
        </h1>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {t(
            'offline.description',
            'Some features or content may not be available while offline. Please check your internet connection and try again.'
          )}
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={handleRefresh} variant="info">
            <RefreshCw className="h-4 w-4" />
            {t('offline.tryAgain', 'Try Again')}
          </Button>

          <Button onClick={() => navigate('/')} variant="secondary">
            <Home className="h-4 w-4" />
            {t('offline.goHome', 'Go Home')}
          </Button>
        </div>

        <div className="text-muted-foreground mt-6 text-sm">
          <p>
            {t(
              'offline.savedContent',
              'You can still browse saved content while offline'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
