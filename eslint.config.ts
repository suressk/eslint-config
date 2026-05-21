import lintPreset from './src'

export default lintPreset({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  typescript: true,
  jsonc: true,
  yaml: true,
  toml: true,
  markdown: true,
  test: false,
  formatters: false,
  ignores: ['README.md', '.vscode/**'],
})
  .append({
    files: ['src/configs/**', 'src/types/plugins.d.ts'],
    rules: {
      'ts/no-explicit-any': 'off',
    },
  })
