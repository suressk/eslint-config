import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { Linter } from 'eslint'

export type Awaitable<T> = T | Promise<T>

export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins'> & {
  plugins?: Record<string, unknown>
  rules?: Record<string, Linter.RuleEntry>
}

export interface OptionsFiles {
  files?: string[]
}

export interface OptionsOverrides {
  overrides?: Record<string, string | [string, ...unknown[]]>
}

export interface OptionsStylistic {
  indent?: number | 'tab'
}

export interface StylisticOptions {
  indent?: number | 'tab'
  quotes?: 'single' | 'double'
  semi?: boolean
}

export interface PresetOptions extends OptionsOverrides {
  ignores?: string[]

  javascript?: boolean
  typescript?: boolean | { tsconfigPath?: string }
  react?: boolean | { version?: string }
  vue?: boolean
  jsonc?: boolean
  yaml?: boolean
  toml?: boolean
  markdown?: boolean
  css?: boolean
  graphql?: boolean
  xml?: boolean
  astro?: boolean
  svelte?: boolean
  comments?: boolean

  stylistic?: boolean | StylisticOptions
  renamePlugins?: boolean
}

export type Preset = (
  options?: PresetOptions,
  ...userConfigs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
) => FlatConfigComposer<TypedFlatConfigItem>
