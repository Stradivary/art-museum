import i18n from '@/i18n'
import { useCallback, useEffect, useState } from 'react'
import type { Preference } from '@/infrastructure/repositories/PreferenceRepository'
import { PreferenceService } from '@/core/application/services/PreferenceService'

// Remove useMemo for service, use a module-level singleton instead
const service = new PreferenceService()

export function usePreference() {
  const [preference, setPreference] = useState<Preference | null>({
    theme: 'light',
    language: 'en',
    notifications: false,
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (typeof window === 'undefined') return
    service.getPreference().then((pref) => {
      setPreference(
        pref ?? {
          theme: 'light',
          language: 'en',
          notifications: false,
        }
      )
      setLoading(false)
      if (pref?.language) i18n.changeLanguage(pref.language)
    })
  }, [])

  const updatePreference = useCallback(
    async (update: Partial<Preference>) => {
      if (typeof window === 'undefined') return
      const newPref: Preference = {
        theme: update.theme ?? preference?.theme ?? 'light',
        language: update.language ?? preference?.language ?? 'en',
        notifications:
          update.notifications ?? preference?.notifications ?? false,
      }
      setPreference(newPref)
      await service.setPreference(newPref)
      // Always update language and theme after preference change
      if (update.language) i18n.changeLanguage(update.language)
      if (update.theme) {
        if (update.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    [preference]
  )

  return { preference, updatePreference, loading }
}
