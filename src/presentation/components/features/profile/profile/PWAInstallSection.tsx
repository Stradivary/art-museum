import { Button } from '@/presentation/components/ui/button'
import { Download, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function PWAInstallSection({
  isInstalled,
  isInstalling,
  canInstall,
  installationMessage,
  onInstall,
}: {
  isInstalled: boolean
  isInstalling: boolean
  canInstall: boolean
  installationMessage: string
  onInstall: () => void
}) {
  const { t } = useTranslation()
  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 rounded bg-green-50/80 px-3 py-2 text-xs text-green-800">
        <Smartphone size={16} />
        <span>{t('pwa.installed', 'App Installed')}</span>
      </div>
    )
  }
  return (
    <div className="border-border flex items-center justify-between gap-2 rounded border border-dashed px-6 py-4 text-xs">
      <div className="flex items-center gap-2">
        <Smartphone size={16} className="text-gray-400" />
        <span>{installationMessage}</span>
      </div>
      <Button
        onClick={onInstall}
        disabled={isInstalling || !canInstall}
        size="sm"
        className="h-7 bg-[#a20000] px-2 py-1 text-xs hover:bg-[#8a0000] disabled:opacity-50"
      >
        <Download className="mr-1 h-3 w-3" />
        {isInstalling
          ? t('pwa.installing', 'Installing...')
          : t('pwa.install', 'Install')}
      </Button>
    </div>
  )
}
