import type { OptionsFiles, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { GLOB_YAML } from '../globs'
import { tryInteropDefault } from '../utils'

export async function yaml(
  options: OptionsOverrides & OptionsFiles & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, stylistic: stylisticOpt = true } = options

  const indent = typeof stylisticOpt === 'object' && stylisticOpt.indent ? stylisticOpt.indent : 2

  const [pluginYml, parserYaml] = await Promise.all([
    tryInteropDefault(import('eslint-plugin-yml')),
    tryInteropDefault(import('yaml-eslint-parser')),
  ] as const)

  if (!pluginYml || !parserYaml)
    return []

  return [
    {
      name: 'suressk/yaml/setup',
      plugins: {
        yaml: pluginYml as any,
      },
    },
    {
      files: [GLOB_YAML],
      name: 'suressk/yaml/rules',
      languageOptions: {
        parser: parserYaml,
      },
      rules: {
        'yaml/indent': ['warn', indent],
        'yaml/quotes': ['warn', { prefer: 'single' }],
        'yaml/no-empty-document': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-mapping-value': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'warn',

        ...overrides,
      },
    },
  ]
}
