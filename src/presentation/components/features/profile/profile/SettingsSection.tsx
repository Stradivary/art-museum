import { Select } from '@/presentation/components/ui/select'
import { Switch } from '@/presentation/components/ui/switch'
import { useTranslation } from 'react-i18next'

import { usePreference } from '@/presentation/hooks/usePreference'
import { useTheme } from '@/presentation/hooks/useTheme'

export function SettingsSection() {
  const { t } = useTranslation()
  const { preference, updatePreference, loading } = usePreference()
  const { setTheme } = useTheme()
  if (loading) return null
  // fallback to default preference if not set
  const pref = preference ?? {
    theme: 'light',
    language: 'en',
    notifications: false,
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('settings.darkMode', 'Dark Mode')}</span>
        <Switch
          checked={pref.theme === 'dark'}
          onCheckedChange={(checked) => {
            const theme = checked ? 'dark' : 'light'
            setTheme(theme)
            updatePreference({ theme })
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('settings.language', 'Language')}</span>
        <Select
          value={pref.language}
          onChange={(e) => updatePreference({ language: e.target.value })}
          className="w-28"
        >
          <option value="en">{t('settings.english', 'English')}</option>
          <option value="id">{t('settings.bahasa', 'Bahasa Indonesia')}</option>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {t('settings.notifications', 'Notifications')}
        </span>
        <Switch
          checked={pref.notifications}
          onCheckedChange={(checked) =>
            updatePreference({ notifications: checked })
          }
        />
      </div>
    </div>
  )
}
