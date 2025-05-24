import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '../ui/button'

export function OfflineFallback() {
  const navigate = useNavigate()

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <WifiOff className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          You're offline
        </h1>

        <p className="mb-6 leading-relaxed text-gray-600">
          Some features or content may not be available while offline. Please
          check your internet connection and try again.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={handleRefresh} variant="info">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Button onClick={() => navigate('/')} variant="secondary">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>You can still browse saved content while offline</p>
        </div>
      </div>
    </div>
  )
}
