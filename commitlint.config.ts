import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  defaultIgnores: true,
  rules: {
    'scope-max-length': [RuleConfigSeverity.Error, 'always', 50],
  },
}

export default Configuration
