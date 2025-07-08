import { Button } from '@/presentation/components/ui/button'
import { useTranslation } from 'react-i18next'

export function ClearPreferenceSection({
  onClear,
  loading,
}: {
  onClear: () => void
  loading: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-sm">
        {t('settings.clearPreferences', 'Clear Preferences')}
      </span>
      <Button variant="destructive" size="sm" onClick={onClear}>
        {loading
          ? t('settings.clearing', 'Clearing...')
          : t('settings.clearSaved', 'Clear Saved & Disliked Content')}
      </Button>
    </div>
  )
}
