import i18n from '@/i18n'
import { useCallback, useEffect, useState } from 'react'
import type { Preference } from '@/infrastructure/repositories/PreferenceRepository'
import { preferenceService } from '@/core/application/services/PreferenceService'
export function usePreference() {
  const [preference, setPreference] = useState<Preference | null>({
    theme: 'light',
    language: 'en',
    showTeachingTips: true,
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (typeof window === 'undefined') return
    preferenceService.getPreference().then((pref) => {
      setPreference(
        pref ?? {
          theme: 'light',
          language: 'en',
          showTeachingTips: true,
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
        showTeachingTips:
          update.showTeachingTips ?? preference?.showTeachingTips ?? true,
      }
      setPreference(newPref)
      await preferenceService.setPreference(newPref)
      // Always update language and theme after preference change
      if (update.language) i18n.changeLanguage(update.language)
      if (update.theme && typeof window !== 'undefined') {
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
