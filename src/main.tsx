import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import './i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { ThemeProvider } from './presentation/components/shared/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>
)
