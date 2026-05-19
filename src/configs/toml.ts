import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'

import { GLOB_TOML } from '../globs'

export async function toml(
  options: OptionsOverrides & OptionsFiles & { indent?: number | 'tab' } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, indent = 2 } = options
  const files = options.files ?? [GLOB_TOML]

  const [{ default: pluginToml }] = await Promise.all([
    import('eslint-plugin-toml'),
  ])

  return [
    {
      name: 'suressk/toml/setup',
      plugins: {
        toml: pluginToml as any,
      },
    },
    {
      name: 'suressk/toml/rules',
      files,
      languageOptions: {
        parser: (await import('toml-eslint-parser')) as any,
      },
      rules: {
        'toml/comma-style': 'error',
        'toml/indent': ['warn', indent],
        'toml/keys-order': 'off',
        'toml/no-mixed-type-arrays': 'error',
        'toml/no-non-decimal-integers': 'error',
        'toml/no-space-dots': 'error',
        'toml/no-unreadable-number-separator': 'error',
        'toml/precision-of-fractional-seconds': 'error',
        'toml/precision-of-integers': 'error',
        'toml/tables-order': 'error',
        'toml/vue-custom-block/no-parsing-error': 'error',

        ...overrides,
      },
    },
  ]
}
