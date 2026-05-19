import preset from './src'

export default preset({
  typescript: true,
  jsonc: true,
  yaml: true,
  comments: true,
})
  .prepend({
    ignores: ['**/coverage/**', '.claude/**'],
  })
  .override('suressk/typescript/rules', {
    rules: {
      'ts/explicit-module-boundary-types': 'off',
    },
  })
  .append({
    files: ['**/*.d.ts'],
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
  .append({
    files: ['scripts/**', 'test/**'],
    rules: {
      'no-console': 'off',
    },
  })
  .append({
    files: ['src/configs/**'],
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
  .append({
    files: ['src/utils.ts'],
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
