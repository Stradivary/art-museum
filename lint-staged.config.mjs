/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.css': ['stylelint --fix', 'prettier --write'],
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '!(*.css|*.ts|*.tsx)': ['prettier --write'],
}
