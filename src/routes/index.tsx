import { createBrowserRouter } from 'react-router'
import { lazy } from 'react'
import { MainLayout } from '../presentation/layouts/MainLayout'

const HomePage = lazy(() => import('../presentation/pages/HomePage'))
const SavedPage = lazy(() => import('../presentation/pages/SavedPage'))
const ArtworkDetailPage = lazy(
  () => import('../presentation/pages/ArtworkDetailPage')
)
const ProfilePage = lazy(() => import('../presentation/pages/ProfilePage'))
const ErrorPage = lazy(() => import('../presentation/pages/ErrorPage'))
const OfflinePage = lazy(() => import('../presentation/pages/OfflinePage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'saved',
        element: <SavedPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'artwork/:id',
        element: <ArtworkDetailPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'offline',
        element: <OfflinePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
])
