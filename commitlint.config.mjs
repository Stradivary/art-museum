/** @type {import("@commitlint/types").UserConfig } */
const Configuration = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  defaultIgnores: true,
  rules: {
    'scope-max-length': [2, 'always', 50],
  },
}

export default Configuration
