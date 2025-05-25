import { type Configuration } from "lint-staged"
const config: Configuration = {
  '*.css': ['stylelint --fix', 'prettier --write'],
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '!(*.css|*.ts|*.tsx)': ['prettier --write'],
}

export default config
