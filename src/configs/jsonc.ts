import type { OptionsOverrides, OptionsFiles, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { GLOB_JSON, GLOB_JSONC, GLOB_JSON5 } from '../globs'

export async function jsonc(
  options: OptionsOverrides & OptionsFiles & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, indent = 2 } = options

  const [{ default: pluginJsonc }] = await Promise.all([
    import('eslint-plugin-jsonc'),
  ])

  const commonRules: Record<string, unknown> = {
    'jsonc/no-dupe-keys': 'error',
    'jsonc/indent': ['warn', indent],
    'jsonc/sort-array-values': 'off',
    'jsonc/sort-keys': 'off',
    'jsonc/no-irregular-whitespace': 'warn',
    'jsonc/no-useless-escape': 'warn',
    'jsonc/space-unary-ops': 'error',
    'jsonc/vue-custom-block/no-parsing-error': 'error',
    ...overrides,
  }

  return [
    {
      name: 'suressk/jsonc/setup',
      plugins: {
        jsonc: pluginJsonc as any,
      },
    },
    // JSON (strict)
    {
      name: 'suressk/jsonc/json-rules',
      files: [GLOB_JSON],
      language: 'jsonc/json',
      rules: {
        ...commonRules,
        'jsonc/no-comments': 'error',
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-escape-sequence-in-identifier': 'error',
        'jsonc/no-hexadecimal-numeric-literals': 'error',
        'jsonc/no-octal-numeric-literals': 'error',
        'jsonc/no-numeric-separators': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/no-undefined-value': 'error',
        'jsonc/no-unicode-codepoint-escapes': 'error',
        'jsonc/valid-json-number': 'error',
      },
    },
    // JSONC (JSON with comments)
    {
      name: 'suressk/jsonc/jsonc-rules',
      files: [GLOB_JSONC],
      language: 'jsonc/jsonc',
      rules: {
        ...commonRules,
        'jsonc/no-comments': 'off',
        'jsonc/comma-dangle': ['error', 'never'],
      },
    },
    // JSON5
    {
      name: 'suressk/jsonc/json5-rules',
      files: [GLOB_JSON5],
      language: 'jsonc/json5',
      rules: {
        ...commonRules,
        'jsonc/no-comments': 'off',
        'jsonc/comma-dangle': 'off',
      },
    },
  ]
}
