import { Select } from '@/presentation/components/ui/select'
import { Switch } from '@/presentation/components/ui/switch'
import { useTranslation } from 'react-i18next'

import { usePreference } from '@/presentation/hooks/usePreference'
import { useTheme } from '@/presentation/hooks/useTheme'
import { TeachingTipTrackingService } from '@/infrastructure/services/TeachingTipTrackingService'
import { ThemeToggle } from '@/presentation/components/shared/ThemeToggle'

export function SettingsSection() {
  const { t } = useTranslation()
  const { preference, updatePreference, loading } = usePreference()
  const { setTheme } = useTheme()

  if (loading) return null

  // fallback to default preference if not set
  const pref = preference ?? {
    theme: 'light',
    language: 'en',
    showTeachingTips: true,
  }

  const handleResetTeachingTips = () => {
    TeachingTipTrackingService.resetAllTips()
    // Optionally show a confirmation message
    alert(
      t(
        'settings.teachingTipsReset',
        'All teaching tips have been reset and will show again.'
      )
    )
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('settings.darkMode', 'Dark Mode')}</span>

        <ThemeToggle />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('settings.language', 'Language')}</span>
        <Select
          value={pref.language}
          onChange={(e) => updatePreference({ language: e.target.value })}
          className="w-38"
        >
          <option value="en">{t('settings.english', 'English')}</option>
          <option value="id">{t('settings.bahasa', 'Bahasa Indonesia')}</option>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {t('settings.showTeachingTips', 'Show Teaching Tips')}
        </span>
        <Switch
          checked={pref.showTeachingTips}
          onCheckedChange={(checked) =>
            updatePreference({ showTeachingTips: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {t('settings.resetTeachingTips', 'Reset Teaching Tips')}
        </span>
        <button
          onClick={handleResetTeachingTips}
          className="rounded bg-gray-200 px-3 py-1 text-xs transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {t('settings.reset', 'Reset')}
        </button>
      </div>
    </div>
  )
}
