import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Minimal resources for test
const resources = {
  en: {
    translation: {
      // LikeButton
      'likeButton.saveAria': 'Save artwork',
      'likeButton.removeAria': 'Remove from saved artworks',
      'likeButton.save': 'Save',
      'likeButton.saving': 'Saving...',
      'likeButton.removing': 'Removing...',
      'likeButton.saved': 'Saved',
      // SearchBar
      'search.placeholder': 'Search for artworks, artists, movements...',
      'search.aria': 'Search',
      'search.clear': 'Clear search',
      // BottomNavigation
      'nav.home': 'Home',
      'nav.saved': 'Saved',
      'nav.profile': 'Profile',
    },
  },
  id: { translation: {} },
}

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  interpolation: { escapeValue: false },
})

export default i18n
