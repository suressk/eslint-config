import type { OptionsOverrides, OptionsFiles, TypedFlatConfigItem } from '../types'

import { GLOB_YAML } from '../globs'

export async function yaml(
  options: OptionsOverrides & OptionsFiles & { indent?: number | 'tab' } = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, indent = 2 } = options
  const files = options.files ?? [GLOB_YAML]

  const [{ default: pluginYml }] = await Promise.all([
    import('eslint-plugin-yml'),
  ])

  return [
    {
      name: 'suressk/yaml/setup',
      plugins: {
        yaml: pluginYml as any,
      },
    },
    {
      name: 'suressk/yaml/rules',
      files,
      languageOptions: {
        parser: (await import('yaml-eslint-parser')) as any,
      },
      rules: {
        'yaml/indent': ['warn', indent],
        'yaml/quotes': ['warn', { prefer: 'single' }],
        'yaml/no-empty-document': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-mapping-value': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'warn',
        'yaml/plain-scalar': 'off',
        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...overrides,
      },
    },
  ]
}
