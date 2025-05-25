import { useState, useEffect } from 'react'
import { Button } from '@/presentation/components/ui/button'

interface PWADebugInfo {
  isSecure?: boolean
  serviceWorkerSupported?: boolean
  manifestPresent?: boolean
  isStandalone?: boolean
  userAgent?: string
  serviceWorkerRegistrations?: number
  serviceWorkerActive?: boolean
  serviceWorkerState?: string
  serviceWorkerError?: string
  manifestValid?: boolean
  manifestName?: string
  manifestStartUrl?: string
  manifestDisplay?: string
  manifestError?: string
}

export const PWADebug = () => {
  const [debugInfo, setDebugInfo] = useState<PWADebugInfo>({})
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ])
  }

  useEffect(() => {
    const checkPWAStatus = async () => {
      const info: PWADebugInfo = {
        isSecure:
          location.protocol === 'https:' || location.hostname === 'localhost',
        serviceWorkerSupported: 'serviceWorker' in navigator,
        manifestPresent:
          document.querySelector('link[rel="manifest"]') !== null,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent,
      }

      // Check service worker registration
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations()
          info.serviceWorkerRegistrations = registrations.length
          info.serviceWorkerActive = navigator.serviceWorker.controller !== null

          if (registrations.length > 0) {
            info.serviceWorkerState =
              registrations[0].active?.state ?? 'unknown'
          }
        } catch (error) {
          info.serviceWorkerError =
            error instanceof Error ? error.message : String(error)
        }
      }

      // Check manifest
      try {
        const manifestLink = document.querySelector(
          'link[rel="manifest"]'
        ) as HTMLLinkElement
        if (manifestLink) {
          const response = await fetch(manifestLink.href)
          const manifest = await response.json()
          info.manifestValid = true
          info.manifestName = manifest.name
          info.manifestStartUrl = manifest.start_url
          info.manifestDisplay = manifest.display
        }
      } catch (error) {
        info.manifestError =
          error instanceof Error ? error.message : String(error)
      }

      setDebugInfo(info)
      addLog('PWA status checked')
    }

    checkPWAStatus()

    // Listen for PWA events
    const handleBeforeInstallPrompt = (e: Event) => {
      addLog('beforeinstallprompt event fired!')
      e.preventDefault()
    }

    const handleAppInstalled = () => {
      addLog('appinstalled event fired!')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const triggerInstallCheck = () => {
    addLog('Manually checking install criteria...')

    // Force a service worker update check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update()
          addLog(`Updated service worker: ${registration.scope}`)
        })
      })
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="fixed right-4 bottom-4 max-w-md rounded-lg border bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold">PWA Debug</h3>
        <div className="space-x-2">
          <Button size="sm" onClick={triggerInstallCheck}>
            Check
          </Button>
          <Button size="sm" variant="outline" onClick={clearLogs}>
            Clear
          </Button>
        </div>
      </div>

      <div className="mb-3 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <span>Secure: {debugInfo.isSecure ? '✅' : '❌'}</span>
          <span>SW: {debugInfo.serviceWorkerSupported ? '✅' : '❌'}</span>
          <span>Manifest: {debugInfo.manifestPresent ? '✅' : '❌'}</span>
          <span>Active SW: {debugInfo.serviceWorkerActive ? '✅' : '❌'}</span>
        </div>
        {debugInfo.serviceWorkerRegistrations && (
          <div>SW Regs: {debugInfo.serviceWorkerRegistrations}</div>
        )}
        {debugInfo.manifestName && <div>App: {debugInfo.manifestName}</div>}
      </div>

      <div className="max-h-32 overflow-y-auto text-xs">
        <div className="font-medium">Event Log:</div>
        {logs.length === 0 ? (
          <div className="text-gray-500">No events yet...</div>
        ) : (
          logs.slice(-5).map((log) => (
            <div key={log} className="text-gray-700">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
