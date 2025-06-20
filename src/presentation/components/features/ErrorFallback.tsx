import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '../ui/button'

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: Readonly<{
  error?: Error
  resetErrorBoundary?: () => void
}>) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="bg-card w-full max-w-md rounded-xl p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-200/50 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-foreground mb-4 text-2xl font-bold">
          Oops! Something went wrong
        </h1>

        <p className="mb-6 leading-relaxed text-gray-600">
          {error?.message ??
            'An unexpected error occurred. Please try refreshing the page or go back to the home page.'}
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {resetErrorBoundary && (
            <Button
              onClick={resetErrorBoundary}
              variant="error"
              data-testid="reset-button"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          <Button onClick={() => navigate('/')} variant="secondary">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
