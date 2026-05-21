import type { OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types'

import { pluginImportLite } from '../plugins'

export async function imports(
  options: OptionsOverrides & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, stylistic = true } = options

  return [
    {
      name: 'suressk/imports/rules',
      plugins: {
        import: pluginImportLite,
      },
      rules: {
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',

        ...(stylistic
          ? { 'import/newline-after-import': ['error', { count: 1 }] }
          : {}),

        ...overrides,
      },
    },
  ]
}
