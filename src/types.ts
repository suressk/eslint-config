import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

export type Awaitable<T> = T | Promise<T>

export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins' | 'rules'> & {
  plugins?: Record<string, unknown>
  rules?: Record<string, unknown>
}

export interface OptionsFiles {
  files?: string[]
}

export interface OptionsOverrides {
  overrides?: Record<string, unknown>
}

export interface OptionsComponentExts {
  componentExts?: string[]
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig {
  indent?: number | 'tab'
  jsx?: boolean
  quotes?: 'single' | 'double'
  semi?: boolean
  braceStyle?: '1tbs' | 'stroustrup' | 'allman'
}

export interface OptionsTypeScriptWithTypes {
  tsconfigPath?: string
}

export interface OptionsTypeScriptParserOptions {
  parserOptions?: Record<string, unknown>
}

export interface OptionsProjectType {
  type?: 'app' | 'lib'
}

export interface PresetOptions extends OptionsOverrides {
  // Ignores
  ignores?: string[]

  // Core features (always on by default)
  javascript?: boolean
  typescript?: boolean | (OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions)
  comments?: boolean
  imports?: boolean | OptionsOverrides
  perfectionist?: boolean | OptionsOverrides
  unicorn?: boolean | { allRecommended?: boolean } & OptionsOverrides
  node?: boolean | OptionsOverrides
  jsdoc?: boolean | OptionsOverrides
  regexp?: boolean | OptionsOverrides
  test?: boolean | OptionsOverrides
  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  // Frameworks (opt-in)
  vue?: boolean | OptionsOverrides
  react?: boolean | OptionsOverrides
  svelte?: boolean | OptionsOverrides
  astro?: boolean | OptionsOverrides

  // Data formats
  jsonc?: boolean | OptionsOverrides
  yaml?: boolean | OptionsOverrides
  toml?: boolean | OptionsOverrides
  markdown?: boolean | OptionsOverrides
  formatters?: boolean | OptionsOverrides

  // Other
  css?: boolean | OptionsOverrides
  graphql?: boolean | OptionsOverrides
  xml?: boolean | OptionsOverrides

  // Settings
  renamePlugins?: boolean
  componentExts?: string[]
  lessOpinionated?: boolean
  isInEditor?: boolean
  jsx?: boolean | OptionsOverrides
}

export type Preset = (
  options?: PresetOptions,
  ...userConfigs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
) => FlatConfigComposer<TypedFlatConfigItem>
