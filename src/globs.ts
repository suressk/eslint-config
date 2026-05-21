// JavaScript / TypeScript
export const GLOB_JS = '**/*.?([cm])js'
export const GLOB_JSX = '**/*.?([cm])jsx'
export const GLOB_TS = '**/*.?([cm])ts'
export const GLOB_TSX = '**/*.?([cm])tsx'
export const GLOB_SRC = '**/*.?([cm])[tj]s?(x)'
export const GLOB_SRC_EXT = '?([cm])[tj]s?(x)'

// Vue / Astro
export const GLOB_VUE = '**/*.vue'
export const GLOB_ASTRO = '**/*.astro'
export const GLOB_ASTRO_TS = '**/*.astro/*.ts'
export const GLOB_SVELTE = '**/*.svelte'

// Styles
export const GLOB_CSS = '**/*.css'
export const GLOB_LESS = '**/*.less'
export const GLOB_SCSS = '**/*.scss'
export const GLOB_POSTCSS = '**/*.{pcss,postcss}'
export const GLOB_STYLE = '**/*.{css,less,scss,pcss,postcss}'

// Markup / Data
export const GLOB_HTML = '**/*.htm?(l)'
export const GLOB_XML = '**/*.xml'
export const GLOB_SVG = '**/*.svg'
export const GLOB_JSON = '**/*.json'
export const GLOB_JSONC = '**/*.jsonc'
export const GLOB_JSON5 = '**/*.json5'
export const GLOB_YAML = '**/*.y?(a)ml'
export const GLOB_TOML = '**/*.toml'
export const GLOB_MARKDOWN = '**/*.md'
export const GLOB_MARKDOWN_CODE = '**/*.md/**/*.?([cm])[tj]s?(x)'
export const GLOB_GRAPHQL = '**/*.{gql,graphql}'

// Tests
export const GLOB_TESTS = ['**/__tests__/**', '**/*.test.?([cm])[tj]s?(x)', '**/*.spec.?([cm])[tj]s?(x)', '**/*.bench.?([cm])[tj]s?(x)']

// Default ignores
export const GLOB_EXCLUDE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/.output/**',
  '**/package-lock.json',
  '**/pnpm-lock.yaml',
  '**/yarn.lock',
  '**/bun.lockb',
  '**/CHANGELOG.md',
  '**/*.min.*',
]
