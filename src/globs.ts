// JavaScript / TypeScript
export const GLOB_JS = '**/*.?([cm])js'
export const GLOB_JSX = '**/*.?([cm])jsx'
export const GLOB_TS = '**/*.?([cm])ts'
export const GLOB_TSX = '**/*.?([cm])tsx'

// Combined
export const GLOB_SRC = '**/*.?([cm])[tj]s?(x)'
export const GLOB_SRC_EXT = '?([cm])[tj]s?(x)'

// Vue
export const GLOB_VUE = '**/*.vue'

// JSON / JSONC / JSON5
export const GLOB_JSON = '**/*.json'
export const GLOB_JSONC = '**/*.jsonc'
export const GLOB_JSON5 = '**/*.json5'

// YAML / YML
export const GLOB_YAML = '**/*.y?(a)ml'

// TOML
export const GLOB_TOML = '**/*.toml'

// Markdown
export const GLOB_MARKDOWN = '**/*.md'

// HTML
export const GLOB_HTML = '**/*.htm?(l)'

// CSS / CSS Preprocessors
export const GLOB_CSS = '**/*.css'
export const GLOB_LESS = '**/*.less'
export const GLOB_SCSS = '**/*.scss'
export const GLOB_POSTCSS = '**/*.{pcss,postcss}'
export const GLOB_STYLE = '**/*.{css,less,scss,pcss,postcss}'

// GraphQL
export const GLOB_GRAPHQL = '**/*.{gql,graphql}'

// XML
export const GLOB_XML = '**/*.xml'

// Astro
export const GLOB_ASTRO = '**/*.astro'

// Svelte
export const GLOB_SVELTE = '**/*.svelte'

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
]
