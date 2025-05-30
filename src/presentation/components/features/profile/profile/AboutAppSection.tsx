import { useTranslation } from 'react-i18next'

export function AboutAppSection({ isInstalled }: { isInstalled: boolean }) {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
      <span className="mb-1 block font-semibold text-blue-900">
        {t('about.title', 'About This App')}
      </span>
      <span>
        {t(
          'about.description',
          'This is a Progressive Web App (PWA) that provides enhanced functionality when installed. Features like offline browsing and image caching are automatically enabled when you install the app.'
        )}
        {isInstalled
          ? t(
              'about.installed',
              ' Your app is currently installed and all PWA features are active.'
            )
          : t(
              'about.notInstalled',
              ' Install the app to unlock offline capabilities and enhanced performance.'
            )}
      </span>
    </div>
  )
}
