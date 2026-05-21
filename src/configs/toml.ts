import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { GLOB_TOML } from '../globs'
import { tryInteropDefault } from '../utils'

export async function toml(
  options: OptionsOverrides & OptionsFiles & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, stylistic: stylisticOpt = true } = options

  const indent = typeof stylisticOpt === 'object' && stylisticOpt.indent ? stylisticOpt.indent : 2

  const [pluginToml, parserToml] = await Promise.all([
    tryInteropDefault(import('eslint-plugin-toml')),
    tryInteropDefault(import('toml-eslint-parser')),
  ] as const)

  if (!pluginToml || !parserToml)
    return []

  return [
    {
      name: 'suressk/toml/setup',
      plugins: {
        toml: pluginToml as any,
      },
    },
    {
      files: [GLOB_TOML],
      name: 'suressk/toml/rules',
      languageOptions: {
        parser: parserToml,
      },
      rules: {
        'toml/indent': ['warn', indent],
        'toml/keys-order': 'off',
        'toml/no-mixed-type-arrays': 'error',
        'toml/no-space-dots': 'error',
        'toml/tables-order': 'error',

        ...overrides,
      },
    },
  ]
}
