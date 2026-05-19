import type { Awaitable, PresetOptions, TypedFlatConfigItem } from './types'

import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { javascript } from './configs/javascript'
import { ignores } from './configs/ignores'

const DEFAULT_OPTIONS: PresetOptions = {
  javascript: true,
  typescript: true,
  react: false,
  vue: false,
  jsonc: true,
  yaml: true,
  toml: false,
  markdown: false,
  css: false,
  graphql: false,
  xml: false,
  astro: false,
  svelte: false,
  comments: true,
  renamePlugins: true,
}

export function lintPreset(
  options: PresetOptions = {},
  ...userConfigs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
): FlatConfigComposer<TypedFlatConfigItem> {
  const opts: PresetOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>> = []

  // Ignores
  configs.push(ignores(opts.ignores))

  // Base JavaScript
  if (opts.javascript !== false) {
    configs.push(javascript({ overrides: opts.overrides }))
  }

  // TypeScript
  if (opts.typescript) {
    const tsOpts = typeof opts.typescript === 'object'
      ? { overrides: opts.overrides, tsconfigPath: opts.typescript.tsconfigPath }
      : { overrides: opts.overrides }
    configs.push(
      import('./configs/typescript').then(m => m.typescript(tsOpts))
    )
  }

  // React
  if (opts.react) {
    const reactVersion = typeof opts.react === 'object' ? opts.react.version : undefined
    configs.push(
      import('./configs/react').then(m => m.react({ overrides: opts.overrides, version: reactVersion }))
    )
  }

  // Vue
  if (opts.vue) {
    configs.push(
      import('./configs/vue').then(m => m.vue({ overrides: opts.overrides }))
    )
  }

  // JSONC
  if (opts.jsonc) {
    configs.push(
      import('./configs/jsonc').then(m => m.jsonc({ overrides: opts.overrides }))
    )
  }

  // YAML
  if (opts.yaml) {
    configs.push(
      import('./configs/yaml').then(m => m.yaml({ overrides: opts.overrides }))
    )
  }

  // TOML
  if (opts.toml) {
    configs.push(
      import('./configs/toml').then(m => m.toml({ overrides: opts.overrides }))
    )
  }

  // Markdown
  if (opts.markdown) {
    configs.push(
      import('./configs/markdown').then(m => m.markdown({ overrides: opts.overrides }))
    )
  }

  // CSS
  if (opts.css) {
    configs.push(
      import('./configs/css').then(m => m.css({ overrides: opts.overrides }))
    )
  }

  // GraphQL
  if (opts.graphql) {
    configs.push(
      import('./configs/graphql').then(m => m.graphql({ overrides: opts.overrides }))
    )
  }

  // XML
  if (opts.xml) {
    configs.push(
      import('./configs/xml').then(m => m.xml({ overrides: opts.overrides }))
    )
  }

  // Astro
  if (opts.astro) {
    configs.push(
      import('./configs/astro').then(m => m.astro({ overrides: opts.overrides }))
    )
  }

  // Svelte
  if (opts.svelte) {
    configs.push(
      import('./configs/svelte').then(m => m.svelte({ overrides: opts.overrides }))
    )
  }

  // Comments
  if (opts.comments !== false) {
    configs.push(
      import('./configs/comments').then(m => m.comments())
    )
  }

  // Build the composer with all configs
  const composer = new FlatConfigComposer<TypedFlatConfigItem>(
    ...configs,
    ...userConfigs
  )

  if (opts.renamePlugins) {
    composer.renamePlugins({
      '@typescript-eslint': 'ts',
    })
  }

  return composer
}
