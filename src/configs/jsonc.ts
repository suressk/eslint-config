import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs'
import { tryInteropDefault } from '../utils'

export async function jsonc(
  options: OptionsOverrides & OptionsFiles & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, stylistic: stylisticOpt = true } = options

  const pluginJsonc = await tryInteropDefault(import('eslint-plugin-jsonc'))
  if (!pluginJsonc)
    return []

  const indent = typeof stylisticOpt === 'object' && stylisticOpt.indent ? stylisticOpt.indent : 2

  const commonRules: Record<string, unknown> = {
    'jsonc/no-dupe-keys': 'error',
    'jsonc/indent': ['warn', indent],
    'jsonc/sort-array-values': 'off',
    'jsonc/sort-keys': 'off',
    'jsonc/no-irregular-whitespace': 'warn',
    'jsonc/no-useless-escape': 'warn',
    ...overrides,
  }

  return [
    {
      name: 'suressk/jsonc/setup',
      plugins: {
        jsonc: pluginJsonc as any,
      },
    },
    {
      files: [GLOB_JSON],
      language: 'jsonc/json',
      name: 'suressk/jsonc/json-rules',
      rules: {
        ...commonRules,
        'jsonc/no-comments': 'error',
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-numeric-separators': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/valid-json-number': 'error',
      },
    },
    {
      files: [GLOB_JSONC],
      language: 'jsonc/jsonc',
      name: 'suressk/jsonc/jsonc-rules',
      rules: {
        ...commonRules,
        'jsonc/no-comments': 'off',
        'jsonc/comma-dangle': ['error', 'never'],
      },
    },
    {
      files: [GLOB_JSON5],
      language: 'jsonc/json5',
      name: 'suressk/jsonc/json5-rules',
      rules: {
        ...commonRules,
        'jsonc/no-comments': 'off',
        'jsonc/comma-dangle': 'off',
      },
    },
  ]
}
