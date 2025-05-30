import { useTranslation } from 'react-i18next'

export function AppFeaturesSection({
  features,
  getIcon,
  getBadge,
  getText,
}: {
  features: Array<{ name: string; status: string; description: string }>
  getIcon: (status: string) => React.ReactNode
  getBadge: (status: string) => string
  getText: (status: string) => string
}) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <h3 className="flex items-center space-x-2 text-lg font-semibold">
        <span>{t('features.title', 'App Features')}</span>
      </h3>
      <div className="space-y-2">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="bg-card flex items-center justify-between rounded-lg p-3"
          >
            <div className="flex items-center space-x-2">
              {getIcon(feature.status)}
              <div>
                <span className="text-sm font-medium">
                  {t(`features.${feature.name}.name`, feature.name)}
                </span>
                <p className="text-text-foreground text-xs">
                  {t(
                    `features.${feature.name}.description`,
                    feature.description
                  )}
                </p>
              </div>
            </div>
            <span className={getBadge(feature.status)}>
              {getText(feature.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
