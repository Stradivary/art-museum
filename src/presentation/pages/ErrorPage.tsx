import { motion } from 'framer-motion'
import { ErrorFallback } from '../components/features/ErrorFallback'
import { PageHeader } from '../components/shared/PageHeader'

export default function ErrorPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ viewTransitionName: 'error-page' }}
    >
      <PageHeader title="Error" />
      <ErrorFallback />
    </motion.main>
  )
}
